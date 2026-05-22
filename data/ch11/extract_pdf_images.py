import base64
import json
import os
import re
import sys
from typing import Dict, List, Optional, Tuple

import fitz  # PyMuPDF


OUTPUT_FOLDER = "extracted_images"
MAX_FILENAME_LEN = 170

# Start extraction from Bontrager chapter 11 reference pages
START_PAGE = 38
END_PAGE = 49

# Search for caption below image
CAPTION_SEARCH_MARGIN_BELOW = 95.0
CAPTION_SEARCH_MARGIN_SIDE = 18.0

# Ignore tiny images/thumbnails
IMG_MIN_WIDTH = 80
IMG_MIN_HEIGHT = 80
IMG_MIN_AREA = 12_000

FIG_PATTERN = re.compile(r"(?i)\b(?:fig(?:ure)?\.?\s*\d+(?:\.\d+)?[A-Za-z]?)\b")


def sanitize_filename(name: str) -> str:
    text = (name or "").strip()
    text = text.replace("\u2014", "-").replace("\u2013", "-").replace("\u2212", "-")
    text = text.replace("°", " deg")
    text = re.sub(r"[\r\n\t]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r'[\\/*?:"<>|]', "_", text)
    text = re.sub(r"\s+", " ", text).strip()
    text = text.rstrip(". ")
    return text[:MAX_FILENAME_LEN].rstrip(". ")


def horizontal_overlap_ratio(a: Tuple[float, float, float, float], b: Tuple[float, float, float, float]) -> float:
    ax0, _, ax1, _ = a
    bx0, _, bx1, _ = b
    overlap = max(0.0, min(ax1, bx1) - max(ax0, bx0))
    width = max(1.0, ax1 - ax0)
    return overlap / width


def extract_text_lines(page: fitz.Page) -> List[Dict]:
    lines: List[Dict] = []
    data = page.get_text("dict")
    for block in data.get("blocks", []):
        if block.get("type") != 0:
            continue
        for line in block.get("lines", []):
            spans = line.get("spans", [])
            parts = []
            for sp in spans:
                t = (sp.get("text") or "").strip()
                if t:
                    parts.append(t)
            if not parts:
                continue
            text = " ".join(parts)
            x0, y0, x1, y1 = line.get("bbox", (0, 0, 0, 0))
            lines.append({"text": re.sub(r"\s+", " ", text).strip(), "bbox": (x0, y0, x1, y1)})
    return lines


def split_caption_candidates(line_text: str) -> List[str]:
    txt = re.sub(r"\s+", " ", (line_text or "")).strip()
    if not txt:
        return []

    matches = list(FIG_PATTERN.finditer(txt))
    if not matches:
        return [txt]

    segments = []
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(txt)
        seg = txt[start:end].strip(" -;,")
        if seg:
            segments.append(seg)
    return segments or [txt]


def score_caption(image_bbox: Tuple[float, float, float, float], line_bbox: Tuple[float, float, float, float], caption_text: str) -> float:
    _, _, _, iy1 = image_bbox
    _, ly0, _, _ = line_bbox
    dy = ly0 - iy1
    overlap = horizontal_overlap_ratio(image_bbox, line_bbox)

    score = 0.0
    score += max(0.0, 120.0 - abs(dy))
    score += overlap * 140.0

    if dy >= -3:
        score += 45.0
    else:
        score -= 25.0

    if FIG_PATTERN.search(caption_text):
        score += 220.0

    if len(caption_text) > 140:
        score -= 120.0
    elif len(caption_text) > 100:
        score -= 60.0

    return score


def find_best_caption_for_image(
    image_bbox: Tuple[float, float, float, float],
    page_lines: List[Dict],
) -> Optional[str]:
    ix0, iy0, ix1, iy1 = image_bbox

    candidates: List[Tuple[float, str]] = []

    for ln in page_lines:
        bx0, by0, bx1, by1 = ln["bbox"]

        if by0 < iy1 - 4:
            continue
        if by0 > iy1 + CAPTION_SEARCH_MARGIN_BELOW:
            continue

        overlap = horizontal_overlap_ratio(image_bbox, ln["bbox"])
        center_gap = abs(((bx0 + bx1) / 2.0) - ((ix0 + ix1) / 2.0))
        max_center_gap = (ix1 - ix0) / 2.0 + CAPTION_SEARCH_MARGIN_SIDE
        if overlap < 0.12 and center_gap > max_center_gap:
            continue

        for seg in split_caption_candidates(ln["text"]):
            if len(seg) < 5:
                continue
            sc = score_caption(image_bbox, ln["bbox"], seg)
            candidates.append((sc, seg))

    if not candidates:
        for ln in page_lines:
            bx0, by0, bx1, by1 = ln["bbox"]
            if by0 < iy0 - 25 or by1 > iy1 + CAPTION_SEARCH_MARGIN_BELOW + 25:
                continue
            if horizontal_overlap_ratio(image_bbox, ln["bbox"]) < 0.08:
                continue
            for seg in split_caption_candidates(ln["text"]):
                if len(seg) < 5:
                    continue
                sc = score_caption(image_bbox, ln["bbox"], seg)
                candidates.append((sc, seg))

    if not candidates:
        return None

    candidates.sort(key=lambda x: x[0], reverse=True)
    best = candidates[0][1]

    m = FIG_PATTERN.search(best)
    if m and m.start() > 0:
        best = best[m.start():].strip()

    return best


def extract_image_normalized(
    doc: fitz.Document,
    page: fitz.Page,
    image_rect: fitz.Rect,
    xref: int,
) -> Optional[Tuple[bytes, str, int, int]]:
    try:
        clip = fitz.Rect(image_rect)
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=clip, alpha=False)
        if pix.width > 0 and pix.height > 0:
            img_bytes = pix.tobytes("png")
            return img_bytes, "png", int(pix.width), int(pix.height)
    except Exception:
        pass

    try:
        pix = fitz.Pixmap(doc, xref)
    except Exception:
        pix = None

    if pix is not None:
        try:
            if pix.colorspace is not None and pix.colorspace.n > 3:
                pix_rgb = fitz.Pixmap(fitz.csRGB, pix)
                pix = pix_rgb

            img_bytes = pix.tobytes("png")
            return img_bytes, "png", int(pix.width), int(pix.height)
        except Exception:
            pass

    try:
        raw = doc.extract_image(xref)
    except Exception:
        return None

    img_bytes = raw.get("image")
    if not img_bytes:
        return None
    img_ext = (raw.get("ext") or "png").lower()
    img_w = int(raw.get("width") or 0)
    img_h = int(raw.get("height") or 0)
    return img_bytes, img_ext, img_w, img_h


def _mime_for_ext(ext: str) -> str:
    ext = (ext or "").lower().strip(".")
    if ext in ("jpg", "jpeg"):
        return "image/jpeg"
    if ext == "gif":
        return "image/gif"
    if ext == "webp":
        return "image/webp"
    return "image/png"


def build_ch11_data_js(out_dir: str, page_image_map: Dict[str, List[str]], output_js_path: str) -> None:
    inline_data = {}
    for page in sorted(page_image_map.keys(), key=lambda x: int(x)):
        for fname in page_image_map[page]:
            fp = os.path.join(out_dir, fname)
            if not os.path.exists(fp):
                continue
            ext = os.path.splitext(fname)[1].lstrip(".").lower() or "png"
            mime = _mime_for_ext(ext)
            with open(fp, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("ascii")
            inline_data[fname] = f"data:{mime};base64,{b64}"

    lines = [
        "(function(g){",
        "  g.CH11_INLINE_IMAGE_DATA = g.CH11_INLINE_IMAGE_DATA || Object.create(null);",
        f"  Object.assign(g.CH11_INLINE_IMAGE_DATA, {json.dumps(inline_data, ensure_ascii=False, separators=(',', ':'))});",
        f"  g.CH11_PAGE_IMAGE_MAP = {json.dumps(page_image_map, ensure_ascii=False, separators=(',', ':'))};",
        "})(typeof window !== 'undefined' ? window : globalThis);",
        "",
    ]

    with open(output_js_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def extract_images_from_pdf(pdf_path: str) -> None:
    pdf_dir = os.path.dirname(os.path.abspath(pdf_path))
    script_dir = os.path.dirname(os.path.abspath(__file__))
    out_dir = os.path.join(script_dir, OUTPUT_FOLDER)
    os.makedirs(out_dir, exist_ok=True)

    print(f"\n📄 ملف PDF: {pdf_path}")
    print(f"📁 مجلد الحفظ: {out_dir}")
    print(f"🚀 بدء الاستخراج من الصفحة: {START_PAGE} حتى {END_PAGE}\n")

    doc = fitz.open(pdf_path)
    counters: Dict[str, int] = {}
    page_image_map: Dict[str, List[str]] = {}
    total_saved = 0

    for page_idx in range(len(doc)):
        page = doc[page_idx]
        page_no = page_idx + 1

        if page_no < START_PAGE:
            continue
        if END_PAGE and page_no > END_PAGE:
            continue

        lines = extract_text_lines(page)
        image_infos = page.get_image_info(xrefs=True)
        if not image_infos:
            continue

        seen_on_page = set()
        page_key = str(page_no)

        for img_i, info in enumerate(image_infos, start=1):
            xref = int(info.get("xref") or 0)
            bbox = info.get("bbox")
            if xref <= 0 or not bbox:
                continue

            rect = fitz.Rect(bbox)
            dedupe_key = (xref, round(rect.x0, 2), round(rect.y0, 2), round(rect.x1, 2), round(rect.y1, 2))
            if dedupe_key in seen_on_page:
                continue
            seen_on_page.add(dedupe_key)

            normalized = extract_image_normalized(doc, page, rect, xref)
            if not normalized:
                print(f"  ⚠️ صفحة {page_no}: تعذر استخراج xref={xref}")
                continue

            img_bytes, img_ext, img_w, img_h = normalized

            if not img_bytes:
                continue
            if img_w < IMG_MIN_WIDTH or img_h < IMG_MIN_HEIGHT or (img_w * img_h) < IMG_MIN_AREA:
                continue

            image_bbox = (rect.x0, rect.y0, rect.x1, rect.y1)
            caption = find_best_caption_for_image(image_bbox, lines)

            if caption:
                base = sanitize_filename(f"Page{page_no}_{caption}")
            else:
                base = sanitize_filename(f"Page{page_no}_image_{img_i}")

            if not base:
                base = f"Page{page_no}_image_{img_i}"

            n = counters.get(base, 0)
            counters[base] = n + 1
            file_name = f"{base}.{img_ext}" if n == 0 else f"{base}_{n}.{img_ext}"
            out_path = os.path.join(out_dir, file_name)

            with open(out_path, "wb") as f:
                f.write(img_bytes)

            page_image_map.setdefault(page_key, []).append(file_name)
            total_saved += 1

            shown_caption = caption if caption else "(no caption found)"
            print(f"  ✅ Page {page_no} | Caption: {shown_caption}")
            print(f"     → {file_name}")

    doc.close()

    output_js_path = os.path.join(script_dir, "ch11-data.js")
    build_ch11_data_js(out_dir, page_image_map, output_js_path)

    print(f"\n🧩 Updated CH11 data file: {output_js_path}")
    print(f"🎉 Done. Extracted {total_saved} image files to: {out_dir}\n")


def main() -> None:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_pdf = os.path.abspath(
        os.path.join(script_dir, "..", "..", "bonbook", "Chapter_11_Cranium_Facial_Bones_and_Paranasal_Sinuses.pdf")
    )

    if len(sys.argv) > 1:
        pdf_path = os.path.abspath(sys.argv[1])
    else:
        pdf_path = default_pdf

    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        sys.exit(1)

    extract_images_from_pdf(pdf_path)


if __name__ == "__main__":
    main()
