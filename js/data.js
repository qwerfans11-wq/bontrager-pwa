// ══════════════════════════════════════════════
// DATA MODULE — BOOK, QUIZ, IMAGE_DATA
// ══════════════════════════════════════════════

// The BOOK object contains the hierarchical structure of the radiographic positioning guide
const BOOK = {
  chest: {
    name: '🫁 Chest',
    icon: '🫁',
    positions: [
      { name: 'PA Projection — Chest (Ambulatory)', type: 'routine', info: { desc: 'Standard PA chest examination', cr: 'Perpendicular to IR at T7', ir: '35×43 cm (14×17 in)', sid: '180 cm (72 in)', kv: '110–125 kVp', resp: 'End of second full inspiration' } },
      { name: 'Lateral Position — Chest', type: 'routine', info: { desc: 'Left lateral preferred', cr: 'Perpendicular to IR at T7', ir: '35×43 cm (14×17 in)', sid: '180 cm (72 in)', kv: '110–125 kVp', resp: 'End of second full inspiration' } },
      { name: 'AP Projection — Chest (Supine)', type: 'special', info: { desc: 'For patients unable to stand', cr: '5° caudad', ir: '35×43 cm (14×17 in)', sid: '180 cm (72 in)', kv: '110–125 kVp', resp: 'End of second full inspiration' } },
    ]
  },
  abdomen: {
    name: '🫀 Abdomen',
    icon: '🫀',
    positions: [
      { name: 'AP Projection — Supine (KUB)', type: 'routine', info: { desc: 'Standard supine abdominal projection', cr: 'Perpendicular to IR at iliac crest', ir: '35×43 cm (14×17 in)', sid: '100 cm (40 in)', kv: '70–85 kVp', resp: 'Suspended expiration' } },
      { name: 'Lateral Decubitus — Abdomen', type: 'special', info: { desc: 'For air-fluid levels', cr: 'Horizontal beam 2 inches above crest', ir: '35×43 cm (14×17 in)', sid: '100 cm (40 in)', kv: '70–85 kVp', resp: 'Suspended expiration' } },
    ]
  },
  spine: {
    name: '🦴 Spine',
    icon: '🦴',
    subchapters: {
      cervical: {
        name: 'Cervical Spine',
        icon: '🔵',
        positions: [
          { name: 'AP Open Mouth — C1 & C2', type: 'routine', info: { desc: 'Demonstrates C1-C2 and odontoid process', cr: 'Perpendicular through open mouth', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '70–85 kVp', resp: 'Suspend respiration' } },
          { name: 'AP Axial — C3 to C7', type: 'routine', info: { desc: 'Demonstrates C3 to T2', cr: '15°–20° cephalad to C4', ir: '18×24 cm', sid: '100 cm (40 in)', kv: '70–85 kVp', resp: 'Suspend respiration' } },
          { name: 'Lateral Erect — Cervical', type: 'routine', info: { desc: 'True lateral of all cervical vertebrae', cr: 'Perpendicular to C4', ir: '24×30 cm (10×12 in)', sid: '60–72 inches (150–180 cm)', kv: '70–85 kVp', resp: 'Full expiration' } },
        ]
      },
      thoracic: {
        name: 'Thoracic Spine',
        icon: '🟢',
        positions: [
          { name: 'AP Projection — Thoracic', type: 'routine', info: { desc: 'Demonstrates T1–T12', cr: 'Perpendicular to T7', ir: '35×43 cm (14×17 in)', sid: '100 cm (40 in)', kv: '75–90 kVp', resp: 'Suspend on expiration' } },
          { name: 'Lateral Position — Thoracic', type: 'routine', info: { desc: 'True lateral of thoracic vertebrae', cr: 'Perpendicular to T7', ir: '35×43 cm (14×17 in)', sid: '100 cm (40 in)', kv: '80–95 kVp', resp: 'Breathing technique' } },
        ]
      },
      lumbar: {
        name: 'Lumbar Spine',
        icon: '🟠',
        positions: [
          { name: 'AP (or PA) Projection — Lumbar', type: 'routine', info: { desc: 'Standard lumbar spine', cr: 'Perpendicular to iliac crest', ir: '35×43 cm (14×17 in)', sid: '100 cm (40 in)', kv: '75–90 kVp', resp: 'Suspend on expiration' } },
          { name: 'Lateral Position — Lumbar', type: 'routine', info: { desc: 'True lateral of lumbar spine', cr: 'Perpendicular to IR', ir: '35×43 cm (14×17 in)', sid: '100 cm (40 in)', kv: '80–90 kVp', resp: 'Suspend on expiration' } },
          { name: 'Lateral L5–S1 Position', type: 'routine', info: { desc: 'Focused spot of L5–S1', cr: 'Perpendicular or 5°–8° caudad', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '85–95 kVp', resp: 'Suspend respiration' } },
        ]
      }
    }
  }
};

// QUIZ object contains quiz questions linked to chapters
const QUIZ = {
  chest: {
    questions: [
      { text: 'What is the preferred SID for chest X-rays?', options: ['40 inches', '60 inches', '72 inches', '100 inches'], correct: 2, explanation: '72 inches (180 cm) is standard for chest radiography.' },
      { text: 'Which ray should project minimum ribs above diaphragm?', options: ['8', '9', '10', '12'], correct: 2, explanation: 'Minimum 10 posterior ribs should be visible above diaphragm.' }
    ]
  },
  abdomen: {
    questions: [
      { text: 'For a KUB projection, what should be the center point?', options: ['Xiphoid process', 'Iliac crest', 'Symphysis pubis', 'ASIS'], correct: 1, explanation: 'Center to iliac crest level for KUB.' }
    ]
  }
};

// IMAGE_DATA maps image file names to positions
const IMAGE_DATA = {
  'chest-pa': { position: 'PA Chest', images: ['chest_pa.jpg'] },
  'chest-lateral': { position: 'Lateral Chest', images: ['chest_lateral.jpg'] },
  'abdomen-ap': { position: 'KUB', images: ['abdomen_ap.jpg'] },
};

// POSITION_IMAGE_MAP helps with fuzzy matching of position names to image data
const POSITION_IMAGE_MAP = {
  'PA Chest': 'chest-pa',
  'Lateral Chest': 'chest-lateral',
  'KUB': 'abdomen-ap',
};

// Utility function to retrieve images for a position
function getImagesForPos(name) {
  const key = POSITION_IMAGE_MAP[name] || name.toLowerCase().replace(/ /g, '-');
  return IMAGE_DATA[key] ? IMAGE_DATA[key].images : [];
}

// Function to count all chapters and positions
function getStatistics() {
  let chapters = 0, positions = 0;
  for (let ch in BOOK) {
    if (BOOK[ch].subchapters) {
      chapters += Object.keys(BOOK[ch].subchapters).length;
      for (let sch in BOOK[ch].subchapters) {
        positions += (BOOK[ch].subchapters[sch].positions || []).length;
      }
    } else {
      chapters++;
      positions += (BOOK[ch].positions || []).length;
    }
  }
  return { chapters, positions };
}
