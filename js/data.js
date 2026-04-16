// ══════════════════════════════════════════════
// DATA MODULE — Book Structure & Image Mapping
// ══════════════════════════════════════════════

const IMAGES_PATH = 'renamed_images/';

// ═══ BOOK DATA ═══
// Each position has: name, type ('routine'|'special'), imgKey, info{desc,cr,ir,sid,kv,resp}
// imgKey maps to: renamed_images/{imgKey}_Position.jpeg  &  renamed_images/{imgKey}_Xray.jpeg
const BOOK = {
  shoulder: {
    name: 'Shoulder',
    icon: '🦴',
    positions: [
      { name: 'AP External Rotation', type: 'routine', imgKey: 'Shoulder_AP_External_Rotation',
        info: { desc: 'AP projection of the shoulder with the humerus in external rotation (anatomic position). Demonstrates the greater tubercle in profile.', cr: 'Perpendicular to IR, directed to the coracoid process', ir: '24×30 cm (10×12 in) lengthwise', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Internal Rotation', type: 'routine', imgKey: 'Shoulder_AP_Internal_Rotation',
        info: { desc: 'AP projection with the humerus in internal rotation. The lesser tubercle is seen in profile medially.', cr: 'Perpendicular to IR, directed to the coracoid process', ir: '24×30 cm (10×12 in) lengthwise', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Neutral Rotation (Trauma)', type: 'special', imgKey: 'Shoulder_AP_Neutral_Rotation_Trauma',
        info: { desc: 'AP projection in neutral rotation used in trauma when patient cannot rotate the arm. The arm hangs at the side.', cr: 'Perpendicular to IR, directed to the coracoid process', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Oblique Glenoid Cavity (Grashey Method)', type: 'special', imgKey: 'Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method',
        info: { desc: 'Oblique AP projection (RPO/LPO 35–45°) to open the glenohumeral joint space and profile the glenoid cavity in true lateral.', cr: 'Perpendicular to the glenohumeral joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Apical AP Axial Projection', type: 'special', imgKey: 'Shoulder_Apical_AP_Axial_Projection',
        info: { desc: 'Axial AP with 30° caudad angulation. Profiles the apex of the humeral head and detects Hill-Sachs lesions.', cr: '30° caudad, to the glenohumeral joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '75–85 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Apical Oblique Axial (Garth Method)', type: 'special', imgKey: 'Shoulder_AP_Apical_Oblique_Axial_Garth_Method',
        info: { desc: '45° posterior oblique with 45° caudad CR. Demonstrates both Hill-Sachs and Bankart lesions in a single exposure.', cr: '45° caudad, to the glenohumeral joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '75–85 kVp', resp: 'Suspend respiration' } },
      { name: 'Inferosuperior Axial (Lawrence Method)', type: 'special', imgKey: 'Shoulder_Inferosuperior_Axial_Lawrence_Method',
        info: { desc: 'Axial projection with the patient supine, arm abducted 90°. Horizontal beam directed medially 15–25° to demonstrate the axillary shoulder.', cr: 'Horizontal, angled 15–25° medially toward axilla', ir: '18×24 cm (8×10 in) in axilla', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Inferosuperior Axial (Clements Modification)', type: 'special', imgKey: 'Shoulder_Inferosuperior_Axial_Clements_Modification',
        info: { desc: 'Modified axillary projection for patients who cannot abduct the arm. The CR is directed superoinferiorly with a small abduction angle.', cr: 'Perpendicular or slight angle superoinferiorly', ir: '18×24 cm (8×10 in) in axilla', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Axial Transaxillary (Bernageau Method)', type: 'special', imgKey: 'Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method',
        info: { desc: 'PA axial projection through the axilla to profile the inferior glenoid rim and detect Bankart lesions.', cr: 'Horizontal through the axilla', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique Scapular Y Lateral (Trauma)', type: 'special', imgKey: 'Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma',
        info: { desc: 'True lateral of the shoulder in PA oblique (60° from lateral). The scapula is seen as a Y shape; detects shoulder dislocation.', cr: 'Perpendicular to IR, to the glenohumeral joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Tangential Intertubercular Sulcus (Fisk Modification) Erect', type: 'special', imgKey: 'Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Erect',
        info: { desc: 'Tangential (skyline) projection of the bicipital groove. Patient leans forward over a horizontal cassette; CR directed vertically downward.', cr: 'Vertical, 10–15° posteriorly along the long axis of the humerus', ir: '18×24 cm (8×10 in) on table top', sid: '100 cm (40 in)', kv: '70 kVp', resp: 'Suspend respiration' } },
      { name: 'Tangential Intertubercular Sulcus (Fisk Modification) Supine', type: 'special', imgKey: 'Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Supine',
        info: { desc: 'Supine version of the bicipital groove tangential projection.', cr: 'Along the long axis of the humerus, 10–15° toward shoulder', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '70 kVp', resp: 'Suspend respiration' } },
      { name: 'Tangential Supraspinatus Outlet (Neer Method)', type: 'special', imgKey: 'Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method',
        info: { desc: 'PA oblique tangential projection (60°) with 10–15° caudad CR to open the supraspinatus outlet and evaluate impingement.', cr: '10–15° caudad to the AC joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Transthoracic Lateral Proximal Humerus (Trauma) Erect', type: 'special', imgKey: 'Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect',
        info: { desc: 'Lateral projection through the thorax for trauma patients who cannot move the arm. Demonstrates fractures/dislocations of the proximal humerus.', cr: 'Horizontal, perpendicular to IR, through the thorax', ir: '30×35 cm (11×14 in) lengthwise', sid: '100 cm (40 in)', kv: '80–90 kVp', resp: 'Full inspiration, suspend' } },
      { name: 'Transthoracic Lateral Proximal Humerus (Trauma) Supine', type: 'special', imgKey: 'Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Supine',
        info: { desc: 'Supine version of the transthoracic lateral for severely injured patients.', cr: 'Horizontal through the thorax perpendicular to IR', ir: '30×35 cm (11×14 in)', sid: '100 cm (40 in)', kv: '80–90 kVp', resp: 'Full inspiration, suspend' } }
    ]
  },
  humerus: {
    name: 'Humerus',
    icon: '💪',
    positions: [
      { name: 'AP Projection (Erect)', type: 'routine', imgKey: 'Humerus_AP_Projection_Erect',
        info: { desc: 'AP projection of the entire humerus, erect. Includes both shoulder and elbow joints. Arm in external rotation.', cr: 'Perpendicular to mid-humerus', ir: '35×43 cm (14×17 in) lengthwise', sid: '100 cm (40 in)', kv: '65–75 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Projection (Supine)', type: 'routine', imgKey: 'Humerus_AP_Projection_Supine',
        info: { desc: 'AP projection of the humerus with patient supine. Both joints must be included.', cr: 'Perpendicular to mid-humerus', ir: '35×43 cm (14×17 in) lengthwise', sid: '100 cm (40 in)', kv: '65–75 kVp', resp: 'Suspend respiration' } },
      { name: 'Rotational Lateral – Lateromedial Erect (Back to IR)', type: 'routine', imgKey: 'Humerus_Rotational_Lateral_Lateromedial_Erect_Back_to_IR',
        info: { desc: 'True lateral of the humerus erect with the back of the arm against the IR. Elbow flexed 90°.', cr: 'Perpendicular to mid-humerus', ir: '35×43 cm (14×17 in) lengthwise', sid: '100 cm (40 in)', kv: '65–75 kVp', resp: 'Suspend respiration' } },
      { name: 'Rotational Lateral – Mediolateral Erect (Facing IR)', type: 'routine', imgKey: 'Humerus_Rotational_Lateral_Mediolateral_Erect_Facing_IR',
        info: { desc: 'Mediolateral lateral humerus, erect, facing the IR. Used when back-to-IR position is not possible.', cr: 'Perpendicular to mid-humerus', ir: '35×43 cm (14×17 in) lengthwise', sid: '100 cm (40 in)', kv: '65–75 kVp', resp: 'Suspend respiration' } },
      { name: 'Rotational Lateral (Supine)', type: 'routine', imgKey: 'Humerus_Rotational_Lateral_Supine',
        info: { desc: 'Lateral humerus with patient supine. Arm abducted slightly; IR placed vertically beside the arm.', cr: 'Horizontal, perpendicular to mid-humerus', ir: '35×43 cm (14×17 in) lengthwise', sid: '100 cm (40 in)', kv: '65–75 kVp', resp: 'Suspend respiration' } },
      { name: 'Transthoracic Lateral – Trauma', type: 'special', imgKey: 'Humerus_Transthoracic_Lateral_Projection_Trauma',
        info: { desc: 'Lateral humerus through the thorax for trauma patients. Used when the arm cannot be moved.', cr: 'Horizontal through thorax, perpendicular to IR', ir: '30×35 cm (11×14 in)', sid: '100 cm (40 in)', kv: '80–90 kVp', resp: 'Full inspiration, suspend' } },
      { name: 'Trauma Horizontal Beam Lateral – Mid to Distal', type: 'special', imgKey: 'Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal',
        info: { desc: 'Horizontal beam lateral of the mid-to-distal humerus for trauma. IR placed vertically.', cr: 'Horizontal, perpendicular to mid-to-distal humerus', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '65–75 kVp', resp: 'Suspend respiration' } }
    ]
  },
  elbow: {
    name: 'Elbow',
    icon: '🦾',
    positions: [
      { name: 'AP Projection (Fully Extended)', type: 'routine', imgKey: 'Elbow_AP_Projection_Fully_Extended',
        info: { desc: 'True AP of the elbow with the arm fully extended and supinated. Demonstrates the elbow joint space.', cr: 'Perpendicular to elbow joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Oblique – Lateral (External Rotation)', type: 'routine', imgKey: 'Elbow_AP_Oblique_Lateral_External_Rotation',
        info: { desc: 'Elbow AP oblique with external (lateral) rotation to profile the radial head and neck free of superimposition.', cr: 'Perpendicular to elbow joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Oblique – Medial (Internal Rotation)', type: 'routine', imgKey: 'Elbow_AP_Oblique_Medial_Internal_Rotation',
        info: { desc: 'AP oblique with medial (internal) rotation to profile the coronoid process and olecranon fossa.', cr: 'Perpendicular to elbow joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateromedial Projection (Flexed 90°)', type: 'routine', imgKey: 'Elbow_Lateromedial_Projection_Flexed_90deg',
        info: { desc: 'True lateral of the elbow with the elbow flexed 90° and the forearm in the lateral (thumb-up) position.', cr: 'Perpendicular to elbow joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Alternate – Partial Flexion (Forearm Parallel)', type: 'special', imgKey: 'Elbow_AP_Alternate_Partial_Flexion_Forearm_Parallel',
        info: { desc: 'Partial flexion elbow AP with the forearm parallel to the IR when full extension is not possible.', cr: 'Perpendicular to the elbow joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Alternate – Partial Flexion (Humerus Parallel)', type: 'special', imgKey: 'Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel',
        info: { desc: 'Partial flexion AP with the humerus parallel to the IR. Demonstrates the distal humerus free of distortion.', cr: 'Perpendicular to the distal humerus', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Radial Head – Lateromedial (External Rotation)', type: 'special', imgKey: 'Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation',
        info: { desc: 'Four lateromedial projections with sequential rotation of the hand to show all aspects of the radial head.', cr: 'Perpendicular to radial head', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Acute Flexion – Distal Humerus', type: 'special', imgKey: 'Elbow_Acute_Flexion_Distal_Humerus_CR_Perpendicular_to_Humerus',
        info: { desc: 'Acute flexion elbow with CR perpendicular to the humerus. Demonstrates the distal humerus when full extension is not possible.', cr: 'Perpendicular to long axis of humerus', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Acute Flexion – Proximal Forearm', type: 'special', imgKey: 'Elbow_Acute_Flexion_Proximal_Forearm_CR_Perpendicular_to_Forearm',
        info: { desc: 'Acute flexion with CR perpendicular to the forearm. Demonstrates the proximal forearm bones.', cr: 'Perpendicular to long axis of forearm', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Trauma Axial Lateral – Coyle Method (Radial Head)', type: 'special', imgKey: 'Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Erect',
        info: { desc: 'Trauma axial lateromedial with 45° cephalad angulation for the radial head. Elbow flexed 90°.', cr: '45° toward the shoulder (cephalad)', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Trauma Axial Mediolateral – Coyle Method (Coronoid)', type: 'special', imgKey: 'Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Erect',
        info: { desc: 'Trauma axial mediolateral with 45° caudad angulation for the coronoid process. Elbow flexed 80°.', cr: '45° toward the elbow (caudad)', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } }
    ]
  },
  forearm: {
    name: 'Forearm',
    icon: '🦴',
    positions: [
      { name: 'AP Projection', type: 'routine', imgKey: 'Forearm_AP_Projection',
        info: { desc: 'AP projection of the entire forearm in full supination. Both wrist and elbow joints included.', cr: 'Perpendicular to mid-forearm', ir: '35×43 cm (14×17 in) or 30×35 cm lengthwise', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateromedial Projection', type: 'routine', imgKey: 'Forearm_Lateromedial_Projection',
        info: { desc: 'Lateral projection of the forearm. Elbow flexed 90° with the thumb up. Includes both joints.', cr: 'Perpendicular to mid-forearm', ir: '35×43 cm (14×17 in) or 30×35 cm lengthwise', sid: '100 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } }
    ]
  },
  wrist: {
    name: 'Wrist',
    icon: '✋',
    positions: [
      { name: 'PA Projection', type: 'routine', imgKey: 'Wrist_PA_Projection',
        info: { desc: 'Standard PA wrist with the hand flat on the IR. Demonstrates the carpal bones, distal radius and ulna.', cr: 'Perpendicular to the midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateromedial Projection', type: 'routine', imgKey: 'Wrist_Lateromedial_Projection',
        info: { desc: 'Lateral wrist with the ulnar surface down. Demonstrates the wrist in profile.', cr: 'Perpendicular to the wrist joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateromedial with Support', type: 'routine', imgKey: 'Wrist_Lateromedial_Projection_with_Support',
        info: { desc: 'Lateral wrist using a support under the hand to achieve a true lateral position.', cr: 'Perpendicular to the wrist joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique – Lateral Rotation (with Support)', type: 'routine', imgKey: 'Wrist_PA_Oblique_Lateral_Rotation_with_Support',
        info: { desc: 'PA oblique with 45° lateral rotation and support. Profiles the trapezium and scaphoid.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique – Lateral Rotation (without Support)', type: 'routine', imgKey: 'Wrist_PA_Oblique_Lateral_Rotation_without_Support',
        info: { desc: 'PA oblique 45° lateral rotation without support. Commonly used routine oblique.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Alternative AP Projection', type: 'special', imgKey: 'Wrist_Alternative_AP_Projection',
        info: { desc: 'AP projection of the wrist (dorsal surface on IR). Used when PA is contraindicated.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Axial Scaphoid – Ulnar Deviation (15° CR)', type: 'special', imgKey: 'Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR',
        info: { desc: 'Scaphoid projection with 15° CR angulation and ulnar deviation. Opens the scaphoid and reduces foreshortening.', cr: '15° proximally (toward elbow)', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Radial Deviation', type: 'special', imgKey: 'Wrist_PA_Radial_Deviation',
        info: { desc: 'PA wrist in radial deviation to demonstrate the ulnar side of the carpals.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Scaphoid – Stecher Method (Hand Elevated)', type: 'special', imgKey: 'Wrist_PA_Scaphoid_Modified_Stecher_Method_Hand_Elevated_Ulnar_Deviation',
        info: { desc: 'Modified Stecher method with the hand elevated on a 20° angle sponge and in ulnar deviation for scaphoid fractures.', cr: 'Perpendicular to scaphoid', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Scaphoid – Stecher Method (Severe Pain)', type: 'special', imgKey: 'Wrist_PA_Scaphoid_Modified_Stecher_Method_Severe_Pain_No_Ulnar_Deviation',
        info: { desc: 'Modified Stecher for patients with severe pain; no ulnar deviation, wrist flat on a 20° angle support.', cr: 'Perpendicular to scaphoid', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Carpal Bridge Tangential Projection', type: 'special', imgKey: 'Wrist_Carpal_Bridge_Tangential_Projection',
        info: { desc: 'Tangential projection of the posterior wrist with the hand dorsiflexed 90°. Demonstrates the dorsal aspect of the carpals.', cr: '45° toward elbow, to the dorsal surface of the wrist', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Carpal Canal – Gaynor-Hart Method', type: 'special', imgKey: 'Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method',
        info: { desc: 'Tangential superoinferior projection of the carpal tunnel. Wrist in extreme dorsiflexion.', cr: '25–30° toward the fingers, along the long axis of the palm', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } }
    ]
  },
  hand: {
    name: 'Hand',
    icon: '🤚',
    positions: [
      { name: 'PA Projection', type: 'routine', imgKey: 'Hand_PA_Projection',
        info: { desc: 'Standard PA hand with the palm flat on the IR. Demonstrates all phalanges, metacarpals and carpals.', cr: 'Perpendicular to third MCP joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique – Digits Parallel', type: 'routine', imgKey: 'Hand_PA_Oblique_Projection_Digits_Parallel',
        info: { desc: 'PA oblique hand at 45° with the fingers extended and parallel to the IR using a support.', cr: 'Perpendicular to third MCP joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique – Digits Not Parallel', type: 'routine', imgKey: 'Hand_PA_Oblique_Projection_Digits_Not_Parallel',
        info: { desc: 'PA oblique hand at 45° without support; fingers arch naturally.', cr: 'Perpendicular to third MCP joint', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Fan Lateral – Lateromedial Projection', type: 'routine', imgKey: 'Hand_Fan_Lateral_Lateromedial_Projection',
        info: { desc: 'True lateral of the hand with the fingers fanned out in a fan pattern to separate them. Thumb is superimposed on the second digit.', cr: 'Perpendicular to MCP joints', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral in Extension', type: 'special', imgKey: 'Hand_Lateral_in_Extension',
        info: { desc: 'Lateral hand with the fingers fully extended, stacked. Used to detect foreign bodies or fractures.', cr: 'Perpendicular to MCP joints', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral in Flexion', type: 'special', imgKey: 'Hand_Lateral_in_Flexion',
        info: { desc: 'Lateral hand with fingers in flexion. Used to evaluate flexor tendons and detect Boxer\'s fractures.', cr: 'Perpendicular to MCP joints', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Axial – Brewerton Method', type: 'special', imgKey: 'Hand_AP_Axial_Brewerton_Method',
        info: { desc: 'AP axial projection with the MCP joints flexed 65° and CR 15° toward the ulna. Demonstrates the heads of the metacarpals.', cr: '15° toward ulna (ulnally), to MCP joints', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } }
    ]
  },
  fingers: {
    name: 'Fingers',
    icon: '👆',
    positions: [
      { name: 'PA Projection', type: 'routine', imgKey: 'Fingers_PA_Projection',
        info: { desc: 'PA projection of the finger(s) of interest with the digit flat on the IR. Demonstrates phalanges and IP joints.', cr: 'Perpendicular to PIP joint of the digit', ir: '18×24 cm (8×10 in) or smaller', sid: '100 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique Projection', type: 'routine', imgKey: 'Fingers_PA_Oblique_Projection',
        info: { desc: 'PA oblique of the finger at 45°. Profiles the phalanges and IP joints obliquely.', cr: 'Perpendicular to PIP joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateromedial Projection', type: 'routine', imgKey: 'Fingers_Lateromedial_Projection',
        info: { desc: 'True lateral of the finger. Demonstrates the phalanges and IP joints in lateral profile.', cr: 'Perpendicular to PIP joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } }
    ]
  },
  thumb: {
    name: 'Thumb',
    icon: '👍',
    positions: [
      { name: 'AP Projection', type: 'routine', imgKey: 'Thumb_AP_Projection',
        info: { desc: 'AP projection of the thumb (PA for the thumb is actually an AP). Hand rotated so the dorsal surface of the thumb rests on the IR.', cr: 'Perpendicular to first MCP joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique – Medial Rotation', type: 'routine', imgKey: 'Thumb_PA_Oblique_Projection_Medial_Rotation',
        info: { desc: 'Oblique of the thumb with medial rotation at 45°. Profiles the first metacarpal and phalanges obliquely.', cr: 'Perpendicular to first MCP joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral Position', type: 'routine', imgKey: 'Thumb_Lateral_Position',
        info: { desc: 'True lateral of the thumb. Demonstrates the first metacarpal and phalanges in lateral profile.', cr: 'Perpendicular to first MCP joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Axial – Modified Robert Method', type: 'special', imgKey: 'Thumb_AP_Axial_Modified_Robert_Method',
        info: { desc: 'Hyperpronation AP to project the first carpometacarpal joint in true AP to evaluate Bennett\'s fracture.', cr: 'Perpendicular to first CMC joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Stress – Folio Method', type: 'special', imgKey: 'Thumb_PA_Stress_Folio_Method',
        info: { desc: 'Stress PA projection of the first MCP joint with tension applied (valgus stress) to evaluate ulnar collateral ligament (skier\'s thumb).', cr: 'Perpendicular to first MCP joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } }
    ]
  },
  scapula: {
    name: 'Scapula',
    icon: '🦴',
    positions: [
      { name: 'AP Projection (Erect)', type: 'routine', imgKey: 'Scapula_AP_Projection_Erect',
        info: { desc: 'AP projection of the scapula, erect. Patient abducts the arm to move the scapula away from the ribs.', cr: 'Perpendicular to mid-scapula (2 in below coracoid process)', ir: '24×30 cm (10×12 in) lengthwise', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral – Erect (Acromion/Coracoid, 60° LAO)', type: 'routine', imgKey: 'Scapula_Lateral_Position_Erect_Acromion_Coracoid_Process_60deg_LAO',
        info: { desc: 'Lateral scapula, erect, in 60° LAO/RAO. Best demonstrates the acromion and coracoid process.', cr: 'Perpendicular to medial border of scapula', ir: '24×30 cm (10×12 in) lengthwise', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral – Erect (Body of Scapula, 45° LAO)', type: 'routine', imgKey: 'Scapula_Lateral_Position_Erect_Body_of_Scapula_45deg_LAO',
        info: { desc: 'Lateral scapula in 45° LAO/RAO. Best demonstrates the body of the scapula in profile.', cr: 'Perpendicular to medial border of scapula', ir: '24×30 cm (10×12 in) lengthwise', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral – Recumbent', type: 'special', imgKey: 'Scapula_Lateral_Position_Recumbent',
        info: { desc: 'Lateral scapula with patient recumbent (lying down) in an oblique position. Used for trauma patients.', cr: 'Perpendicular to medial border of scapula', ir: '24×30 cm (10×12 in) lengthwise', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral – Recumbent (Alternative Supine)', type: 'special', imgKey: 'Scapula_Lateral_Position_Recumbent_Alternative_Supine',
        info: { desc: 'Supine alternative for the recumbent lateral scapula.', cr: 'Perpendicular to scapular body', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral – Recumbent (Palpating Borders)', type: 'special', imgKey: 'Scapula_Lateral_Position_Recumbent_Palpating_Borders',
        info: { desc: 'Recumbent lateral scapula with the technologist palpating the borders to ensure true lateral position.', cr: 'Perpendicular to scapular body', ir: '24×30 cm (10×12 in)', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } }
    ]
  },
  clavicle: {
    name: 'Clavicle',
    icon: '🦴',
    positions: [
      { name: 'AP Projection (CR 0°)', type: 'routine', imgKey: 'Clavicle_AP_Projection_CR_0deg',
        info: { desc: 'AP projection of the clavicle with CR perpendicular to IR. The clavicle projects over the upper thorax.', cr: 'Perpendicular to mid-clavicle', ir: '30×35 cm (11×14 in) crosswise', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend on full inspiration' } },
      { name: 'AP Axial Projection (CR 15–30° Cephalad)', type: 'routine', imgKey: 'Clavicle_AP_Axial_Projection_CR_15_to_30deg_Cephalad',
        info: { desc: 'AP axial clavicle with 15–30° cephalad CR to project the clavicle above the thoracic cage.', cr: '15–30° cephalad to mid-clavicle', ir: '30×35 cm (11×14 in) crosswise', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend on full inspiration' } }
    ]
  },
  ac_joints: {
    name: 'AC Joints',
    icon: '🦴',
    positions: [
      { name: 'AP Axial – Zanca Method', type: 'routine', imgKey: 'AC_Joints_AP_Axial_Zanca_Method',
        info: { desc: 'AP axial projection of a single AC joint with 10–15° cephalad CR to project the joint free of the acromion.', cr: '10–15° cephalad to AC joint', ir: '18×24 cm (8×10 in)', sid: '100 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Bilateral – Pearson Method (Stress View)', type: 'routine', imgKey: 'AC_Joints_AP_Bilateral_Pearson_Method_Stress_View_with_Weights',
        info: { desc: 'Bilateral AP AC joint projection with and without weights (5–10 lb) to stress the AC ligaments and detect separation.', cr: 'Perpendicular to mid-AC joints', ir: '35×43 cm (14×17 in) crosswise', sid: '180 cm (72 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } }
    ]
  }
};

// ═══ IMAGE MAPPING HELPER ═══
function getPositionImages(position) {
  if (!position || !position.imgKey) return { posImg: null, xrayImg: null };
  const base = IMAGES_PATH + position.imgKey;
  return {
    posImg: base + '_Position.jpeg',
    xrayImg: base + '_Xray.jpeg'
  };
}

// ═══ STATISTICS ═══
function getStatistics() {
  let totalChapters = 0;
  let totalPositions = 0;

  for (let chKey in BOOK) {
    totalChapters++;
    const ch = BOOK[chKey];
    if (ch.subchapters) {
      for (let schKey in ch.subchapters) {
        totalPositions += (ch.subchapters[schKey].positions || []).length;
      }
    } else {
      totalPositions += (ch.positions || []).length;
    }
  }

  return { chapters: totalChapters, positions: totalPositions };
}

// ═══ QUIZ DATA ═══
const QUIZ = {};