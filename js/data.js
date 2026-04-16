// ══════════════════════════════════════════════
// DATA MODULE — Book Content & Statistics
// ══════════════════════════════════════════════

const IMAGES_PATH = 'renamed_images/';

// ═══ BOOK DATA ═══
const BOOK = {
  shoulder: {
    name: 'Shoulder',
    icon: '🦴',
    positions: [
      { name: 'AP External Rotation', type: 'routine', imgKey: 'Shoulder_AP_External_Rotation',
        info: { desc: 'AP projection in external rotation; greater tubercle shown in profile laterally.', cr: 'Perpendicular to IR, to coracoid process', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'AP Internal Rotation', type: 'routine', imgKey: 'Shoulder_AP_Internal_Rotation',
        info: { desc: 'AP projection in internal rotation; lesser tubercle shown in profile medially.', cr: 'Perpendicular to IR, to coracoid process', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'AP Neutral Rotation (Trauma)', type: 'routine', imgKey: 'Shoulder_AP_Neutral_Rotation_Trauma_Erect',
        info: { desc: 'AP projection without rotation; used when movement is restricted due to trauma.', cr: 'Perpendicular to IR, to coracoid process', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Transthoracic Lateral – Erect (Trauma)', type: 'routine', imgKey: 'Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect',
        info: { desc: 'Lateral projection through thorax; used when arm movement is not possible.', cr: 'Horizontal, perpendicular to IR, through thorax', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '80–90', resp: 'Suspended at full inspiration' } },
      { name: 'Transthoracic Lateral – Supine (Trauma)', type: 'routine', imgKey: 'Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Supine',
        info: { desc: 'Lateral projection through thorax performed supine; used in trauma.', cr: 'Horizontal, perpendicular to IR', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '80–90', resp: 'Suspended at full inspiration' } },
      { name: 'Inferosuperior Axial – Lawrence Method', type: 'special', imgKey: 'Shoulder_Inferosuperior_Axial_Lawrence_Method',
        info: { desc: 'Axial view of shoulder; demonstrates glenohumeral joint and coracoid process.', cr: 'Horizontal, medially 15–30° through axilla', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Inferosuperior Axial – Clements Modification', type: 'special', imgKey: 'Shoulder_Inferosuperior_Axial_Clements_Modification',
        info: { desc: 'Modified axial; used when patient cannot abduct arm fully.', cr: 'Horizontal to axillary region', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Inferosuperior Axial – Exaggerated External Rotation', type: 'special', imgKey: 'Shoulder_Inferosuperior_Axial_Lawrence_Method_Exaggerated_External_Rotation',
        info: { desc: 'Axial with exaggerated external rotation to better demonstrate anterior glenoid rim.', cr: 'Horizontal through axilla', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Inferosuperior Axial – Alternative 5–15° Angle', type: 'special', imgKey: 'Shoulder_Inferosuperior_Axial_Clements_Modification_Alternative_5_to_15deg_Angle',
        info: { desc: 'Modified Clements with 5–15° CR angle for limited mobility patients.', cr: 'Horizontal, 5–15° toward feet', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'AP Oblique – Glenoid Cavity (Grashey Method)', type: 'special', imgKey: 'Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_RPO',
        info: { desc: 'RPO oblique demonstrates glenohumeral joint in profile; 35–45° rotation.', cr: 'Perpendicular to IR', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'AP Apical Oblique Axial (Garth Method)', type: 'special', imgKey: 'Shoulder_AP_Apical_Oblique_Axial_Garth_Method_45deg_Posterior_Oblique_CR_45deg_Caudad',
        info: { desc: '45° posterior oblique with 45° caudal CR; demonstrates Hill-Sachs and Bankart lesions.', cr: '45° caudad, to glenohumeral joint', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Apical AP Axial Projection', type: 'special', imgKey: 'Shoulder_Apical_AP_Axial_Projection_CR_30deg_Caudad',
        info: { desc: 'AP axial with 30° caudal CR; demonstrates anterior shoulder dislocations.', cr: '30° caudad, to glenohumeral joint', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'PA Axial – Bernageau Method', type: 'special', imgKey: 'Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method',
        info: { desc: 'Transaxillary projection to demonstrate anterior glenoid rim erosion.', cr: 'Perpendicular to scapular plane', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '65–75', resp: 'Suspended' } },
      { name: 'PA Oblique – Scapular Y Lateral (Trauma)', type: 'special', imgKey: 'Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma',
        info: { desc: 'True lateral of shoulder; demonstrates displacement of humeral head relative to glenoid.', cr: 'Perpendicular to IR, to glenohumeral joint', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Tangential – Intertubercular Sulcus (Fisk Modification, Erect)', type: 'special', imgKey: 'Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Erect',
        info: { desc: 'Tangential view of bicipital groove; demonstrates intertubercular sulcus.', cr: '10–15° posteriorly along long axis of humerus', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'Suspended' } },
      { name: 'Tangential – Intertubercular Sulcus (Fisk Modification, Supine)', type: 'special', imgKey: 'Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Supine',
        info: { desc: 'Supine variant of Fisk modification for the bicipital groove.', cr: '10–15° posteriorly along long axis of humerus', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'Suspended' } },
      { name: 'Tangential – Supraspinatus Outlet (Neer Method)', type: 'special', imgKey: 'Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method_CR_10_to_15deg_Caudal',
        info: { desc: 'PA oblique (scapular Y) with 10–15° caudal tilt; demonstrates supraspinatus outlet.', cr: '10–15° caudad', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } }
    ]
  },

  humerus: {
    name: 'Humerus',
    icon: '🦴',
    positions: [
      { name: 'AP Projection (Erect)', type: 'routine', imgKey: 'Humerus_AP_Projection_Erect',
        info: { desc: 'AP projection of humerus in erect position; demonstrates entire humerus.', cr: 'Perpendicular to mid-humerus', ir: '14×17 in (35×43 cm)', sid: '40 in (102 cm)', kv: '65–75', resp: 'Suspended' } },
      { name: 'AP Projection (Supine)', type: 'routine', imgKey: 'Humerus_AP_Projection_Supine',
        info: { desc: 'AP projection of humerus supine; arm in external rotation.', cr: 'Perpendicular to mid-humerus', ir: '14×17 in (35×43 cm)', sid: '40 in (102 cm)', kv: '65–75', resp: 'Suspended' } },
      { name: 'Rotational Lateral – Lateromedial Erect (Back to IR)', type: 'routine', imgKey: 'Humerus_Rotational_Lateral_Lateromedial_Erect_Back_to_IR',
        info: { desc: 'Lateral projection with patient back to IR; elbow flexed 90°.', cr: 'Perpendicular to mid-humerus', ir: '14×17 in (35×43 cm)', sid: '40 in (102 cm)', kv: '65–75', resp: 'Suspended' } },
      { name: 'Rotational Lateral – Mediolateral Erect (Facing IR)', type: 'routine', imgKey: 'Humerus_Rotational_Lateral_Mediolateral_Erect_Facing_IR',
        info: { desc: 'Lateral projection with patient facing IR.', cr: 'Perpendicular to mid-humerus', ir: '14×17 in (35×43 cm)', sid: '40 in (102 cm)', kv: '65–75', resp: 'Suspended' } },
      { name: 'Rotational Lateral (Supine)', type: 'routine', imgKey: 'Humerus_Rotational_Lateral_Supine',
        info: { desc: 'Lateral humerus projection in supine position.', cr: 'Perpendicular to mid-humerus', ir: '14×17 in (35×43 cm)', sid: '40 in (102 cm)', kv: '65–75', resp: 'Suspended' } },
      { name: 'Transthoracic Lateral (Trauma)', type: 'special', imgKey: 'Humerus_Transthoracic_Lateral_Projection_Trauma_Erect_and_Recumbent',
        info: { desc: 'Lateral projection through thorax; used in trauma when arm movement is impossible.', cr: 'Horizontal through thorax, perpendicular to IR', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '80–90', resp: 'Suspended at full inspiration' } },
      { name: 'Trauma – Horizontal Beam Lateral Mid-to-Distal', type: 'special', imgKey: 'Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal',
        info: { desc: 'Horizontal beam lateral for mid-to-distal humerus trauma.', cr: 'Horizontal, perpendicular to humerus', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '65–75', resp: 'Suspended' } }
    ]
  },

  elbow: {
    name: 'Elbow',
    icon: '🦴',
    positions: [
      { name: 'AP Projection (Fully Extended)', type: 'routine', imgKey: 'Elbow_AP_Projection_Fully_Extended',
        info: { desc: 'AP projection of elbow fully extended; demonstrates joint space, epicondyles, and radial head.', cr: 'Perpendicular to elbow joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'AP Alternate – Partial Flexion (Forearm Parallel)', type: 'routine', imgKey: 'Elbow_AP_Alternate_Partial_Flexion_Forearm_Parallel',
        info: { desc: 'AP with forearm parallel to IR; used when full extension not possible.', cr: 'Perpendicular to forearm', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'AP Alternate – Partial Flexion (Humerus Parallel)', type: 'routine', imgKey: 'Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel',
        info: { desc: 'AP with humerus parallel to IR; used when full extension not possible.', cr: 'Perpendicular to humerus', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'Lateromedial Projection (Flexed 90°)', type: 'routine', imgKey: 'Elbow_Lateromedial_Projection_Flexed_90deg',
        info: { desc: 'True lateral of elbow flexed 90°; demonstrates the olecranon, trochlea, and capitulum.', cr: 'Perpendicular to elbow joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'AP Oblique – Lateral (External Rotation)', type: 'routine', imgKey: 'Elbow_AP_Oblique_Lateral_External_Rotation',
        info: { desc: '45° external rotation oblique; demonstrates radial head, neck, and tuberosity free of superimposition.', cr: 'Perpendicular to elbow joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'AP Oblique – Medial (Internal Rotation)', type: 'routine', imgKey: 'Elbow_AP_Oblique_Medial_Internal_Rotation',
        info: { desc: '45° internal rotation oblique; demonstrates coronoid process in profile.', cr: 'Perpendicular to elbow joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'Radial Head – Lateromedial (Hand Supinated)', type: 'special', imgKey: 'Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation',
        info: { desc: 'Four lateral projections rotating hand from supination to pronation to see all of radial head.', cr: 'Perpendicular to radial head', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'Acute Flexion – Distal Humerus', type: 'special', imgKey: 'Elbow_Acute_Flexion_Distal_Humerus_CR_Perpendicular_to_Humerus',
        info: { desc: 'Acute flexion with CR perpendicular to humerus; visualizes distal humerus when full extension impossible.', cr: 'Perpendicular to humerus', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'Acute Flexion – Proximal Forearm', type: 'special', imgKey: 'Elbow_Acute_Flexion_Proximal_Forearm_CR_Perpendicular_to_Forearm',
        info: { desc: 'Acute flexion with CR perpendicular to forearm; visualizes proximal radius and ulna.', cr: 'Perpendicular to forearm', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'Trauma Axial – Lateromedial (Coyle, Radial Head)', type: 'special', imgKey: 'Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Erect',
        info: { desc: 'Coyle method lateral with 45° CR toward shoulder; demonstrates radial head and capitulum.', cr: '45° toward shoulder', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'Trauma Axial – Mediolateral (Coyle, Coronoid Process)', type: 'special', imgKey: 'Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Erect',
        info: { desc: 'Coyle method mediolateral with 45° CR toward elbow; demonstrates coronoid process.', cr: '45° toward elbow', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } }
    ]
  },

  forearm: {
    name: 'Forearm',
    icon: '🦴',
    positions: [
      { name: 'AP Projection', type: 'routine', imgKey: 'Forearm_AP_Projection',
        info: { desc: 'AP projection of forearm; supinated hand, demonstrates radius and ulna.', cr: 'Perpendicular to mid-forearm', ir: '14×17 in (35×43 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } },
      { name: 'Lateromedial Projection', type: 'routine', imgKey: 'Forearm_Lateromedial_Projection',
        info: { desc: 'Lateral projection of forearm; elbow flexed 90°, demonstrates radius and ulna in lateral.', cr: 'Perpendicular to mid-forearm', ir: '14×17 in (35×43 cm)', sid: '40 in (102 cm)', kv: '60–70', resp: 'N/A' } }
    ]
  },

  wrist: {
    name: 'Wrist',
    icon: '🖐',
    positions: [
      { name: 'PA Projection', type: 'routine', imgKey: 'Wrist_PA_Projection',
        info: { desc: 'PA projection of wrist; demonstrates carpal bones, wrist joint, and distal radius/ulna.', cr: 'Perpendicular to 3rd MCP joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'Lateromedial Projection', type: 'routine', imgKey: 'Wrist_Lateromedial_Projection',
        info: { desc: 'Lateral projection of wrist; demonstrates palmar/dorsal displacement.', cr: 'Perpendicular to wrist joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'Lateromedial Projection with Support', type: 'routine', imgKey: 'Wrist_Lateromedial_Projection_with_Support',
        info: { desc: 'Lateral wrist with sponge support for accurate positioning.', cr: 'Perpendicular to wrist joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'PA Oblique – Lateral Rotation with Support', type: 'routine', imgKey: 'Wrist_PA_Oblique_Lateral_Rotation_with_Support',
        info: { desc: 'PA oblique with 45° lateral rotation and sponge support; demonstrates medial carpals.', cr: 'Perpendicular to wrist joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'PA Oblique – Lateral Rotation without Support', type: 'routine', imgKey: 'Wrist_PA_Oblique_Lateral_Rotation_without_Support',
        info: { desc: 'PA oblique with 45° lateral rotation; demonstrates medial carpals.', cr: 'Perpendicular to wrist joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'Alternative AP Projection', type: 'special', imgKey: 'Wrist_Alternative_AP_Projection',
        info: { desc: 'AP wrist projection; demonstrates dorsal surface of distal ulna better than PA.', cr: 'Perpendicular to wrist joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'PA Radial Deviation', type: 'special', imgKey: 'Wrist_PA_Radial_Deviation',
        info: { desc: 'PA with wrist deviated radially; opens medial intercarpal spaces.', cr: 'Perpendicular to wrist joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'PA Axial – Scaphoid (Ulnar Deviation, 15° CR)', type: 'special', imgKey: 'Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR',
        info: { desc: 'PA with ulnar deviation and 15° CR cephalad; demonstrates scaphoid without foreshortening.', cr: '15° toward elbow (cephalad)', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'PA Scaphoid – Modified Stecher Method (Hand Elevated)', type: 'special', imgKey: 'Wrist_PA_Scaphoid_Modified_Stecher_Method_Hand_Elevated_Ulnar_Deviation',
        info: { desc: 'Stecher method with hand elevated 20° and ulnar deviation; demonstrates scaphoid.', cr: 'Perpendicular to scaphoid', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'PA Scaphoid – Modified Stecher Method (Severe Pain)', type: 'special', imgKey: 'Wrist_PA_Scaphoid_Modified_Stecher_Method_Severe_Pain_No_Ulnar_Deviation',
        info: { desc: 'Modified Stecher for patients with severe pain; without ulnar deviation.', cr: 'Perpendicular to scaphoid', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'Carpal Bridge Tangential', type: 'special', imgKey: 'Wrist_Carpal_Bridge_Tangential_Projection',
        info: { desc: 'Tangential projection of dorsal carpal surface; demonstrates foreign bodies and fractures.', cr: '45° toward elbow along forearm axis', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'Carpal Canal Tangential – Gaynor-Hart Method', type: 'special', imgKey: 'Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method',
        info: { desc: 'Tangential projection of carpal canal; demonstrates hamate hook and pisiform.', cr: '25–30° toward fingers from forearm axis', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } }
    ]
  },

  hand: {
    name: 'Hand',
    icon: '🖐',
    positions: [
      { name: 'PA Projection', type: 'routine', imgKey: 'Hand_PA_Projection',
        info: { desc: 'PA projection of hand; demonstrates metacarpals and phalanges.', cr: 'Perpendicular to 3rd MCP joint', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'PA Oblique – Digits Parallel', type: 'routine', imgKey: 'Hand_PA_Oblique_Projection_Digits_Parallel',
        info: { desc: 'PA oblique 45° with digits parallel to IR; demonstrates metacarpal shafts.', cr: 'Perpendicular to 3rd MCP joint', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'PA Oblique – Digits Not Parallel', type: 'routine', imgKey: 'Hand_PA_Oblique_Projection_Digits_Not_Parallel',
        info: { desc: 'PA oblique 45° with digits not parallel; alternative oblique position.', cr: 'Perpendicular to 3rd MCP joint', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'Lateral in Extension', type: 'routine', imgKey: 'Hand_Lateral_in_Extension',
        info: { desc: 'Lateral projection with hand fully extended; demonstrates palmar/dorsal displacement.', cr: 'Perpendicular to 2nd MCP joint', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'Lateral in Flexion', type: 'routine', imgKey: 'Hand_Lateral_in_Flexion',
        info: { desc: 'Lateral projection in flexion (fan lateral); separates phalanges.', cr: 'Perpendicular to 2nd MCP joint', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'Fan Lateral – Lateromedial Projection', type: 'special', imgKey: 'Hand_Fan_Lateral_Lateromedial_Projection',
        info: { desc: 'Fan lateral with fingers spread to separate phalanges for individual finger evaluation.', cr: 'Perpendicular to 2nd MCP joint', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } },
      { name: 'AP Axial – Brewerton Method', type: 'special', imgKey: 'Hand_AP_Axial_Brewerton_Method',
        info: { desc: 'PA hand with 65° CR angulation; demonstrates MCP joints for early rheumatoid changes.', cr: '65° toward wrist along metacarpals', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '55–65', resp: 'N/A' } }
    ]
  },

  fingers: {
    name: 'Fingers',
    icon: '🖐',
    positions: [
      { name: 'PA Projection', type: 'routine', imgKey: 'Fingers_PA_Projection',
        info: { desc: 'PA projection of individual finger; demonstrates phalanges and IP joints.', cr: 'Perpendicular to PIP joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '50–60', resp: 'N/A' } },
      { name: 'PA Oblique Projection', type: 'routine', imgKey: 'Fingers_PA_Oblique_Projection',
        info: { desc: 'PA oblique 45° of finger; demonstrates interphalangeal joints obliquely.', cr: 'Perpendicular to PIP joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '50–60', resp: 'N/A' } },
      { name: 'Lateromedial Projection', type: 'routine', imgKey: 'Fingers_Lateromedial_Projection',
        info: { desc: 'True lateral of individual finger; demonstrates palmar/dorsal displacement.', cr: 'Perpendicular to PIP joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '50–60', resp: 'N/A' } }
    ]
  },

  thumb: {
    name: 'Thumb',
    icon: '🖐',
    positions: [
      { name: 'AP Projection', type: 'routine', imgKey: 'Thumb_AP_Projection',
        info: { desc: 'AP projection of thumb; demonstrates phalanges and 1st MCP joint.', cr: 'Perpendicular to 1st MCP joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '50–60', resp: 'N/A' } },
      { name: 'PA Oblique – Medial Rotation', type: 'routine', imgKey: 'Thumb_PA_Oblique_Projection_Medial_Rotation',
        info: { desc: 'PA oblique of thumb with medial rotation; demonstrates CMC joint.', cr: 'Perpendicular to 1st CMC joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '50–60', resp: 'N/A' } },
      { name: 'Lateral Position', type: 'routine', imgKey: 'Thumb_Lateral_Position',
        info: { desc: 'Lateral projection of thumb; demonstrates palmar/dorsal displacement.', cr: 'Perpendicular to 1st MCP joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '50–60', resp: 'N/A' } },
      { name: 'AP Axial – Modified Robert Method', type: 'special', imgKey: 'Thumb_AP_Axial_Modified_Robert_Method',
        info: { desc: 'True AP of 1st CMC joint; demonstrates trapeziometacarpal joint in profile.', cr: 'Perpendicular to 1st CMC joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '50–60', resp: 'N/A' } },
      { name: 'PA Stress – Folio Method', type: 'special', imgKey: 'Thumb_PA_Stress_Folio_Method',
        info: { desc: 'Stress view of thumb MCP joint to evaluate ulnar collateral ligament (Stener lesion).', cr: 'Perpendicular to 1st MCP joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '50–60', resp: 'N/A' } }
    ]
  },

  scapula: {
    name: 'Scapula',
    icon: '🦴',
    positions: [
      { name: 'AP Projection (Erect)', type: 'routine', imgKey: 'Scapula_AP_Projection_Erect',
        info: { desc: 'AP projection of scapula with arm abducted; demonstrates body, spine, and processes.', cr: 'Perpendicular to mid-scapula', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Lateral – Body of Scapula (45° LAO)', type: 'routine', imgKey: 'Scapula_Lateral_Position_Erect_Body_of_Scapula_45deg_LAO',
        info: { desc: '45° LAO lateral of scapular body; patient rotated until scapula is perpendicular to IR.', cr: 'Perpendicular to medial border of scapula', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Lateral – Acromion/Coracoid (60° LAO)', type: 'special', imgKey: 'Scapula_Lateral_Position_Erect_Acromion_Coracoid_Process_60deg_LAO',
        info: { desc: '60° LAO lateral of scapula; demonstrates acromion and coracoid process.', cr: 'Perpendicular to scapula', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Lateral Position (Recumbent)', type: 'routine', imgKey: 'Scapula_Lateral_Position_Recumbent',
        info: { desc: 'Lateral scapula in recumbent position; arm positioned across chest.', cr: 'Perpendicular to medial border of scapula', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Lateral – Palpating Borders (Recumbent)', type: 'routine', imgKey: 'Scapula_Lateral_Position_Recumbent_Palpating_Borders',
        info: { desc: 'Recumbent lateral with palpation of scapular borders for positioning accuracy.', cr: 'Perpendicular to medial border of scapula', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'Lateral – Alternative Supine', type: 'special', imgKey: 'Scapula_Lateral_Position_Recumbent_Alternative_Supine',
        info: { desc: 'Alternative supine lateral of scapula for limited-mobility patients.', cr: 'Perpendicular to medial border of scapula', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } }
    ]
  },

  clavicle: {
    name: 'Clavicle',
    icon: '🦴',
    positions: [
      { name: 'AP Projection (CR 0°)', type: 'routine', imgKey: 'Clavicle_AP_Projection_CR_0deg',
        info: { desc: 'AP projection of clavicle with horizontal CR; demonstrates clavicle overlying ribs.', cr: 'Perpendicular (0°) to mid-clavicle', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended at deep inspiration' } },
      { name: 'AP Axial Projection (CR 15–30° Cephalad)', type: 'routine', imgKey: 'Clavicle_AP_Axial_Projection_CR_15_to_30deg_Cephalad',
        info: { desc: 'AP axial with 15–30° cephalad CR; projects clavicle above ribs for better visualization.', cr: '15–30° cephalad to mid-clavicle', ir: '10×12 in (24×30 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended at deep inspiration' } }
    ]
  },

  ac_joints: {
    name: 'AC Joints',
    icon: '🦴',
    positions: [
      { name: 'AP Axial – Zanca Method', type: 'routine', imgKey: 'AC_Joints_AP_Axial_Zanca_Method',
        info: { desc: '10–15° cephalad AP of AC joint; demonstrates joint space without rib superimposition.', cr: '10–15° cephalad to AC joint', ir: '8×10 in (18×24 cm)', sid: '40 in (102 cm)', kv: '70–80', resp: 'Suspended' } },
      { name: 'AP Bilateral – Pearson Method with Weights', type: 'routine', imgKey: 'AC_Joints_AP_Bilateral_Pearson_Method_Stress_View_with_Weights',
        info: { desc: 'Bilateral AP with stress weights; compares AC joints to diagnose ligament tears.', cr: 'Perpendicular to AC joints', ir: '14×17 in (35×43 cm)', sid: '72 in (183 cm)', kv: '70–80', resp: 'Suspended' } }
    ]
  }
};

// ═══ STATISTICS ═══
function getStatistics() {
  let chapterCount = 0;
  let positionCount = 0;
  for (let chKey in BOOK) {
    chapterCount++;
    const chapter = BOOK[chKey];
    if (chapter.subchapters) {
      for (let schKey in chapter.subchapters) {
        positionCount += (chapter.subchapters[schKey].positions || []).length;
      }
    } else {
      positionCount += (chapter.positions || []).length;
    }
  }
  return { chapters: chapterCount, positions: positionCount };
}

// ═══ IMAGE PATH ═══
function getImagePath(posName) {
  for (let chKey in BOOK) {
    const chapter = BOOK[chKey];
    const positions = chapter.positions || [];
    const pos = positions.find(function(p) { return p.name === posName; });
    if (pos && pos.imgKey) {
      return IMAGES_PATH + pos.imgKey + '_Position.jpeg';
    }
    if (chapter.subchapters) {
      for (let schKey in chapter.subchapters) {
        const subPositions = chapter.subchapters[schKey].positions || [];
        const subPos = subPositions.find(function(p) { return p.name === posName; });
        if (subPos && subPos.imgKey) {
          return IMAGES_PATH + subPos.imgKey + '_Position.jpeg';
        }
      }
    }
  }
  return null;
}

// ═══ QUIZ DATA ═══
const QUIZ = {};