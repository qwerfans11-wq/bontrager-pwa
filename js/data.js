// ══════════════════════════════════════════════
// DATA MODULE — Book, Quiz, and Image Data
// ══════════════════════════════════════════════

const IMAGES_PATH = 'renamed_images/';

// IMAGE_DATA: maps position name → { position: filename, xray: filename }
// Filenames are relative to IMAGES_PATH
const IMAGE_DATA = {
  // Shoulder
  'AP External Rotation':               { position: 'Shoulder_AP_External_Rotation_Position.jpeg',                                       xray: 'Shoulder_AP_External_Rotation_Xray.jpeg' },
  'AP Internal Rotation':               { position: 'Shoulder_AP_Internal_Rotation_Position.jpeg',                                       xray: 'Shoulder_AP_Internal_Rotation_Xray.jpeg' },
  'AP Neutral Rotation (Trauma)':       { position: 'Shoulder_AP_Neutral_Rotation_Trauma_Erect_Position.jpeg',                           xray: 'Shoulder_AP_Neutral_Rotation_Trauma_Xray.jpeg' },
  'AP Oblique - Glenoid Cavity (Grashey Method)': { position: 'Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_RPO_Position.jpeg',    xray: 'Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_Xray.jpeg' },
  'Apical AP Axial Projection':         { position: 'Shoulder_Apical_AP_Axial_Projection_CR_30deg_Caudad_Position.jpeg',                 xray: 'Shoulder_Apical_AP_Axial_Projection_Xray.jpeg' },
  'AP Apical Oblique Axial (Garth Method)': { position: 'Shoulder_AP_Apical_Oblique_Axial_Garth_Method_45deg_Posterior_Oblique_CR_45deg_Caudad_Position.jpeg', xray: 'Shoulder_AP_Apical_Oblique_Axial_Garth_Method_Xray.jpeg' },
  'Inferosuperior Axial (Clements Modification)': { position: 'Shoulder_Inferosuperior_Axial_Clements_Modification_Position.jpeg',     xray: 'Shoulder_Inferosuperior_Axial_Clements_Modification_Xray.jpeg' },
  'Inferosuperior Axial (Lawrence Method)': { position: 'Shoulder_Inferosuperior_Axial_Lawrence_Method_Position.jpeg',                  xray: 'Shoulder_Inferosuperior_Axial_Lawrence_Method_Xray.jpeg' },
  'PA Axial Transaxillary (Bernageau Method)': { position: 'Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method_Position.jpeg',   xray: 'Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method_Xray.jpeg' },
  'PA Oblique Scapular Y Lateral (Trauma)': { position: 'Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma_Position.jpeg',                 xray: 'Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma_No_Dislocation_Xray.jpeg' },
  'Tangential Intertubercular Sulcus (Fisk Modification)': { position: 'Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Erect_Position.jpeg', xray: 'Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Xray.jpeg' },
  'Tangential Supraspinatus Outlet (Neer Method)': { position: 'Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method_CR_10_to_15deg_Caudal_Position.jpeg', xray: 'Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method_Xray.jpeg' },
  'Transthoracic Lateral (Trauma)':     { position: 'Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect_Position.jpeg',        xray: 'Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect_Xray.jpeg' },
  // Clavicle
  'Clavicle AP Projection':             { position: 'Clavicle_AP_Projection_CR_0deg_Position.jpeg',                                      xray: 'Clavicle_AP_Projection_CR_0deg_Xray.jpeg' },
  'Clavicle AP Axial Projection':       { position: 'Clavicle_AP_Axial_Projection_CR_15_to_30deg_Cephalad_Position.jpeg',                xray: 'Clavicle_AP_Axial_Projection_Xray.jpeg' },
  // Scapula
  'Scapula AP Projection':              { position: 'Scapula_AP_Projection_Erect_Position.jpeg',                                         xray: 'Scapula_AP_Projection_Xray.jpeg' },
  'Scapula Lateral Position - Erect':   { position: 'Scapula_Lateral_Position_Erect_Acromion_Coracoid_Process_60deg_LAO_Position.jpeg',   xray: 'Scapula_Lateral_Position_Erect_Xray_Final.jpeg' },
  'Scapula Lateral Position - Recumbent': { position: 'Scapula_Lateral_Position_Recumbent_Position.jpeg',                                xray: 'Scapula_Lateral_Position_Recumbent_Xray.jpeg' },
  // AC Joints
  'AP Axial (Zanca Method)':            { position: 'AC_Joints_AP_Axial_Zanca_Method_Position.jpeg',                                     xray: 'AC_Joints_AP_Axial_Zanca_Method_Xray_Labeled.jpeg' },
  'AP Bilateral (Pearson Method)':      { position: 'AC_Joints_AP_Bilateral_Pearson_Method_Stress_View_with_Weights_Position.jpeg',       xray: 'AC_Joints_AP_Bilateral_Pearson_Method_Xray_Labeled.jpeg' },
  // Humerus
  'Humerus AP Projection':              { position: 'Humerus_AP_Projection_Erect_Position.jpeg',                                         xray: 'Humerus_AP_Projection_Xray.jpeg' },
  'Rotational Lateral':                 { position: 'Humerus_Rotational_Lateral_Mediolateral_Erect_Facing_IR_Position.jpeg',              xray: 'Humerus_Rotational_Lateral_Mediolateral_Erect_Xray.jpeg' },
  'Humerus Transthoracic Lateral (Trauma)': { position: 'Humerus_Transthoracic_Lateral_Projection_Trauma_Erect_and_Recumbent_Position.jpeg', xray: 'Humerus_Transthoracic_Lateral_Projection_Trauma_Xray.jpeg' },
  'Trauma Horizontal Beam Lateral':     { position: 'Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal_Position.jpeg',                xray: 'Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal_Xray.jpeg' },
  // Elbow
  'Elbow AP Projection':                { position: 'Elbow_AP_Projection_Fully_Extended_Position.jpeg',                                  xray: 'Elbow_AP_Projection_Fully_Extended_Xray.jpeg' },
  'AP Oblique - Lateral Rotation':      { position: 'Elbow_AP_Oblique_Lateral_External_Rotation_Position.jpeg',                          xray: 'Elbow_AP_Oblique_Lateral_External_Rotation_Xray.jpeg' },
  'AP Oblique - Medial Rotation':       { position: 'Elbow_AP_Oblique_Medial_Internal_Rotation_Position.jpeg',                           xray: 'Elbow_AP_Oblique_Medial_Internal_Rotation_Xray.jpeg' },
  'Elbow Lateromedial Projection':      { position: 'Elbow_Lateromedial_Projection_Flexed_90deg_Position.jpeg',                          xray: 'Elbow_Lateromedial_Projection_Flexed_90deg_Xray.jpeg' },
  'Partial Flexion - Humerus Parallel': { position: 'Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel_Position.jpeg',                 xray: 'Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel_Xray.jpeg' },
  'Partial Flexion - Forearm Parallel': { position: 'Elbow_AP_Alternate_Partial_Flexion_Forearm_Parallel_Position.jpeg',                 xray: null },
  'Acute Flexion - Distal Humerus':     { position: 'Elbow_Acute_Flexion_Distal_Humerus_CR_Perpendicular_to_Humerus_Position.jpeg',      xray: 'Elbow_Acute_Flexion_Distal_Humerus_Xray.jpeg' },
  'Acute Flexion - Proximal Forearm':   { position: 'Elbow_Acute_Flexion_Proximal_Forearm_CR_Perpendicular_to_Forearm_Position.jpeg',    xray: 'Elbow_Acute_Flexion_Proximal_Forearm_Xray.jpeg' },
  'Radial Head Lateromedial':           { position: 'Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation_Position.jpeg', xray: 'Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation_Xray.jpeg' },
  'Coyle Method - Radial Head':         { position: 'Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Erect_Position.jpeg',      xray: 'Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Xray.jpeg' },
  'Coyle Method - Coronoid Process':    { position: 'Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Erect_Position.jpeg', xray: 'Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Xray.jpeg' },
  // Forearm
  'Forearm AP Projection':              { position: 'Forearm_AP_Projection_Position.jpeg',                                               xray: 'Forearm_AP_Projection_Xray.jpeg' },
  'Forearm Lateromedial Projection':    { position: 'Forearm_Lateromedial_Projection_Position.jpeg',                                     xray: 'Forearm_Lateromedial_Projection_Xray.jpeg' },
  // Wrist
  'Wrist PA Projection':                { position: 'Wrist_PA_Projection_Position.jpeg',                                                 xray: 'Wrist_PA_Projection_Xray.jpeg' },
  'Wrist Lateromedial Projection':      { position: 'Wrist_Lateromedial_Projection_Position.jpeg',                                       xray: 'Wrist_Lateromedial_Projection_Xray.jpeg' },
  'PA Oblique - Lateral Rotation':      { position: 'Wrist_PA_Oblique_Lateral_Rotation_with_Support_Position.jpeg',                     xray: 'Wrist_PA_Oblique_Lateral_Rotation_Xray.jpeg' },
  'PA Radial Deviation':                { position: 'Wrist_PA_Radial_Deviation_Position.jpeg',                                           xray: 'Wrist_PA_Radial_Deviation_Xray.jpeg' },
  'PA Axial - Scaphoid':                { position: 'Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR_Position.jpeg',                   xray: 'Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR_Xray.jpeg' },
  'PA Scaphoid (Stecher Method)':       { position: 'Wrist_PA_Scaphoid_Modified_Stecher_Method_Hand_Elevated_Ulnar_Deviation_Position.jpeg', xray: 'Wrist_PA_Scaphoid_Modified_Stecher_Method_Xray.jpeg' },
  'Alternative AP Projection':          { position: 'Wrist_Alternative_AP_Projection_Position.jpeg',                                    xray: null },
  'Wrist Lateromedial with Support':    { position: 'Wrist_Lateromedial_Projection_with_Support_Position.jpeg',                          xray: 'Wrist_Lateromedial_Projection_Xray.jpeg' },
  'Carpal Bridge Tangential':           { position: 'Wrist_Carpal_Bridge_Tangential_Projection_Position.jpeg',                          xray: 'Wrist_Carpal_Bridge_Tangential_Projection_Xray.jpeg' },
  'Carpal Canal Tangential (Gaynor-Hart Method)': { position: 'Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method_Position.jpeg',         xray: 'Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method_Xray.jpeg' },
  // Hand
  'Hand PA Projection':                 { position: 'Hand_PA_Projection_Position.jpeg',                                                  xray: 'Hand_PA_Projection_Xray.jpeg' },
  'Hand PA Oblique Projection':         { position: 'Hand_PA_Oblique_Projection_Digits_Parallel_Position.jpeg',                          xray: 'Hand_PA_Oblique_Projection_Digits_Parallel_Xray.jpeg' },
  'Fan Lateral - Lateromedial Projection': { position: 'Hand_Fan_Lateral_Lateromedial_Projection_Position.jpeg',                        xray: 'Hand_Fan_Lateral_Lateromedial_Projection_Xray.jpeg' },
  'Lateral in Extension':               { position: 'Hand_Lateral_in_Extension_Position.jpeg',                                           xray: 'Hand_Lateral_in_Extension_Xray.jpeg' },
  'Lateral in Flexion':                 { position: 'Hand_Lateral_in_Flexion_Position.jpeg',                                             xray: 'Hand_Lateral_in_Flexion_Xray.jpeg' },
  'AP Axial (Brewerton Method)':        { position: 'Hand_AP_Axial_Brewerton_Method_Position.jpeg',                                      xray: 'Hand_AP_Axial_Brewerton_Method_Xray.jpeg' },
  // Fingers
  'Fingers PA Projection':              { position: 'Fingers_PA_Projection_Position.jpeg',                                               xray: 'Fingers_PA_Projection_Xray.jpeg' },
  'Fingers PA Oblique Projection':      { position: 'Fingers_PA_Oblique_Projection_Position.jpeg',                                       xray: 'Fingers_PA_Oblique_Projection_Xray.jpeg' },
  'Fingers Lateromedial Projection':    { position: 'Fingers_Lateromedial_Projection_Position.jpeg',                                     xray: 'Fingers_Lateromedial_Projection_Xray.jpeg' },
  // Thumb
  'Thumb AP Projection':                { position: 'Thumb_AP_Projection_Position.jpeg',                                                 xray: 'Thumb_AP_Projection_Xray.jpeg' },
  'Thumb Lateral Position':             { position: 'Thumb_Lateral_Position_Position.jpeg',                                              xray: 'Thumb_Lateral_Position_Xray.jpeg' },
  'PA Oblique - Medial Rotation':       { position: 'Thumb_PA_Oblique_Projection_Medial_Rotation_Position.jpeg',                        xray: 'Thumb_PA_Oblique_Projection_Medial_Rotation_Xray.jpeg' },
  'AP Axial (Robert Method)':           { position: 'Thumb_AP_Axial_Modified_Robert_Method_Position.jpeg',                              xray: 'Thumb_AP_Axial_Modified_Robert_Method_Xray.jpeg' },
  'PA Stress (Folio Method)':           { position: 'Thumb_PA_Stress_Folio_Method_Position.jpeg',                                       xray: 'Thumb_PA_Stress_Folio_Method_Xray.jpeg' }
};

// Returns image paths for a position, or null if not found
function getPositionImages(positionName) {
  const entry = IMAGE_DATA[positionName];
  if (!entry) return null;
  return {
    position: entry.position ? IMAGES_PATH + entry.position : null,
    xray:     entry.xray     ? IMAGES_PATH + entry.xray     : null
  };
}

// ═══ BOOK DATA ═══
const BOOK = {
  shoulder: {
    name: 'Shoulder', icon: '💪',
    positions: [
      { name: 'AP External Rotation',                         type: 'routine', info: { desc: 'AP projection with humerus in external rotation to demonstrate the greater tubercle in profile.', cr: 'Perpendicular to IR, centered to coracoid process', ir: '24×30 cm (10×12 in) lengthwise', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Internal Rotation',                         type: 'routine', info: { desc: 'AP projection with humerus in internal rotation to demonstrate the lesser tubercle in profile.', cr: 'Perpendicular to IR, centered to coracoid process', ir: '24×30 cm (10×12 in) lengthwise', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Neutral Rotation (Trauma)',                 type: 'special', info: { desc: 'AP projection with arm in neutral rotation; used when patient cannot rotate the arm due to injury.', cr: 'Perpendicular to IR, centered to coracoid process', ir: '24×30 cm (10×12 in) lengthwise', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Oblique - Glenoid Cavity (Grashey Method)', type: 'special', info: { desc: 'AP oblique with 35–45° body rotation; demonstrates the glenohumeral joint space in true profile.', cr: 'Perpendicular, centered to glenoid cavity', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Apical AP Axial Projection',                   type: 'special', info: { desc: 'AP axial with 45° caudal angle; best shows the apical region and subcoracoid area.', cr: '45° caudal to IR, centered to coracoid process', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Apical Oblique Axial (Garth Method)',       type: 'special', info: { desc: '45° posterior oblique body rotation with 45° caudal CR angle; detects Hill-Sachs and Bankart lesions.', cr: '45° caudal, centered to glenohumeral joint', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Inferosuperior Axial (Lawrence Method)',       type: 'routine', info: { desc: 'Axial shoulder with arm abducted 90°; demonstrates the glenohumeral joint, coracoid, and acromion.', cr: 'Horizontal, medially through axilla', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Inferosuperior Axial (Clements Modification)', type: 'special', info: { desc: 'Modified axial for limited abduction; CR angled medially 5–15° from horizontal.', cr: '5–15° medially, horizontal through axilla', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Axial Transaxillary (Bernageau Method)',    type: 'special', info: { desc: 'PA axial with patient leaning forward; evaluates the inferior glenoid rim for Bankart lesions.', cr: 'Angled 5° caudal into axilla', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique Scapular Y Lateral (Trauma)',       type: 'special', info: { desc: 'PA oblique 45–60° rotation; the Y-shape formed by scapula shows dislocation direction.', cr: 'Perpendicular to IR, centered to glenohumeral joint', ir: '24×30 cm (10×12 in) lengthwise', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Tangential Intertubercular Sulcus (Fisk Modification)', type: 'special', info: { desc: 'Tangential view of the bicipital groove; shows the intertubercular sulcus in profile.', cr: '10–15° toward elbow along long axis of humerus', ir: '8×10 cm (3×4 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Tangential Supraspinatus Outlet (Neer Method)', type: 'special', info: { desc: 'Tangential Y-lateral with 10–15° caudal angle; shows supraspinatus outlet and impingement.', cr: '10–15° caudal, along long axis of scapula', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Transthoracic Lateral (Trauma)',               type: 'special', info: { desc: 'Lateral shoulder projected through the thorax; used when patient cannot raise the arm.', cr: 'Perpendicular to IR, centered to surgical neck', ir: '24×30 cm (10×12 in) lengthwise', sid: '100–102 cm (40 in)', kv: '80–90 kVp', resp: 'Full inspiration' } }
    ]
  },
  clavicle: {
    name: 'Clavicle', icon: '🦴',
    positions: [
      { name: 'Clavicle AP Projection',       type: 'routine', info: { desc: 'AP projection of the entire clavicle from SC joint to AC joint.', cr: 'Perpendicular to IR, centered to midshaft of clavicle', ir: '30×35 cm (11×14 in) crosswise', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend on expiration' } },
      { name: 'Clavicle AP Axial Projection', type: 'routine', info: { desc: 'AP axial with 15–30° cephalad angle to project the clavicle above the ribs.', cr: '15–30° cephalad, centered to midshaft of clavicle', ir: '30×35 cm (11×14 in) crosswise', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend on expiration' } }
    ]
  },
  scapula: {
    name: 'Scapula', icon: '🦴',
    positions: [
      { name: 'Scapula AP Projection',            type: 'routine', info: { desc: 'AP projection of the scapula with arm abducted; demonstrates body, spine, acromion, and coracoid.', cr: 'Perpendicular to IR, centered to midscapula', ir: '24×30 cm (10×12 in) lengthwise', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Scapula Lateral Position - Erect', type: 'routine', info: { desc: 'PA oblique (45–60°) lateral scapula; demonstrates body and spine of scapula in lateral profile.', cr: 'Perpendicular to IR, centered to medial border of scapula', ir: '24×30 cm (10×12 in) lengthwise', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } },
      { name: 'Scapula Lateral Position - Recumbent', type: 'special', info: { desc: 'Lateral scapula with patient recumbent; used post-trauma when erect positioning is not possible.', cr: 'Perpendicular to IR, centered to medial border', ir: '24×30 cm (10×12 in) lengthwise', sid: '100–102 cm (40 in)', kv: '70–80 kVp', resp: 'Suspend respiration' } }
    ]
  },
  ac_joints: {
    name: 'AC Joints', icon: '🔗',
    positions: [
      { name: 'AP Axial (Zanca Method)',       type: 'special', info: { desc: 'AP axial with 10–15° cephalad angle; removes clavicle superimposition and shows AC joint clearly.', cr: '10–15° cephalad, centered to AC joint', ir: '18×24 cm (8×10 in) crosswise', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Bilateral (Pearson Method)', type: 'special', info: { desc: 'Bilateral AP of both AC joints with and without weights to detect joint separation.', cr: 'Perpendicular, centered to both AC joints', ir: '35×43 cm (14×17 in) crosswise', sid: '183 cm (72 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } }
    ]
  },
  humerus: {
    name: 'Humerus', icon: '💪',
    positions: [
      { name: 'Humerus AP Projection',             type: 'routine', info: { desc: 'AP projection of the entire humerus from shoulder to elbow including both joints.', cr: 'Perpendicular to IR, centered to mid-humerus', ir: '35×43 cm (14×17 in) lengthwise', sid: '100–102 cm (40 in)', kv: '65–75 kVp', resp: 'Suspend respiration' } },
      { name: 'Rotational Lateral',                type: 'routine', info: { desc: 'Lateral humerus (mediolateral or lateromedial); patient rotates humerus 90° from AP.', cr: 'Perpendicular to IR, centered to mid-humerus', ir: '35×43 cm (14×17 in) lengthwise', sid: '100–102 cm (40 in)', kv: '65–75 kVp', resp: 'Suspend respiration' } },
      { name: 'Humerus Transthoracic Lateral (Trauma)', type: 'special', info: { desc: 'Lateral humerus through thorax; used when patient cannot move the injured arm.', cr: 'Perpendicular to IR, centered to surgical neck', ir: '35×43 cm (14×17 in) lengthwise', sid: '100–102 cm (40 in)', kv: '80–90 kVp', resp: 'Full inspiration' } },
      { name: 'Trauma Horizontal Beam Lateral',    type: 'special', info: { desc: 'Horizontal beam lateral of mid-distal humerus; used for trauma when arm cannot be moved.', cr: 'Horizontal, centered to affected area', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '65–75 kVp', resp: 'Suspend respiration' } }
    ]
  },
  elbow: {
    name: 'Elbow', icon: '🦾',
    positions: [
      { name: 'Elbow AP Projection',            type: 'routine', info: { desc: 'AP projection with elbow fully extended; demonstrates distal humerus, proximal radius and ulna.', cr: 'Perpendicular to elbow joint', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Oblique - Lateral Rotation',  type: 'routine', info: { desc: 'AP oblique with external (lateral) rotation of 45°; demonstrates the radial head and capitulum.', cr: 'Perpendicular, centered to elbow joint', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Oblique - Medial Rotation',   type: 'routine', info: { desc: 'AP oblique with internal (medial) rotation of 45°; demonstrates the coronoid process and trochlea.', cr: 'Perpendicular, centered to elbow joint', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Elbow Lateromedial Projection',  type: 'routine', info: { desc: 'Lateral elbow at 90° flexion; demonstrates distal humerus, olecranon, and radial head in profile.', cr: 'Perpendicular, centered to elbow joint', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Partial Flexion - Humerus Parallel', type: 'special', info: { desc: 'Alternate AP for partial flexion injury; humerus parallel to IR with forearm elevated.', cr: 'Perpendicular to humerus, centered to elbow', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Partial Flexion - Forearm Parallel', type: 'special', info: { desc: 'Alternate AP for partial flexion injury; forearm parallel to IR with humerus elevated.', cr: 'Perpendicular to forearm, centered to elbow', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Acute Flexion - Distal Humerus', type: 'special', info: { desc: 'Acute flexion with CR perpendicular to humerus; shows posterior distal humerus.', cr: 'Perpendicular to humerus through elbow joint', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Acute Flexion - Proximal Forearm', type: 'special', info: { desc: 'Acute flexion with CR perpendicular to forearm; shows anterior proximal forearm.', cr: 'Perpendicular to forearm through elbow joint', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Radial Head Lateromedial',        type: 'special', info: { desc: 'Four lateral projections with different forearm rotations to isolate each quadrant of radial head.', cr: 'Perpendicular, centered to radial head', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Coyle Method - Radial Head',      type: 'special', info: { desc: 'Axial lateromedial with 45° cephalad angle; best shows radial head and capitulum.', cr: '45° cephalad, centered to radial head', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Coyle Method - Coronoid Process', type: 'special', info: { desc: 'Axial mediolateral with 45° cephalad angle; best shows coronoid process.', cr: '45° cephalad, centered to coronoid process', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } }
    ]
  },
  forearm: {
    name: 'Forearm', icon: '🦾',
    positions: [
      { name: 'Forearm AP Projection',         type: 'routine', info: { desc: 'AP projection of the entire forearm including both joints; radius and ulna shown side by side.', cr: 'Perpendicular to midforearm', ir: '35×43 cm (14×17 in) lengthwise', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } },
      { name: 'Forearm Lateromedial Projection', type: 'routine', info: { desc: 'Lateral forearm with both joints included; radius and ulna superimposed at mid-shaft.', cr: 'Perpendicular to midforearm', ir: '35×43 cm (14×17 in) lengthwise', sid: '100–102 cm (40 in)', kv: '60–70 kVp', resp: 'Suspend respiration' } }
    ]
  },
  wrist: {
    name: 'Wrist', icon: '✋',
    positions: [
      { name: 'Wrist PA Projection',                   type: 'routine', info: { desc: 'PA projection of the wrist showing carpal bones, distal radius and ulna, and proximal metacarpals.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Wrist Lateromedial Projection',         type: 'routine', info: { desc: 'Lateral wrist in true lateral position showing carpal bones and distal forearm.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique - Lateral Rotation',         type: 'routine', info: { desc: 'PA oblique with 45° lateral rotation; demonstrates the medial carpals and intercarpal joints.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Radial Deviation',                   type: 'special', info: { desc: 'PA wrist in radial deviation; opens medial intercarpal joints for visualization.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Axial - Scaphoid',                   type: 'special', info: { desc: 'PA with ulnar deviation and 15° proximal CR angle; elongates the scaphoid.', cr: '15° proximally (toward elbow), ulnar deviation', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Scaphoid (Stecher Method)',           type: 'special', info: { desc: 'PA with ulnar deviation and elevated hand to elongate scaphoid without tube angulation.', cr: 'Perpendicular to scaphoid', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Alternative AP Projection',             type: 'special', info: { desc: 'AP wrist projection used when PA is difficult; shows similar anatomy to PA.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Wrist Lateromedial with Support',       type: 'special', info: { desc: 'Lateral wrist with support under hand for more comfortable positioning.', cr: 'Perpendicular to midcarpal area', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Carpal Bridge Tangential',              type: 'special', info: { desc: 'Tangential view of dorsal wrist; demonstrates foreign bodies on posterior wrist surface.', cr: '45° toward elbow, centered to posterior wrist', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Carpal Canal Tangential (Gaynor-Hart Method)', type: 'special', info: { desc: 'Tangential view of carpal tunnel; shows hook of hamate and carpal canal structures.', cr: '25–30° from long axis of hand toward forearm', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } }
    ]
  },
  hand: {
    name: 'Hand', icon: '🤚',
    positions: [
      { name: 'Hand PA Projection',                   type: 'routine', info: { desc: 'PA projection of the entire hand showing all phalanges, metacarpals, and carpals.', cr: 'Perpendicular to 3rd MCP joint', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Hand PA Oblique Projection',           type: 'routine', info: { desc: 'PA oblique at 45° showing interosseous spaces and individual digits.', cr: 'Perpendicular to 3rd MCP joint', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Fan Lateral - Lateromedial Projection', type: 'routine', info: { desc: 'Lateral hand with fingers fanned; demonstrates distal phalanges in individual lateral profiles.', cr: 'Perpendicular to 2nd MCP joint', ir: '24×30 cm (10×12 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral in Extension',                 type: 'special', info: { desc: 'Lateral hand with fingers extended; used to show foreign body or soft tissue.', cr: 'Perpendicular to MCP joints', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'Lateral in Flexion',                   type: 'special', info: { desc: 'Lateral hand with fingers in natural flexion; shows metacarpals and base of phalanges.', cr: 'Perpendicular to MCP joints', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Axial (Brewerton Method)',           type: 'special', info: { desc: 'AP axial with 65° angle; demonstrates MCP joint erosions (early rheumatoid arthritis).', cr: '65° toward elbow from vertical, centered to MCP joints', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '55–65 kVp', resp: 'Suspend respiration' } }
    ]
  },
  fingers: {
    name: 'Fingers', icon: '☝️',
    positions: [
      { name: 'Fingers PA Projection',         type: 'routine', info: { desc: 'PA projection of individual finger showing phalanges and IP joints.', cr: 'Perpendicular to PIP joint', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'Fingers PA Oblique Projection', type: 'routine', info: { desc: 'PA oblique at 45° showing individual digit interosseous spaces.', cr: 'Perpendicular to PIP joint', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'Fingers Lateromedial Projection', type: 'routine', info: { desc: 'True lateral of individual finger; demonstrates phalanges and IP joints in profile.', cr: 'Perpendicular to PIP joint', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } }
    ]
  },
  thumb: {
    name: 'Thumb', icon: '👍',
    positions: [
      { name: 'Thumb AP Projection',           type: 'routine', info: { desc: 'AP projection of the thumb; note this is a true AP due to the anatomical position of the thumb.', cr: 'Perpendicular to 1st MCP joint', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'Thumb Lateral Position',        type: 'routine', info: { desc: 'Lateral projection of the thumb showing phalanges and 1st MCP joint in profile.', cr: 'Perpendicular to 1st MCP joint', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Oblique - Medial Rotation',  type: 'routine', info: { desc: 'PA oblique of thumb showing interosseous space between 1st and 2nd metacarpals.', cr: 'Perpendicular to 1st MCP joint', ir: '18×24 cm (8×10 in)', sid: '100–102 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'AP Axial (Robert Method)',      type: 'special', info: { desc: 'AP axial with forearm hyperpronated; demonstrates the 1st CMC joint without superimposition.', cr: 'Perpendicular to 1st CMC joint', ir: '8×10 cm (3×4 in)', sid: '100–102 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } },
      { name: 'PA Stress (Folio Method)',      type: 'special', info: { desc: 'PA stress view of the 1st MCP joint with lateral stress applied; detects ulnar collateral ligament injury.', cr: 'Perpendicular to 1st MCP joint', ir: '8×10 cm (3×4 in)', sid: '100–102 cm (40 in)', kv: '50–60 kVp', resp: 'Suspend respiration' } }
    ]
  }
};

// ═══ QUIZ DATA ═══
const QUIZ = {};

// ═══ STATISTICS ═══
function getStatistics() {
  let totalChapters = 0;
  let totalPositions = 0;
  for (let ch in BOOK) {
    totalChapters++;
    if (BOOK[ch].subchapters) {
      for (let sub in BOOK[ch].subchapters) {
        totalPositions += (BOOK[ch].subchapters[sub].positions || []).length;
      }
    } else {
      totalPositions += (BOOK[ch].positions || []).length;
    }
  }
  return { chapters: totalChapters, positions: totalPositions };
}