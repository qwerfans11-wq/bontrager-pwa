# Bontrager Positioning — Progressive Web App

An offline-capable, mobile-first study guide for radiographic positioning based on **Merrill's Atlas of Radiographic Positions & Radiologic Procedures (10th Edition)**.

---

## 📖 Description

Bontrager PWA is a comprehensive radiography positioning reference and quiz application designed for radiologic technology students and practitioners. It provides detailed positioning guides, interactive X-ray review, AI-powered tutoring, and an interactive anatomy map—all available offline as a Progressive Web App.

---

## ✨ Features

- **📚 Learn Mode** — Step-by-step radiographic positioning guides across 10+ chapters covering chest, abdomen, upper and lower extremities, spine, and skull/facial bones
- **🧠 Quiz Mode** — Chapter-based multiple-choice quizzes with automatic question generation from positioning data, scoring, and best-score tracking
- **🤖 AI Tutor** — Local AI assistant that answers questions about positioning, kVp, SID, CR direction, and clinical indications—no internet required
- **🫀 Anatomy Map** — Interactive full-body skeletal diagram with tap-to-explore anatomical regions and radiography notes
- **📋 Quick Review** — Rapid flashcard-style review of all positions with swipe gestures
- **📖 Book Reader** — Embedded PDF page viewer for direct book-to-app cross-reference
- **🌙 Dark / Light Mode** — Automatic theme switching with system preference support
- **♿ Accessibility** — ARIA labels, keyboard navigation, reduced-motion support, and high-contrast mode
- **📴 Offline Support** — Full Service Worker caching; works without an internet connection after first load

---

## 🚀 Installation

### As a PWA (Recommended)

1. Open the app in **Chrome**, **Edge**, or **Safari**
2. Tap the **"Install"** banner when it appears, or use the browser menu → *Install app*
3. The app will be added to your home screen / desktop and works fully offline

### Local Development

No build toolchain is required — this is a static HTML/CSS/JS project.

```bash
# Serve locally (any static file server works)
python3 -m http.server 8080
# then open http://localhost:8080
```

**Validate JavaScript syntax:**
```bash
find . -name '*.js' -not -path '*/node_modules/*' -type f -print0 | xargs -0 -n1 node --check
```

---

## 🗂 Project Structure

```
bontrager-pwa/
├── index.html              # Main SPA shell (~1400 lines of HTML)
├── styles.css              # All application styles
├── sw.js                   # Service Worker (caching, offline support)
├── manifest.webmanifest    # PWA manifest
│
├── js/                     # Modular JavaScript (loaded in order)
│   ├── utils.js            # Pure utilities: esc(), search helpers, image utils, toast
│   ├── auth.js             # Dev login, role management, appearance controls
│   ├── quiz.js             # Quiz flow, rendering, scoring, and edit functions
│   ├── ui.js               # UI components: dialogs, font settings, image editor/zoom
│   └── core.js             # Data (BOOK, QUIZ, IMAGE_DATA), navigation, AI, PWA, init
│
├── data/                   # Chapter data files (loaded before js/ modules)
│   ├── ch2/, ch3/, ...     # Chapter-specific image maps and position data
│   └── ch10/
│
├── renamed_images/         # Radiographic position and X-ray images
│   └── *.jpeg
│
├── icons/                  # PWA icons (96px – 512px)
└── README.md
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 / CSS3 | Structure and styling (no CSS preprocessor) |
| Vanilla JavaScript (ES5/ES6) | Application logic (no framework, no bundler) |
| Service Worker API | Offline caching and PWA support |
| IndexedDB | Offline image storage via `db.js` |
| Web App Manifest | PWA installability |
| CSS Custom Properties | Theming (dark mode, accent colors, font sizes) |
| SVG | Interactive anatomy body map, icons |

### Key Design Decisions

- **No framework** — Keeps the app lean and fully offline-capable without a build step
- **No ES modules** — All JS files use plain global scope for maximum browser compatibility (including older mobile browsers)
- **Modular file layout** — `app.js` is split into `js/utils.js`, `js/auth.js`, `js/quiz.js`, `js/ui.js`, and `js/core.js` for maintainability
- **XSS protection** — All dynamic HTML injection uses the `esc()` helper function in `js/utils.js`
- **Content Security Policy** — CSP meta tag restricts script execution to same-origin and inline handlers only

---

## 🔒 Security Notes

- The `esc(s)` function in `js/utils.js` escapes `&`, `"`, and `<` before any dynamic data is injected into the DOM
- A `Content-Security-Policy` meta tag blocks external script sources
- Developer mode requires SHA-256 credential verification and is never persisted across sessions

---

## 📄 License

Educational use only. Content is based on *Merrill's Atlas of Radiographic Positions & Radiologic Procedures, 10th Edition*. All radiographic positioning content is copyright of the original authors and publisher.
