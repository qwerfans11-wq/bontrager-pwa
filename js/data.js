// ══════════════════════════════════════════════
// DATA MODULE — Book Data, Image Mapping & Statistics
// ══════════════════════════════════════════════

const IMAGES_PATH = 'renamed_images/';

// ═══ MAIN BOOK DATA ═══
const BOOK = {
  shoulder: {
    icon: '🦴',
    name: 'Shoulder',
    positions: [
      {
        name: 'AP External Rotation',
        type: 'routine',
        img: 'renamed_images/Shoulder_AP_External_Rotation_Position.jpeg',
        xray: 'renamed_images/Shoulder_AP_External_Rotation_Xray.jpeg',
        info: {
          desc: 'Patient erect or supine, back against IR. Humerus externally rotated so epicondyles are parallel to IR. Hand supinated. Greater tubercle in profile laterally.',
          cr: 'Perpendicular to IR, directed to coracoid process',
          ir: '24×30 cm (10×12 in) crosswise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'AP Internal Rotation',
        type: 'routine',
        img: 'renamed_images/Shoulder_AP_Internal_Rotation_Position.jpeg',
        xray: 'renamed_images/Shoulder_AP_Internal_Rotation_Xray.jpeg',
        info: {
          desc: 'Patient erect or supine, back against IR. Humerus internally rotated so epicondyles are perpendicular to IR. Hand pronated. Lesser tubercle in profile medially.',
          cr: 'Perpendicular to IR, directed to coracoid process',
          ir: '24×30 cm (10×12 in) crosswise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'AP Neutral Rotation (Trauma)',
        type: 'special',
        img: 'renamed_images/Shoulder_AP_Neutral_Rotation_Trauma_Erect_Position.jpeg',
        xray: 'renamed_images/Shoulder_AP_Neutral_Rotation_Trauma_Xray.jpeg',
        info: {
          desc: 'Trauma position. Patient erect or supine. Arm in neutral position (not rotated). Used when rotation is contraindicated.',
          cr: 'Perpendicular to IR, directed to coracoid process',
          ir: '24×30 cm (10×12 in) crosswise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'AP Oblique — Grashey Method (Glenoid Cavity)',
        type: 'routine',
        img: 'renamed_images/Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_RPO_Position.jpeg',
        xray: 'renamed_images/Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_Xray.jpeg',
        info: {
          desc: 'Patient rotated 35–45° toward affected side (RPO for right shoulder). Scapula parallel to IR. Demonstrates glenohumeral joint space.',
          cr: 'Perpendicular, 2.5 cm (1 in) inferior and medial to coracoid process',
          ir: '24×30 cm (10×12 in) crosswise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'AP Apical Oblique Axial — Garth Method',
        type: 'special',
        img: 'renamed_images/Shoulder_AP_Apical_Oblique_Axial_Garth_Method_45deg_Posterior_Oblique_CR_45deg_Caudad_Position.jpeg',
        xray: 'renamed_images/Shoulder_AP_Apical_Oblique_Axial_Garth_Method_Xray.jpeg',
        info: {
          desc: 'Patient 45° posterior oblique. Demonstrates glenoid rim and glenohumeral joint. Used to detect Hill-Sachs defects and Bankart lesions.',
          cr: '45° caudad, directed to glenohumeral joint',
          ir: '24×30 cm (10×12 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Apical AP Axial Projection',
        type: 'special',
        img: 'renamed_images/Shoulder_Apical_AP_Axial_Projection_CR_30deg_Caudad_Position.jpeg',
        xray: 'renamed_images/Shoulder_Apical_AP_Axial_Projection_Xray.jpeg',
        info: {
          desc: 'Patient supine or erect. Demonstrates the inferior glenoid rim and inferior glenohumeral joint.',
          cr: '45° caudad, to glenohumeral joint',
          ir: '24×30 cm (10×12 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Inferosuperior Axial — Lawrence Method',
        type: 'routine',
        img: 'renamed_images/Shoulder_Inferosuperior_Axial_Lawrence_Method_Position.jpeg',
        xray: 'renamed_images/Shoulder_Inferosuperior_Axial_Lawrence_Method_Xray.jpeg',
        info: {
          desc: 'Patient supine. Arm abducted 90°. IR placed superior to shoulder. Demonstrates axial view of glenohumeral joint and bicipital groove.',
          cr: 'Horizontal, angled 15–30° medially, directed through axilla to IR',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Inferosuperior Axial — Lawrence Method (Exaggerated External Rotation)',
        type: 'special',
        img: 'renamed_images/Shoulder_Inferosuperior_Axial_Lawrence_Method_Exaggerated_External_Rotation_Position.jpeg',
        xray: 'renamed_images/Shoulder_Inferosuperior_Axial_Lawrence_Method_Xray.jpeg',
        info: {
          desc: 'Modification with exaggerated external rotation for improved visualization of the bicipital groove.',
          cr: 'Horizontal, angled 15–30° medially through axilla',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Inferosuperior Axial — Clements Modification',
        type: 'special',
        img: 'renamed_images/Shoulder_Inferosuperior_Axial_Clements_Modification_Position.jpeg',
        xray: 'renamed_images/Shoulder_Inferosuperior_Axial_Clements_Modification_Xray.jpeg',
        info: {
          desc: 'For patients who cannot abduct arm 90°. IR placed lateral to shoulder. Used as alternative to Lawrence method.',
          cr: 'Horizontal through axilla, angled 5–15° toward shoulder',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'PA Axial — Transaxillary (Modified Bernageau Method)',
        type: 'special',
        img: 'renamed_images/Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method_Position.jpeg',
        xray: 'renamed_images/Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method_Xray.jpeg',
        info: {
          desc: 'Patient leans forward. Arm raised and rested on support. Demonstrates posterior glenoid rim for Bankart lesion detection.',
          cr: 'Horizontal, directed through axilla to IR',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'PA Oblique — Scapular Y (Trauma)',
        type: 'special',
        img: 'renamed_images/Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma_Position.jpeg',
        xray: 'renamed_images/Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma_No_Dislocation_Xray.jpeg',
        info: {
          desc: 'Patient rotated 45–60° anterior oblique. Scapula in lateral position forming a Y shape. Used to detect shoulder dislocations without manipulation.',
          cr: 'Perpendicular to glenohumeral joint',
          ir: '24×30 cm (10×12 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Tangential — Intertubercular Sulcus — Fisk Modification (Erect)',
        type: 'special',
        img: 'renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Erect_Position.jpeg',
        xray: 'renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Xray.jpeg',
        info: {
          desc: 'Patient standing, leaning forward over IR on table. Humerus vertical. Demonstrates bicipital (intertubercular) groove for tendon assessment.',
          cr: '10–15° anteriorly along shaft of humerus',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Tangential — Intertubercular Sulcus — Fisk Modification (Supine)',
        type: 'special',
        img: 'renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Supine_Position.jpeg',
        xray: 'renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Xray.jpeg',
        info: {
          desc: 'Patient supine. Arm elevated and rested on table edge. Demonstrates bicipital groove.',
          cr: '10–15° along shaft of humerus',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Tangential — Supraspinatus Outlet — Neer Method',
        type: 'special',
        img: 'renamed_images/Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method_CR_10_to_15deg_Caudal_Position.jpeg',
        xray: 'renamed_images/Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method_Xray.jpeg',
        info: {
          desc: 'Patient in PA oblique position (similar to scapular Y). Demonstrates supraspinatus outlet for shoulder impingement evaluation.',
          cr: '10–15° caudad, directed to glenohumeral joint',
          ir: '24×30 cm (10×12 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Transthoracic Lateral — Proximal Humerus Trauma (Erect)',
        type: 'special',
        img: 'renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect_Position.jpeg',
        xray: 'renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect_Xray.jpeg',
        info: {
          desc: 'Patient erect lateral, affected arm down. Opposite arm raised. Used when patient cannot raise or externally rotate arm. Demonstrates proximal humerus through thorax.',
          cr: 'Horizontal, perpendicular to IR, through thorax to shoulder joint',
          ir: '24×30 cm (10×12 in)',
          sid: '100 cm (40 in)',
          kv: '80–90 kVp',
          resp: 'Slow breathing during exposure (blurs ribs/lung markings)'
        }
      },
      {
        name: 'Transthoracic Lateral — Proximal Humerus Trauma (Supine)',
        type: 'special',
        img: 'renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Supine_Position.jpeg',
        xray: 'renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect_Xray.jpeg',
        info: {
          desc: 'Patient supine, rotated laterally. Used for recumbent patients unable to assume erect position.',
          cr: 'Horizontal, directed through thorax to affected shoulder',
          ir: '24×30 cm (10×12 in)',
          sid: '100 cm (40 in)',
          kv: '80–90 kVp',
          resp: 'Slow breathing during exposure'
        }
      }
    ]
  },

  humerus: {
    icon: '💪',
    name: 'Humerus',
    positions: [
      {
        name: 'AP Projection (Erect)',
        type: 'routine',
        img: 'renamed_images/Humerus_AP_Projection_Erect_Position.jpeg',
        xray: 'renamed_images/Humerus_AP_Projection_Xray.jpeg',
        info: {
          desc: 'Patient erect, back against IR. Arm extended, slightly abducted. Epicondyles parallel to IR. Hand supinated. Both joints included.',
          cr: 'Perpendicular to midshaft of humerus',
          ir: '35×43 cm (14×17 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '65–75 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'AP Projection (Supine)',
        type: 'routine',
        img: 'renamed_images/Humerus_AP_Projection_Supine_Position.jpeg',
        xray: 'renamed_images/Humerus_AP_Projection_Xray.jpeg',
        info: {
          desc: 'Patient supine, arm extended and slightly abducted. Hand supinated. Epicondyles parallel to IR.',
          cr: 'Perpendicular to midshaft of humerus',
          ir: '35×43 cm (14×17 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '65–75 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Rotational Lateral — Mediolateral (Erect, Facing IR)',
        type: 'routine',
        img: 'renamed_images/Humerus_Rotational_Lateral_Mediolateral_Erect_Facing_IR_Position.jpeg',
        xray: 'renamed_images/Humerus_Rotational_Lateral_Mediolateral_Erect_Xray.jpeg',
        info: {
          desc: 'Patient erect, facing IR. Humerus in lateral position with elbow flexed. Epicondyles perpendicular to IR. Medial to lateral direction.',
          cr: 'Perpendicular to midshaft of humerus',
          ir: '35×43 cm (14×17 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '65–75 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Rotational Lateral — Lateromedial (Erect, Back to IR)',
        type: 'routine',
        img: 'renamed_images/Humerus_Rotational_Lateral_Lateromedial_Erect_Back_to_IR_Position.jpeg',
        xray: 'renamed_images/Humerus_Rotational_Lateral_Mediolateral_Erect_Xray.jpeg',
        info: {
          desc: 'Patient erect, back to IR. Humerus internally rotated, elbow flexed. Lateral to medial direction.',
          cr: 'Perpendicular to midshaft of humerus',
          ir: '35×43 cm (14×17 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '65–75 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Rotational Lateral (Supine)',
        type: 'routine',
        img: 'renamed_images/Humerus_Rotational_Lateral_Supine_Position.jpeg',
        xray: 'renamed_images/Humerus_Rotational_Lateral_Mediolateral_Erect_Xray.jpeg',
        info: {
          desc: 'Patient supine. Elbow flexed 90°, humerus in true lateral position. Epicondyles perpendicular to IR.',
          cr: 'Perpendicular to midshaft of humerus',
          ir: '35×43 cm (14×17 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '65–75 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Transthoracic Lateral — Trauma (Erect and Recumbent)',
        type: 'special',
        img: 'renamed_images/Humerus_Transthoracic_Lateral_Projection_Trauma_Erect_and_Recumbent_Position.jpeg',
        xray: 'renamed_images/Humerus_Transthoracic_Lateral_Projection_Trauma_Xray.jpeg',
        info: {
          desc: 'Patient in lateral position, affected arm down. Opposite arm raised. Demonstrates proximal to mid humerus through thorax.',
          cr: 'Horizontal, perpendicular to IR, through thorax',
          ir: '24×30 cm (10×12 in) or 35×43 cm',
          sid: '100 cm (40 in)',
          kv: '80–90 kVp',
          resp: 'Slow breathing during exposure'
        }
      },
      {
        name: 'Trauma — Horizontal Beam Lateral (Mid to Distal)',
        type: 'special',
        img: 'renamed_images/Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal_Position.jpeg',
        xray: 'renamed_images/Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal_Xray.jpeg',
        info: {
          desc: 'For mid to distal humerus trauma. Patient supine or erect. Horizontal beam with IR placed medially or laterally to humerus.',
          cr: 'Horizontal, perpendicular to humerus and IR',
          ir: '24×30 cm (10×12 in)',
          sid: '100 cm (40 in)',
          kv: '65–75 kVp',
          resp: 'Suspend at end of expiration'
        }
      }
    ]
  },

  elbow: {
    icon: '🦾',
    name: 'Elbow',
    positions: [
      {
        name: 'AP Projection (Fully Extended)',
        type: 'routine',
        img: 'renamed_images/Elbow_AP_Projection_Fully_Extended_Position.jpeg',
        xray: 'renamed_images/Elbow_AP_Projection_Fully_Extended_Xray.jpeg',
        info: {
          desc: 'Patient seated at end of table. Arm fully extended, hand supinated. Elbow fully extended with epicondyles parallel to IR.',
          cr: 'Perpendicular, to midpoint of elbow joint (mid-antecubital fossa)',
          ir: '18×24 cm (8×10 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'AP — Alternate Partial Flexion (Forearm Parallel)',
        type: 'special',
        img: 'renamed_images/Elbow_AP_Alternate_Partial_Flexion_Forearm_Parallel_Position.jpeg',
        xray: 'renamed_images/Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel_Xray.jpeg',
        info: {
          desc: 'For patients who cannot fully extend elbow. Forearm parallel to IR (humerus elevated). Demonstrates distal humerus and trochlea.',
          cr: 'Perpendicular to forearm, to elbow joint',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'AP — Alternate Partial Flexion (Humerus Parallel)',
        type: 'special',
        img: 'renamed_images/Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel_Position.jpeg',
        xray: 'renamed_images/Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel_Xray.jpeg',
        info: {
          desc: 'For patients who cannot fully extend elbow. Humerus parallel to IR (forearm elevated). Demonstrates proximal radius/ulna.',
          cr: 'Perpendicular to humerus, to elbow joint',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'AP Oblique — Lateral (External) Rotation',
        type: 'routine',
        img: 'renamed_images/Elbow_AP_Oblique_Lateral_External_Rotation_Position.jpeg',
        xray: 'renamed_images/Elbow_AP_Oblique_Lateral_External_Rotation_Xray.jpeg',
        info: {
          desc: 'Arm in AP position then externally rotated 45°. Hand supinated and further rotated. Demonstrates radial head and capitulum without superimposition.',
          cr: 'Perpendicular to midpoint of elbow joint',
          ir: '18×24 cm (8×10 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'AP Oblique — Medial (Internal) Rotation',
        type: 'routine',
        img: 'renamed_images/Elbow_AP_Oblique_Medial_Internal_Rotation_Position.jpeg',
        xray: 'renamed_images/Elbow_AP_Oblique_Medial_Internal_Rotation_Xray.jpeg',
        info: {
          desc: 'Arm in AP position then internally rotated 45°. Hand pronated. Demonstrates coronoid process in profile and trochlea-olecranon relationship.',
          cr: 'Perpendicular to midpoint of elbow joint',
          ir: '18×24 cm (8×10 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Lateromedial Projection (Flexed 90°)',
        type: 'routine',
        img: 'renamed_images/Elbow_Lateromedial_Projection_Flexed_90deg_Position.jpeg',
        xray: 'renamed_images/Elbow_Lateromedial_Projection_Flexed_90deg_Xray.jpeg',
        info: {
          desc: 'Elbow flexed exactly 90°. Humerus, forearm, and hand all in the same horizontal plane. Epicondyles perpendicular to IR.',
          cr: 'Perpendicular, to lateral epicondyle',
          ir: '18×24 cm (8×10 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Radial Head — Lateromedial (Hand Supinated, External Rotation)',
        type: 'special',
        img: 'renamed_images/Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation_Position.jpeg',
        xray: 'renamed_images/Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation_Xray.jpeg',
        info: {
          desc: 'One of four radial head projections. Elbow flexed 90°, hand in maximum external rotation (supinated). Shows one aspect of radial head.',
          cr: 'Perpendicular to lateral epicondyle',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Acute Flexion — Distal Humerus',
        type: 'special',
        img: 'renamed_images/Elbow_Acute_Flexion_Distal_Humerus_CR_Perpendicular_to_Humerus_Position.jpeg',
        xray: 'renamed_images/Elbow_Acute_Flexion_Distal_Humerus_Xray.jpeg',
        info: {
          desc: 'Elbow acutely flexed. Humerus parallel to IR. Shows distal humerus (capitulum, trochlea) when elbow cannot extend.',
          cr: 'Perpendicular to humerus',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Acute Flexion — Proximal Forearm',
        type: 'special',
        img: 'renamed_images/Elbow_Acute_Flexion_Proximal_Forearm_CR_Perpendicular_to_Forearm_Position.jpeg',
        xray: 'renamed_images/Elbow_Acute_Flexion_Proximal_Forearm_Xray.jpeg',
        info: {
          desc: 'Elbow acutely flexed. Forearm parallel to IR. Shows proximal radius and ulna when elbow cannot extend.',
          cr: 'Perpendicular to forearm',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Trauma Axial Lateromedial — Coyle Method (Radial Head)',
        type: 'special',
        img: 'renamed_images/Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Erect_Position.jpeg',
        xray: 'renamed_images/Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Xray.jpeg',
        info: {
          desc: 'Elbow flexed 90°. CR angled 45° toward shoulder. Demonstrates radial head free from superimposition of coronoid process.',
          cr: '45° toward shoulder (cephalad), to radial head',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Trauma Axial Mediolateral — Coyle Method (Coronoid Process)',
        type: 'special',
        img: 'renamed_images/Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Erect_Position.jpeg',
        xray: 'renamed_images/Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Xray.jpeg',
        info: {
          desc: 'Elbow flexed 80°. CR angled 45° away from shoulder. Demonstrates coronoid process in profile.',
          cr: '45° away from shoulder (caudad), to coronoid process',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      }
    ]
  },

  forearm: {
    icon: '🦴',
    name: 'Forearm',
    positions: [
      {
        name: 'AP Projection',
        type: 'routine',
        img: 'renamed_images/Forearm_AP_Projection_Position.jpeg',
        xray: 'renamed_images/Forearm_AP_Projection_Xray.jpeg',
        info: {
          desc: 'Patient seated. Arm fully extended, hand supinated. Both wrist and elbow joints included on IR.',
          cr: 'Perpendicular to midforearm',
          ir: '35×43 cm (14×17 in) or 24×30 cm lengthwise',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Lateromedial Projection',
        type: 'routine',
        img: 'renamed_images/Forearm_Lateromedial_Projection_Position.jpeg',
        xray: 'renamed_images/Forearm_Lateromedial_Projection_Xray.jpeg',
        info: {
          desc: 'Patient seated. Elbow flexed 90°, forearm in true lateral position. Epicondyles perpendicular to IR. Both joints included.',
          cr: 'Perpendicular to midforearm',
          ir: '35×43 cm (14×17 in) or 24×30 cm lengthwise',
          sid: '100 cm (40 in)',
          kv: '55–65 kVp',
          resp: 'N/A'
        }
      }
    ]
  },

  wrist: {
    icon: '✋',
    name: 'Wrist',
    positions: [
      {
        name: 'PA Projection',
        type: 'routine',
        img: 'renamed_images/Wrist_PA_Projection_Position.jpeg',
        xray: 'renamed_images/Wrist_PA_Projection_Xray.jpeg',
        info: {
          desc: 'Patient seated. Wrist in PA position, hand pronated, fingers slightly flexed. Wrist flat on IR. Demonstrates carpal bones and distal radius/ulna.',
          cr: 'Perpendicular to midcarpal area (between styloid processes)',
          ir: '18×24 cm (8×10 in) crosswise or divided',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Oblique — Lateral Rotation (with Support)',
        type: 'routine',
        img: 'renamed_images/Wrist_PA_Oblique_Lateral_Rotation_with_Support_Position.jpeg',
        xray: 'renamed_images/Wrist_PA_Oblique_Lateral_Rotation_Xray.jpeg',
        info: {
          desc: 'Wrist externally rotated 45° from PA position (lateral rotation). Demonstrates trapezium, first CMC joint, and scaphoid in oblique view.',
          cr: 'Perpendicular to midcarpal area',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Oblique — Lateral Rotation (without Support)',
        type: 'special',
        img: 'renamed_images/Wrist_PA_Oblique_Lateral_Rotation_without_Support_Position.jpeg',
        xray: 'renamed_images/Wrist_PA_Oblique_Lateral_Rotation_Xray.jpeg',
        info: {
          desc: 'Same as PA oblique lateral rotation but without positioning sponge. Wrist rotated 45° from PA.',
          cr: 'Perpendicular to midcarpal area',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Lateromedial Projection',
        type: 'routine',
        img: 'renamed_images/Wrist_Lateromedial_Projection_Position.jpeg',
        xray: 'renamed_images/Wrist_Lateromedial_Projection_Xray.jpeg',
        info: {
          desc: 'Wrist in true lateral position. Radius and ulna superimposed. Demonstrates wrist joint, carpals in lateral view, and volar/dorsal surfaces.',
          cr: 'Perpendicular to wrist joint (styloid process of radius)',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Lateromedial Projection (with Support)',
        type: 'special',
        img: 'renamed_images/Wrist_Lateromedial_Projection_with_Support_Position.jpeg',
        xray: 'renamed_images/Wrist_Lateromedial_Projection_Xray.jpeg',
        info: {
          desc: 'True lateral wrist with positioning support/sponge to maintain neutral position.',
          cr: 'Perpendicular to wrist joint',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Radial Deviation',
        type: 'special',
        img: 'renamed_images/Wrist_PA_Radial_Deviation_Position.jpeg',
        xray: 'renamed_images/Wrist_PA_Radial_Deviation_Xray.jpeg',
        info: {
          desc: 'Wrist in PA position, hand deviated toward radial (lateral) side. Demonstrates ulnar side of carpals, especially triquetrum and pisiform.',
          cr: 'Perpendicular to midcarpal area',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Axial — Scaphoid (Ulnar Deviation, 15° CR)',
        type: 'special',
        img: 'renamed_images/Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR_Position.jpeg',
        xray: 'renamed_images/Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR_Xray.jpeg',
        info: {
          desc: 'Wrist in ulnar deviation. CR angled 15° toward elbow. Demonstrates scaphoid in elongated view without foreshortening.',
          cr: '15° proximally (toward elbow), to scaphoid area',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Scaphoid — Modified Stecher Method (Hand Elevated, Ulnar Deviation)',
        type: 'special',
        img: 'renamed_images/Wrist_PA_Scaphoid_Modified_Stecher_Method_Hand_Elevated_Ulnar_Deviation_Position.jpeg',
        xray: 'renamed_images/Wrist_PA_Scaphoid_Modified_Stecher_Method_Xray.jpeg',
        info: {
          desc: 'Wrist in ulnar deviation with hand elevated on sponge. Demonstrates scaphoid in elongated PA view.',
          cr: 'Perpendicular to scaphoid',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Scaphoid — Modified Stecher Method (Severe Pain, No Ulnar Deviation)',
        type: 'special',
        img: 'renamed_images/Wrist_PA_Scaphoid_Modified_Stecher_Method_Severe_Pain_No_Ulnar_Deviation_Position.jpeg',
        xray: 'renamed_images/Wrist_PA_Scaphoid_Modified_Stecher_Method_Xray.jpeg',
        info: {
          desc: 'Alternative for painful wrists. Wrist flat without ulnar deviation. CR angled 20° toward elbow.',
          cr: '20° proximally (toward elbow), to scaphoid',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Alternative AP Projection',
        type: 'special',
        img: 'renamed_images/Wrist_Alternative_AP_Projection_Position.jpeg',
        xray: 'renamed_images/Wrist_PA_Projection_Xray.jpeg',
        info: {
          desc: 'AP projection for comparison or when PA cannot be performed. Hand supinated. Radius and ulna may slightly overlap carpals.',
          cr: 'Perpendicular to midcarpal area',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Carpal Bridge — Tangential Projection',
        type: 'special',
        img: 'renamed_images/Wrist_Carpal_Bridge_Tangential_Projection_Position.jpeg',
        xray: 'renamed_images/Wrist_Carpal_Bridge_Tangential_Projection_Xray.jpeg',
        info: {
          desc: 'Patient seated, hand on IR with wrist hyperextended. Demonstrates posterior (dorsal) surface of carpal bones for loose body detection.',
          cr: '45° angle toward wrist, to carpal area',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Carpal Canal — Tangential (Gaynor-Hart Method)',
        type: 'special',
        img: 'renamed_images/Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method_Position.jpeg',
        xray: 'renamed_images/Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method_Xray.jpeg',
        info: {
          desc: 'Patient seated, wrist hyperextended, fingers extended and held back. Demonstrates carpal tunnel (canal) — hook of hamate, trapezium, pisiform, scaphoid.',
          cr: '25–30° from long axis of hand, to palm (at base of 3rd metacarpal)',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      }
    ]
  },

  hand: {
    icon: '��',
    name: 'Hand',
    positions: [
      {
        name: 'PA Projection',
        type: 'routine',
        img: 'renamed_images/Hand_PA_Projection_Position.jpeg',
        xray: 'renamed_images/Hand_PA_Projection_Xray.jpeg',
        info: {
          desc: 'Hand flat on IR, palm down. Fingers slightly spread. Demonstrates all phalanges, metacarpals, and carpals.',
          cr: 'Perpendicular, to 3rd MCP joint',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Oblique Projection (Digits Parallel)',
        type: 'routine',
        img: 'renamed_images/Hand_PA_Oblique_Projection_Digits_Parallel_Position.jpeg',
        xray: 'renamed_images/Hand_PA_Oblique_Projection_Digits_Parallel_Xray.jpeg',
        info: {
          desc: 'Hand in PA then rotated 45° laterally. Fingers kept straight and parallel to IR using positioning sponge. Demonstrates metacarpals and phalanges in oblique view.',
          cr: 'Perpendicular, to 3rd MCP joint',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Oblique Projection (Digits Not Parallel)',
        type: 'special',
        img: 'renamed_images/Hand_PA_Oblique_Projection_Digits_Not_Parallel_Position.jpeg',
        xray: 'renamed_images/Hand_PA_Oblique_Projection_Digits_Not_Parallel_Xray.jpeg',
        info: {
          desc: 'Hand obliqued 45° without support. Fingers naturally curve. Less preferred than parallel digit version but acceptable.',
          cr: 'Perpendicular, to 3rd MCP joint',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Lateral in Extension',
        type: 'routine',
        img: 'renamed_images/Hand_Lateral_in_Extension_Position.jpeg',
        xray: 'renamed_images/Hand_Lateral_in_Extension_Xray.jpeg',
        info: {
          desc: 'Hand in true lateral position, fingers extended. Thumb superimposed over fingers. Demonstrates anterior/posterior displacement of fractures.',
          cr: 'Perpendicular, to 2nd MCP joint',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Lateral in Flexion',
        type: 'routine',
        img: 'renamed_images/Hand_Lateral_in_Flexion_Position.jpeg',
        xray: 'renamed_images/Hand_Lateral_in_Flexion_Xray.jpeg',
        info: {
          desc: 'Hand in true lateral position, fingers flexed (fanned) to separate phalanges. Better demonstrates individual phalanges.',
          cr: 'Perpendicular, to 2nd MCP joint',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Fan Lateral — Lateromedial Projection',
        type: 'special',
        img: 'renamed_images/Hand_Fan_Lateral_Lateromedial_Projection_Position.jpeg',
        xray: 'renamed_images/Hand_Fan_Lateral_Lateromedial_Projection_Xray.jpeg',
        info: {
          desc: 'Hand in lateral, fingers fanned and supported by sponge. Each finger is demonstrated without superimposition.',
          cr: 'Perpendicular, to MCP joints',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'AP Axial — Brewerton Method',
        type: 'special',
        img: 'renamed_images/Hand_AP_Axial_Brewerton_Method_Position.jpeg',
        xray: 'renamed_images/Hand_AP_Axial_Brewerton_Method_Xray.jpeg',
        info: {
          desc: 'Hand in PA position, MCP joints flexed 65°. Demonstrates MCP joint erosions in early rheumatoid arthritis.',
          cr: '15° toward wrist (ulnar side), to MCP joints',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      }
    ]
  },

  fingers: {
    icon: '👆',
    name: 'Fingers',
    positions: [
      {
        name: 'PA Projection',
        type: 'routine',
        img: 'renamed_images/Fingers_PA_Projection_Position.jpeg',
        xray: 'renamed_images/Fingers_PA_Projection_Xray.jpeg',
        info: {
          desc: 'Individual finger in PA position on IR. Adjacent fingers may be folded back or supported.',
          cr: 'Perpendicular, to PIP joint of affected finger',
          ir: '18×24 cm (8×10 in) divided crosswise',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Oblique Projection',
        type: 'routine',
        img: 'renamed_images/Fingers_PA_Oblique_Projection_Position.jpeg',
        xray: 'renamed_images/Fingers_PA_Oblique_Projection_Xray.jpeg',
        info: {
          desc: 'Finger rotated 45° from PA position. Demonstrates phalanges and interphalangeal joints in oblique view.',
          cr: 'Perpendicular, to PIP joint',
          ir: '18×24 cm (8×10 in) divided',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Lateromedial Projection',
        type: 'routine',
        img: 'renamed_images/Fingers_Lateromedial_Projection_Position.jpeg',
        xray: 'renamed_images/Fingers_Lateromedial_Projection_Xray.jpeg',
        info: {
          desc: 'Finger in true lateral position. Demonstrates anterior-posterior displacement of fractures and soft tissue swelling.',
          cr: 'Perpendicular, to PIP joint',
          ir: '18×24 cm (8×10 in) divided',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      }
    ]
  },

  thumb: {
    icon: '👍',
    name: 'Thumb',
    positions: [
      {
        name: 'AP Projection',
        type: 'routine',
        img: 'renamed_images/Thumb_AP_Projection_Position.jpeg',
        xray: 'renamed_images/Thumb_AP_Projection_Xray.jpeg',
        info: {
          desc: 'Hand internally rotated so thumb dorsum rests on IR. Demonstrates thumb in AP view — true AP for 1st metacarpal and phalanges.',
          cr: 'Perpendicular, to 1st MCP joint',
          ir: '18×24 cm (8×10 in) divided',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Oblique Projection (Medial Rotation)',
        type: 'routine',
        img: 'renamed_images/Thumb_PA_Oblique_Projection_Medial_Rotation_Position.jpeg',
        xray: 'renamed_images/Thumb_PA_Oblique_Projection_Medial_Rotation_Xray.jpeg',
        info: {
          desc: 'Hand in PA position. Thumb naturally falls into oblique position. Demonstrates thumb in oblique view with 1st CMC joint.',
          cr: 'Perpendicular, to 1st MCP joint',
          ir: '18×24 cm (8×10 in) divided',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'Lateral Position',
        type: 'routine',
        img: 'renamed_images/Thumb_Lateral_Position_Position.jpeg',
        xray: 'renamed_images/Thumb_Lateral_Position_Xray.jpeg',
        info: {
          desc: 'Thumb in true lateral position. Hand in lateral or slightly obliqued to achieve true lateral of thumb.',
          cr: 'Perpendicular, to 1st MCP joint',
          ir: '18×24 cm (8×10 in) divided',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'AP Axial — Modified Robert Method',
        type: 'special',
        img: 'renamed_images/Thumb_AP_Axial_Modified_Robert_Method_Position.jpeg',
        xray: 'renamed_images/Thumb_AP_Axial_Modified_Robert_Method_Xray.jpeg',
        info: {
          desc: 'Hand hyperextended, thumb dorsum on IR. All fingers flexed away. Demonstrates 1st CMC joint and trapezium in AP axial view.',
          cr: 'Perpendicular, to 1st CMC joint',
          ir: '18×24 cm (8×10 in) divided',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      },
      {
        name: 'PA Stress — Folio Method',
        type: 'special',
        img: 'renamed_images/Thumb_PA_Stress_Folio_Method_Position.jpeg',
        xray: 'renamed_images/Thumb_PA_Stress_Folio_Method_Xray.jpeg',
        info: {
          desc: 'Stress view for UCL (ulnar collateral ligament) injury (gamekeeper\'s/skier\'s thumb). Thumb placed in holder with stress applied.',
          cr: 'Perpendicular, to 1st MCP joint',
          ir: '18×24 cm (8×10 in) divided',
          sid: '100 cm (40 in)',
          kv: '50–60 kVp',
          resp: 'N/A'
        }
      }
    ]
  },

  scapula: {
    icon: '🦴',
    name: 'Scapula',
    positions: [
      {
        name: 'AP Projection (Erect)',
        type: 'routine',
        img: 'renamed_images/Scapula_AP_Projection_Erect_Position.jpeg',
        xray: 'renamed_images/Scapula_AP_Projection_Xray.jpeg',
        info: {
          desc: 'Patient erect. Arm abducted 90° to pull scapula away from ribs. Demonstrates scapula in frontal view. Slow breathing during exposure to blur lung/rib detail.',
          cr: 'Perpendicular, to midscapula (2 in below coracoid process)',
          ir: '24×30 cm (10×12 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Slow breathing during exposure (blurs superimposed structures)'
        }
      },
      {
        name: 'Lateral Position — Erect (Acromion/Coracoid, 60° LAO)',
        type: 'routine',
        img: 'renamed_images/Scapula_Lateral_Position_Erect_Acromion_Coracoid_Process_60deg_LAO_Position.jpeg',
        xray: 'renamed_images/Scapula_Lateral_Position_Erect_Acromion_Coracoid_Process_Xray.jpeg',
        info: {
          desc: 'Patient erect in anterior oblique position (60° from lateral). Arm rotated behind back. Demonstrates lateral scapula with acromion and coracoid process.',
          cr: 'Perpendicular, to medial border of scapula',
          ir: '24×30 cm (10×12 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Lateral Position — Erect (Body of Scapula, 45° LAO)',
        type: 'routine',
        img: 'renamed_images/Scapula_Lateral_Position_Erect_Body_of_Scapula_45deg_LAO_Position.jpeg',
        xray: 'renamed_images/Scapula_Lateral_Position_Erect_Body_of_Scapula_Xray.jpeg',
        info: {
          desc: 'Patient in anterior oblique position (45° from lateral). Best for body of scapula in lateral view.',
          cr: 'Perpendicular, to medial border of scapula',
          ir: '24×30 cm (10×12 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Lateral Position — Recumbent',
        type: 'routine',
        img: 'renamed_images/Scapula_Lateral_Position_Recumbent_Position.jpeg',
        xray: 'renamed_images/Scapula_Lateral_Position_Recumbent_Xray.jpeg',
        info: {
          desc: 'Patient recumbent in lateral position. Used when patient cannot assume erect position. Demonstrates scapula in lateral view.',
          cr: 'Horizontal, perpendicular to medial border of scapula',
          ir: '24×30 cm (10×12 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Lateral Position — Recumbent (Alternative Supine)',
        type: 'special',
        img: 'renamed_images/Scapula_Lateral_Position_Recumbent_Alternative_Supine_Position.jpeg',
        xray: 'renamed_images/Scapula_Lateral_Position_Recumbent_Xray.jpeg',
        info: {
          desc: 'Alternative supine position for lateral scapula when patient cannot be turned to lateral position.',
          cr: 'Horizontal, directed to scapula',
          ir: '24×30 cm (10×12 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'Lateral Position — Recumbent (Palpating Borders)',
        type: 'special',
        img: 'renamed_images/Scapula_Lateral_Position_Recumbent_Palpating_Borders_Position.jpeg',
        xray: 'renamed_images/Scapula_Lateral_Position_Recumbent_Xray.jpeg',
        info: {
          desc: 'Recumbent position with radiographer palpating scapular borders to confirm true lateral alignment.',
          cr: 'Horizontal, perpendicular to medial border of scapula',
          ir: '24×30 cm (10×12 in) lengthwise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      }
    ]
  },

  clavicle: {
    icon: '🦴',
    name: 'Clavicle',
    positions: [
      {
        name: 'AP Projection (CR 0°)',
        type: 'routine',
        img: 'renamed_images/Clavicle_AP_Projection_CR_0deg_Position.jpeg',
        xray: 'renamed_images/Clavicle_AP_Projection_CR_0deg_Xray.jpeg',
        info: {
          desc: 'Patient erect or supine, back against IR. Arm at side. Demonstrates full length of clavicle superimposed over upper ribs/lung.',
          cr: 'Perpendicular to midclavicle',
          ir: '24×30 cm (10×12 in) crosswise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'AP Axial Projection (CR 15–30° Cephalad)',
        type: 'routine',
        img: 'renamed_images/Clavicle_AP_Axial_Projection_CR_15_to_30deg_Cephalad_Position.jpeg',
        xray: 'renamed_images/Clavicle_AP_Axial_Projection_Xray.jpeg',
        info: {
          desc: 'Patient supine or erect. CR angled cephalad 15–30° to project clavicle above ribs and lung. Preferred view for fracture detection.',
          cr: '15–30° cephalad, to midclavicle',
          ir: '24×30 cm (10×12 in) crosswise',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      }
    ]
  },

  ac_joints: {
    icon: '🦴',
    name: 'AC Joints',
    positions: [
      {
        name: 'AP Axial — Zanca Method',
        type: 'routine',
        img: 'renamed_images/AC_Joints_AP_Axial_Zanca_Method_Position.jpeg',
        xray: 'renamed_images/AC_Joints_AP_Axial_Zanca_Method_Xray_Labeled.jpeg',
        info: {
          desc: 'Patient erect. CR angled 10–15° cephalad. Demonstrates single AC joint free from shoulder superimposition. More accurate than AP.',
          cr: '10–15° cephalad, to affected AC joint',
          ir: '18×24 cm (8×10 in)',
          sid: '100 cm (40 in)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      },
      {
        name: 'AP Bilateral — Pearson Method (with Weights)',
        type: 'routine',
        img: 'renamed_images/AC_Joints_AP_Bilateral_Pearson_Method_Stress_View_with_Weights_Position.jpeg',
        xray: 'renamed_images/AC_Joints_AP_Bilateral_Pearson_Method_with_and_without_Weights_Xray.jpeg',
        info: {
          desc: 'Patient erect. Both AC joints on one IR. 5–10 lb weights suspended from each wrist. Taken with and without weights to compare joint separation.',
          cr: 'Perpendicular, midway between both AC joints',
          ir: '35×43 cm (14×17 in) crosswise',
          sid: '180 cm (72 in) (to include both joints)',
          kv: '70–80 kVp',
          resp: 'Suspend at end of expiration'
        }
      }
    ]
  }
};

// ═══ QUIZ DATA ═══
const QUIZ = {};

// ═══ STATISTICS ═══
function getStatistics() {
  let chapters = 0;
  let positions = 0;

  for (let chKey in BOOK) {
    const chapter = BOOK[chKey];
    if (chapter.subchapters) {
      for (let schKey in chapter.subchapters) {
        chapters++;
        positions += (chapter.subchapters[schKey].positions || []).length;
      }
    } else {
      chapters++;
      positions += (chapter.positions || []).length;
    }
  }

  return { chapters, positions };
}

// ═══ IMAGE PATH LOOKUP ═══
function getImagePath(positionName) {
  for (let chKey in BOOK) {
    const chapter = BOOK[chKey];
    const positionsList = chapter.subchapters
      ? Object.values(chapter.subchapters).flatMap(s => s.positions || [])
      : (chapter.positions || []);

    const found = positionsList.find(p => p.name === positionName);
    if (found && found.img) return found.img;
  }
  return null;
}
