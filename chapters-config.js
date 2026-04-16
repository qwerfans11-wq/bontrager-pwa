// Offline chapter configuration — maps logical chapters to image filename prefixes.
// Image lists are resolved at runtime from IMAGE_DATA (defined in index.html).

const OFFLINE_CHAPTERS = [
  {
    id: 'shoulder_upper',
    name: 'Shoulder & Upper Arm',
    nameAr: 'الكتف والعضد العلوي',
    icon: '🦾',
    category: 'Upper Extremity',
    prefixes: ['Shoulder', 'Humerus', 'Scapula', 'AC', 'Clavicle'],
    estimatedImages: 95
  },
  {
    id: 'elbow',
    name: 'Elbow',
    nameAr: 'الكوع',
    icon: '💪',
    category: 'Upper Extremity',
    prefixes: ['Elbow'],
    estimatedImages: 26
  },
  {
    id: 'forearm_wrist',
    name: 'Forearm & Wrist',
    nameAr: 'الساعد والرسغ',
    icon: '🤝',
    category: 'Upper Extremity',
    prefixes: ['Forearm', 'Wrist'],
    estimatedImages: 31
  },
  {
    id: 'hand_digits',
    name: 'Hand & Digits',
    nameAr: 'اليد والأصابع',
    icon: '✋',
    category: 'Upper Extremity',
    prefixes: ['Hand', 'Fingers', 'Thumb'],
    estimatedImages: 46
  },
  {
    id: 'chest',
    name: 'Chest',
    nameAr: 'الصدر',
    icon: '🫁',
    category: 'Trunk',
    prefixes: ['Chest', 'Ribs'],
    estimatedImages: 0
  },
  {
    id: 'abdomen',
    name: 'Abdomen',
    nameAr: 'البطن',
    icon: '⚕️',
    category: 'Trunk',
    prefixes: ['Abdomen'],
    estimatedImages: 0
  },
  {
    id: 'spine',
    name: 'Spine',
    nameAr: 'العمود الفقري',
    icon: '🦴',
    category: 'Axial',
    prefixes: ['Spine', 'Cervical', 'Thoracic', 'Lumbar', 'Sacrum'],
    estimatedImages: 0
  }
];

/**
 * Returns a deduplicated list of image filenames for a chapter.
 * Resolves against IMAGE_DATA (must be defined globally in index.html).
 * @param {Object} chapter - an entry from OFFLINE_CHAPTERS
 * @returns {string[]} array of filenames (e.g. ["Shoulder_AP_External_Rotation_Xray.jpeg", ...])
 */
function getChapterImageList(chapter) {
  if (typeof IMAGE_DATA === 'undefined') return [];
  const seen = new Set();
  const files = [];
  Object.entries(IMAGE_DATA).forEach(([key, val]) => {
    const matches = chapter.prefixes.some(p =>
      key === p || key.startsWith(p + '_')
    );
    if (matches) {
      (val.positions || []).forEach(f => { if (!seen.has(f)) { seen.add(f); files.push(f); } });
      (val.xrays || []).forEach(f => { if (!seen.has(f)) { seen.add(f); files.push(f); } });
    }
  });
  return files;
}

/**
 * Returns the full chapter object (with resolved image list) for a given id.
 * @param {string} chapterId
 * @returns {Object|null}
 */
function getChapterById(chapterId) {
  return OFFLINE_CHAPTERS.find(c => c.id === chapterId) || null;
}
