// ══════════════════════════════════════════════
// DATA MODULE — BOOK, POSITION_IMAGES, QUIZ
// ══════════════════════════════════════════════

// ─── POSITION IMAGES MAP ───
// Maps each position key (= image filename prefix) to its available images.
// Keys match the filenames in renamed_images/ (without type suffix).
const POSITION_IMAGES = {
  // ── Shoulder ──
  "Shoulder_AP_External_Rotation": {
    position: "renamed_images/Shoulder_AP_External_Rotation_Position.jpeg",
    xray:     "renamed_images/Shoulder_AP_External_Rotation_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_AP_External_Rotation_Xray_Labeled.jpeg"
  },
  "Shoulder_AP_Internal_Rotation": {
    position: "renamed_images/Shoulder_AP_Internal_Rotation_Position.jpeg",
    xray:     "renamed_images/Shoulder_AP_Internal_Rotation_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_AP_Internal_Rotation_Xray_Labeled.jpeg"
  },
  "Shoulder_AP_Neutral_Rotation_Trauma_Erect": {
    position: "renamed_images/Shoulder_AP_Neutral_Rotation_Trauma_Erect_Position.jpeg",
    xray:     "renamed_images/Shoulder_AP_Neutral_Rotation_Trauma_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_AP_Neutral_Rotation_Trauma_Xray_Labeled.jpeg"
  },
  "Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_RPO": {
    position: "renamed_images/Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_RPO_Position.jpeg",
    xray:     "renamed_images/Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_Xray_Labeled.jpeg"
  },
  "Shoulder_AP_Apical_Oblique_Axial_Garth_Method_45deg_Posterior_Oblique_CR_45deg_Caudad": {
    position: "renamed_images/Shoulder_AP_Apical_Oblique_Axial_Garth_Method_45deg_Posterior_Oblique_CR_45deg_Caudad_Position.jpeg",
    xray:     "renamed_images/Shoulder_AP_Apical_Oblique_Axial_Garth_Method_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_AP_Apical_Oblique_Axial_Garth_Method_Xray_Labeled.jpeg"
  },
  "Shoulder_Apical_AP_Axial_Projection_CR_30deg_Caudad": {
    position: "renamed_images/Shoulder_Apical_AP_Axial_Projection_CR_30deg_Caudad_Position.jpeg",
    xray:     "renamed_images/Shoulder_Apical_AP_Axial_Projection_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_Apical_AP_Axial_Projection_Xray_Labeled.jpeg"
  },
  "Shoulder_Inferosuperior_Axial_Lawrence_Method": {
    position: "renamed_images/Shoulder_Inferosuperior_Axial_Lawrence_Method_Position.jpeg",
    xray:     "renamed_images/Shoulder_Inferosuperior_Axial_Lawrence_Method_Xray.jpeg"
  },
  "Shoulder_Inferosuperior_Axial_Lawrence_Method_Exaggerated_External_Rotation": {
    position: "renamed_images/Shoulder_Inferosuperior_Axial_Lawrence_Method_Exaggerated_External_Rotation_Position.jpeg",
    xray:     "renamed_images/Shoulder_Inferosuperior_Axial_Lawrence_Method_Xray.jpeg"
  },
  "Shoulder_Inferosuperior_Axial_Clements_Modification": {
    position: "renamed_images/Shoulder_Inferosuperior_Axial_Clements_Modification_Position.jpeg",
    xray:     "renamed_images/Shoulder_Inferosuperior_Axial_Clements_Modification_Xray.jpeg"
  },
  "Shoulder_Inferosuperior_Axial_Clements_Modification_Alternative_5_to_15deg_Angle": {
    position: "renamed_images/Shoulder_Inferosuperior_Axial_Clements_Modification_Alternative_5_to_15deg_Angle_Position.jpeg",
    xray:     "renamed_images/Shoulder_Inferosuperior_Axial_Clements_Modification_Xray.jpeg"
  },
  "Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method": {
    position: "renamed_images/Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method_Position.jpeg",
    xray:     "renamed_images/Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method_Xray_Labeled.jpeg"
  },
  "Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma": {
    position: "renamed_images/Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma_Position.jpeg",
    xray:     "renamed_images/Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma_No_Dislocation_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma_Xray_Labeled.jpeg"
  },
  "Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Erect": {
    position: "renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Erect_Position.jpeg",
    xray:     "renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Xray_Labeled.jpeg"
  },
  "Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Supine": {
    position: "renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Supine_Position.jpeg",
    xray:     "renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Xray_Labeled.jpeg"
  },
  "Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method_CR_10_to_15deg_Caudal": {
    position: "renamed_images/Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method_CR_10_to_15deg_Caudal_Position.jpeg",
    xray:     "renamed_images/Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method_Xray.jpeg"
  },
  "Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect": {
    position: "renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect_Position.jpeg",
    xray:     "renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Xray_Labeled.jpeg"
  },
  "Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Supine": {
    position: "renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Supine_Position.jpeg",
    xray:     "renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect_Xray.jpeg",
    xrayLabeled: "renamed_images/Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Xray_Labeled.jpeg"
  },
  // ── Clavicle ──
  "Clavicle_AP_Projection_CR_0deg": {
    position: "renamed_images/Clavicle_AP_Projection_CR_0deg_Position.jpeg",
    xray:     "renamed_images/Clavicle_AP_Projection_CR_0deg_Xray.jpeg"
  },
  "Clavicle_AP_Axial_Projection_CR_15_to_30deg_Cephalad": {
    position: "renamed_images/Clavicle_AP_Axial_Projection_CR_15_to_30deg_Cephalad_Position.jpeg",
    xray:     "renamed_images/Clavicle_AP_Axial_Projection_Xray.jpeg"
  },
  // ── Scapula ──
  "Scapula_AP_Projection_Erect": {
    position: "renamed_images/Scapula_AP_Projection_Erect_Position.jpeg",
    xray:     "renamed_images/Scapula_AP_Projection_Xray.jpeg",
    xrayLabeled: "renamed_images/Scapula_AP_Projection_Xray_Labeled.jpeg"
  },
  "Scapula_Lateral_Position_Erect_Acromion_Coracoid_Process_60deg_LAO": {
    position: "renamed_images/Scapula_Lateral_Position_Erect_Acromion_Coracoid_Process_60deg_LAO_Position.jpeg",
    xray:     "renamed_images/Scapula_Lateral_Position_Erect_Acromion_Coracoid_Process_Xray.jpeg",
    xrayLabeled: "renamed_images/Scapula_Lateral_Position_Erect_Xray_Labeled.jpeg"
  },
  "Scapula_Lateral_Position_Erect_Body_of_Scapula_45deg_LAO": {
    position: "renamed_images/Scapula_Lateral_Position_Erect_Body_of_Scapula_45deg_LAO_Position.jpeg",
    xray:     "renamed_images/Scapula_Lateral_Position_Erect_Body_of_Scapula_Xray.jpeg",
    xrayLabeled: "renamed_images/Scapula_Lateral_Position_Erect_Xray_Labeled.jpeg"
  },
  "Scapula_Lateral_Position_Recumbent": {
    position: "renamed_images/Scapula_Lateral_Position_Recumbent_Position.jpeg",
    xray:     "renamed_images/Scapula_Lateral_Position_Recumbent_Xray.jpeg"
  },
  "Scapula_Lateral_Position_Recumbent_Alternative_Supine": {
    position: "renamed_images/Scapula_Lateral_Position_Recumbent_Alternative_Supine_Position.jpeg",
    xray:     "renamed_images/Scapula_Lateral_Position_Recumbent_Xray.jpeg"
  },
  "Scapula_Lateral_Position_Recumbent_Palpating_Borders": {
    position: "renamed_images/Scapula_Lateral_Position_Recumbent_Palpating_Borders_Position.jpeg",
    xray:     "renamed_images/Scapula_Lateral_Position_Recumbent_Xray.jpeg"
  },
  // ── AC Joints ──
  "AC_Joints_AP_Axial_Zanca_Method": {
    position: "renamed_images/AC_Joints_AP_Axial_Zanca_Method_Position.jpeg",
    xrayLabeled: "renamed_images/AC_Joints_AP_Axial_Zanca_Method_Xray_Labeled.jpeg"
  },
  "AC_Joints_AP_Bilateral_Pearson_Method_Stress_View_with_Weights": {
    position: "renamed_images/AC_Joints_AP_Bilateral_Pearson_Method_Stress_View_with_Weights_Position.jpeg",
    xray:     "renamed_images/AC_Joints_AP_Bilateral_Pearson_Method_with_and_without_Weights_Xray.jpeg",
    xrayLabeled: "renamed_images/AC_Joints_AP_Bilateral_Pearson_Method_Xray_Labeled.jpeg"
  },
  // ── Humerus ──
  "Humerus_AP_Projection_Erect": {
    position: "renamed_images/Humerus_AP_Projection_Erect_Position.jpeg",
    xray:     "renamed_images/Humerus_AP_Projection_Xray.jpeg",
    xrayLabeled: "renamed_images/Humerus_AP_Projection_Xray_Labeled.jpeg"
  },
  "Humerus_AP_Projection_Supine": {
    position: "renamed_images/Humerus_AP_Projection_Supine_Position.jpeg",
    xray:     "renamed_images/Humerus_AP_Projection_Xray.jpeg",
    xrayLabeled: "renamed_images/Humerus_AP_Projection_Xray_Labeled.jpeg"
  },
  "Humerus_Rotational_Lateral_Lateromedial_Erect_Back_to_IR": {
    position: "renamed_images/Humerus_Rotational_Lateral_Lateromedial_Erect_Back_to_IR_Position.jpeg",
    xray:     "renamed_images/Humerus_Rotational_Lateral_Mediolateral_Erect_Xray.jpeg",
    xrayLabeled: "renamed_images/Humerus_Rotational_Lateral_Mediolateral_Xray_Labeled.jpeg"
  },
  "Humerus_Rotational_Lateral_Mediolateral_Erect_Facing_IR": {
    position: "renamed_images/Humerus_Rotational_Lateral_Mediolateral_Erect_Facing_IR_Position.jpeg",
    xray:     "renamed_images/Humerus_Rotational_Lateral_Mediolateral_Erect_Xray.jpeg",
    xrayLabeled: "renamed_images/Humerus_Rotational_Lateral_Mediolateral_Xray_Labeled.jpeg"
  },
  "Humerus_Rotational_Lateral_Supine": {
    position: "renamed_images/Humerus_Rotational_Lateral_Supine_Position.jpeg",
    xray:     "renamed_images/Humerus_Rotational_Lateral_Mediolateral_Erect_Xray.jpeg",
    xrayLabeled: "renamed_images/Humerus_Rotational_Lateral_Mediolateral_Xray_Labeled.jpeg"
  },
  "Humerus_Transthoracic_Lateral_Projection_Trauma_Erect_and_Recumbent": {
    position: "renamed_images/Humerus_Transthoracic_Lateral_Projection_Trauma_Erect_and_Recumbent_Position.jpeg",
    xray:     "renamed_images/Humerus_Transthoracic_Lateral_Projection_Trauma_Xray.jpeg"
  },
  "Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal": {
    position: "renamed_images/Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal_Position.jpeg",
    xray:     "renamed_images/Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal_Xray.jpeg",
    xrayLabeled: "renamed_images/Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal_Xray_Labeled.jpeg"
  },
  // ── Elbow ──
  "Elbow_AP_Projection_Fully_Extended": {
    position: "renamed_images/Elbow_AP_Projection_Fully_Extended_Position.jpeg",
    xray:     "renamed_images/Elbow_AP_Projection_Fully_Extended_Xray.jpeg"
  },
  "Elbow_AP_Oblique_Lateral_External_Rotation": {
    position: "renamed_images/Elbow_AP_Oblique_Lateral_External_Rotation_Position.jpeg",
    xray:     "renamed_images/Elbow_AP_Oblique_Lateral_External_Rotation_Xray.jpeg",
    xrayLabeled: "renamed_images/Elbow_AP_Oblique_Lateral_External_Rotation_Xray_Labeled.jpeg"
  },
  "Elbow_AP_Oblique_Medial_Internal_Rotation": {
    position: "renamed_images/Elbow_AP_Oblique_Medial_Internal_Rotation_Position.jpeg",
    xray:     "renamed_images/Elbow_AP_Oblique_Medial_Internal_Rotation_Xray.jpeg"
  },
  "Elbow_Lateromedial_Projection_Flexed_90deg": {
    position: "renamed_images/Elbow_Lateromedial_Projection_Flexed_90deg_Position.jpeg",
    xray:     "renamed_images/Elbow_Lateromedial_Projection_Flexed_90deg_Xray.jpeg"
  },
  "Elbow_AP_Alternate_Partial_Flexion_Forearm_Parallel": {
    position: "renamed_images/Elbow_AP_Alternate_Partial_Flexion_Forearm_Parallel_Position.jpeg",
    xray:     "renamed_images/Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel_Xray.jpeg"
  },
  "Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel": {
    position: "renamed_images/Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel_Position.jpeg",
    xray:     "renamed_images/Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel_Xray.jpeg"
  },
  "Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation": {
    position: "renamed_images/Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation_Position.jpeg",
    xray:     "renamed_images/Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation_Xray.jpeg"
  },
  "Elbow_Acute_Flexion_Distal_Humerus_CR_Perpendicular_to_Humerus": {
    position: "renamed_images/Elbow_Acute_Flexion_Distal_Humerus_CR_Perpendicular_to_Humerus_Position.jpeg",
    xray:     "renamed_images/Elbow_Acute_Flexion_Distal_Humerus_Xray.jpeg"
  },
  "Elbow_Acute_Flexion_Proximal_Forearm_CR_Perpendicular_to_Forearm": {
    position: "renamed_images/Elbow_Acute_Flexion_Proximal_Forearm_CR_Perpendicular_to_Forearm_Position.jpeg",
    xray:     "renamed_images/Elbow_Acute_Flexion_Proximal_Forearm_Xray.jpeg"
  },
  "Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Erect": {
    position: "renamed_images/Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Erect_Position.jpeg",
    xray:     "renamed_images/Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Xray.jpeg"
  },
  "Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Erect": {
    position: "renamed_images/Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Erect_Position.jpeg",
    xray:     "renamed_images/Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Xray.jpeg"
  },
  // ── Forearm ──
  "Forearm_AP_Projection": {
    position: "renamed_images/Forearm_AP_Projection_Position.jpeg",
    xray:     "renamed_images/Forearm_AP_Projection_Xray.jpeg"
  },
  "Forearm_Lateromedial_Projection": {
    position: "renamed_images/Forearm_Lateromedial_Projection_Position.jpeg",
    xray:     "renamed_images/Forearm_Lateromedial_Projection_Xray.jpeg"
  },
  // ── Wrist ──
  "Wrist_PA_Projection": {
    position: "renamed_images/Wrist_PA_Projection_Position.jpeg",
    xray:     "renamed_images/Wrist_PA_Projection_Xray.jpeg",
    xrayLabeled: "renamed_images/Wrist_PA_Projection_Xray_Labeled.jpeg"
  },
  "Wrist_Lateromedial_Projection": {
    position: "renamed_images/Wrist_Lateromedial_Projection_Position.jpeg",
    xray:     "renamed_images/Wrist_Lateromedial_Projection_Xray.jpeg",
    xrayLabeled: "renamed_images/Wrist_Lateromedial_Projection_Xray_Labeled.jpeg"
  },
  "Wrist_Lateromedial_Projection_with_Support": {
    position: "renamed_images/Wrist_Lateromedial_Projection_with_Support_Position.jpeg",
    xray:     "renamed_images/Wrist_Lateromedial_Projection_Xray.jpeg",
    xrayLabeled: "renamed_images/Wrist_Lateromedial_Projection_Xray_Labeled.jpeg"
  },
  "Wrist_Alternative_AP_Projection": {
    position: "renamed_images/Wrist_Alternative_AP_Projection_Position.jpeg",
    xray:     "renamed_images/Wrist_PA_Projection_Xray.jpeg"
  },
  "Wrist_PA_Oblique_Lateral_Rotation_with_Support": {
    position: "renamed_images/Wrist_PA_Oblique_Lateral_Rotation_with_Support_Position.jpeg",
    xray:     "renamed_images/Wrist_PA_Oblique_Lateral_Rotation_Xray.jpeg",
    xrayLabeled: "renamed_images/Wrist_PA_Oblique_Lateral_Rotation_Xray_Labeled.jpeg"
  },
  "Wrist_PA_Oblique_Lateral_Rotation_without_Support": {
    position: "renamed_images/Wrist_PA_Oblique_Lateral_Rotation_without_Support_Position.jpeg",
    xray:     "renamed_images/Wrist_PA_Oblique_Lateral_Rotation_Xray.jpeg",
    xrayLabeled: "renamed_images/Wrist_PA_Oblique_Lateral_Rotation_Xray_Labeled.jpeg"
  },
  "Wrist_PA_Radial_Deviation": {
    position: "renamed_images/Wrist_PA_Radial_Deviation_Position.jpeg",
    xray:     "renamed_images/Wrist_PA_Radial_Deviation_Xray.jpeg"
  },
  "Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR": {
    position: "renamed_images/Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR_Position.jpeg",
    xray:     "renamed_images/Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR_Xray.jpeg",
    xrayLabeled: "renamed_images/Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_Xray_Labeled.jpeg"
  },
  "Wrist_PA_Scaphoid_Modified_Stecher_Method_Hand_Elevated_Ulnar_Deviation": {
    position: "renamed_images/Wrist_PA_Scaphoid_Modified_Stecher_Method_Hand_Elevated_Ulnar_Deviation_Position.jpeg",
    xray:     "renamed_images/Wrist_PA_Scaphoid_Modified_Stecher_Method_Xray.jpeg"
  },
  "Wrist_PA_Scaphoid_Modified_Stecher_Method_Severe_Pain_No_Ulnar_Deviation": {
    position: "renamed_images/Wrist_PA_Scaphoid_Modified_Stecher_Method_Severe_Pain_No_Ulnar_Deviation_Position.jpeg",
    xray:     "renamed_images/Wrist_PA_Scaphoid_Modified_Stecher_Method_Xray.jpeg"
  },
  "Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method": {
    position: "renamed_images/Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method_Position.jpeg",
    xray:     "renamed_images/Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method_Xray.jpeg"
  },
  "Wrist_Carpal_Bridge_Tangential_Projection": {
    position: "renamed_images/Wrist_Carpal_Bridge_Tangential_Projection_Position.jpeg",
    xray:     "renamed_images/Wrist_Carpal_Bridge_Tangential_Projection_Xray.jpeg"
  },
  // ── Hand ──
  "Hand_PA_Projection": {
    position: "renamed_images/Hand_PA_Projection_Position.jpeg",
    xray:     "renamed_images/Hand_PA_Projection_Xray.jpeg"
  },
  "Hand_PA_Oblique_Projection_Digits_Parallel": {
    position: "renamed_images/Hand_PA_Oblique_Projection_Digits_Parallel_Position.jpeg",
    xray:     "renamed_images/Hand_PA_Oblique_Projection_Digits_Parallel_Xray.jpeg",
    xrayLabeled: "renamed_images/Hand_PA_Oblique_Projection_Digits_Parallel_Xray_Labeled.jpeg"
  },
  "Hand_PA_Oblique_Projection_Digits_Not_Parallel": {
    position: "renamed_images/Hand_PA_Oblique_Projection_Digits_Not_Parallel_Position.jpeg",
    xray:     "renamed_images/Hand_PA_Oblique_Projection_Digits_Not_Parallel_Xray.jpeg"
  },
  "Hand_Fan_Lateral_Lateromedial_Projection": {
    position: "renamed_images/Hand_Fan_Lateral_Lateromedial_Projection_Position.jpeg",
    xray:     "renamed_images/Hand_Fan_Lateral_Lateromedial_Projection_Xray.jpeg",
    xrayLabeled: "renamed_images/Hand_Fan_Lateral_Lateromedial_Projection_Xray_Labeled.jpeg"
  },
  "Hand_Lateral_in_Extension": {
    position: "renamed_images/Hand_Lateral_in_Extension_Position.jpeg",
    xray:     "renamed_images/Hand_Lateral_in_Extension_Xray.jpeg"
  },
  "Hand_Lateral_in_Flexion": {
    position: "renamed_images/Hand_Lateral_in_Flexion_Position.jpeg",
    xray:     "renamed_images/Hand_Lateral_in_Flexion_Xray.jpeg",
    xrayLabeled: "renamed_images/Hand_Lateral_in_Flexion_Xray_Labeled.jpeg"
  },
  "Hand_AP_Axial_Brewerton_Method": {
    position: "renamed_images/Hand_AP_Axial_Brewerton_Method_Position.jpeg",
    xray:     "renamed_images/Hand_AP_Axial_Brewerton_Method_Xray.jpeg"
  },
  // ── Fingers ──
  "Fingers_PA_Projection": {
    position: "renamed_images/Fingers_PA_Projection_Position.jpeg",
    xray:     "renamed_images/Fingers_PA_Projection_Xray.jpeg"
  },
  "Fingers_PA_Oblique_Projection": {
    position: "renamed_images/Fingers_PA_Oblique_Projection_Position.jpeg",
    xray:     "renamed_images/Fingers_PA_Oblique_Projection_Xray.jpeg"
  },
  "Fingers_Lateromedial_Projection": {
    position: "renamed_images/Fingers_Lateromedial_Projection_Position.jpeg",
    xray:     "renamed_images/Fingers_Lateromedial_Projection_Xray.jpeg"
  },
  // ── Thumb ──
  "Thumb_AP_Projection": {
    position: "renamed_images/Thumb_AP_Projection_Position.jpeg",
    xray:     "renamed_images/Thumb_AP_Projection_Xray.jpeg"
  },
  "Thumb_Lateral_Position": {
    position: "renamed_images/Thumb_Lateral_Position_Position.jpeg",
    xray:     "renamed_images/Thumb_Lateral_Position_Xray.jpeg"
  },
  "Thumb_PA_Oblique_Projection_Medial_Rotation": {
    position: "renamed_images/Thumb_PA_Oblique_Projection_Medial_Rotation_Position.jpeg",
    xray:     "renamed_images/Thumb_PA_Oblique_Projection_Medial_Rotation_Xray.jpeg"
  },
  "Thumb_AP_Axial_Modified_Robert_Method": {
    position: "renamed_images/Thumb_AP_Axial_Modified_Robert_Method_Position.jpeg",
    xray:     "renamed_images/Thumb_AP_Axial_Modified_Robert_Method_Xray.jpeg"
  },
  "Thumb_PA_Stress_Folio_Method": {
    position: "renamed_images/Thumb_PA_Stress_Folio_Method_Position.jpeg",
    xray:     "renamed_images/Thumb_PA_Stress_Folio_Method_Xray.jpeg"
  }
};

// Returns the images object for a given position key, or null if not found.
function getPositionImages(key) {
  return POSITION_IMAGES[key] || null;
}

// ─── BOOK DATA STRUCTURE ───
const BOOK = {
  shoulder: {
    name: "Shoulder",
    icon: "🦴",
    positions: [
      { name: "AP External Rotation", key: "Shoulder_AP_External_Rotation", type: "routine",
        info: { desc: "Patient erect or supine, humerus in external rotation (palm forward). Demonstrates greater tubercle in profile.", cr: "Perpendicular to coracoid process", ir: "18×24 cm LW", sid: "100 cm", kv: "70–80", resp: "Suspend" } },
      { name: "AP Internal Rotation", key: "Shoulder_AP_Internal_Rotation", type: "routine",
        info: { desc: "Patient erect or supine, humerus in internal rotation (back of hand against thigh). Demonstrates lesser tubercle in profile.", cr: "Perpendicular to coracoid process", ir: "18×24 cm LW", sid: "100 cm", kv: "70–80", resp: "Suspend" } },
      { name: "AP Neutral Rotation (Trauma)", key: "Shoulder_AP_Neutral_Rotation_Trauma_Erect", type: "routine",
        info: { desc: "Erect trauma position. Arm in neutral rotation, no manipulation. Used when injury is suspected.", cr: "Perpendicular to coracoid process", ir: "18×24 cm LW", sid: "100 cm", kv: "70–80", resp: "Suspend" } },
      { name: "AP Oblique – Glenoid Cavity (Grashey Method)", key: "Shoulder_AP_Oblique_Glenoid_Cavity_Grashey_Method_RPO", type: "special",
        info: { desc: "Patient rotated 35–45° toward affected side (RPO). Opens glenohumeral joint space.", cr: "Perpendicular, to glenohumeral joint", ir: "18×24 cm LW", sid: "100 cm", kv: "70–80", resp: "Suspend" } },
      { name: "AP Apical Oblique (Garth Method)", key: "Shoulder_AP_Apical_Oblique_Axial_Garth_Method_45deg_Posterior_Oblique_CR_45deg_Caudad", type: "special",
        info: { desc: "45° posterior oblique body position, CR 45° caudad. Demonstrates Hill-Sachs defect and Bankart lesion.", cr: "45° caudad to coracoid process", ir: "18×24 cm LW", sid: "100 cm", kv: "75–85", resp: "Suspend" } },
      { name: "Apical AP Axial (CR 30° Caudad)", key: "Shoulder_Apical_AP_Axial_Projection_CR_30deg_Caudad", type: "special",
        info: { desc: "AP position with CR angled 30° caudad. Demonstrates inferior glenoid rim and Hill-Sachs defect.", cr: "30° caudad to coracoid process", ir: "18×24 cm LW", sid: "100 cm", kv: "75–85", resp: "Suspend" } },
      { name: "Inferosuperior Axial – Lawrence Method", key: "Shoulder_Inferosuperior_Axial_Lawrence_Method", type: "special",
        info: { desc: "Patient supine, arm abducted 90°. IR placed superior to shoulder. CR directed medially through axilla.", cr: "Horizontal, medially angled through axilla", ir: "18×24 cm LW", sid: "100 cm", kv: "75–85", resp: "Suspend" } },
      { name: "Inferosuperior Axial – Lawrence (Exaggerated External Rotation)", key: "Shoulder_Inferosuperior_Axial_Lawrence_Method_Exaggerated_External_Rotation", type: "special",
        info: { desc: "Modification of Lawrence method with arm in exaggerated external rotation for Hill-Sachs lesion.", cr: "Horizontal through axilla", ir: "18×24 cm LW", sid: "100 cm", kv: "75–85", resp: "Suspend" } },
      { name: "Inferosuperior Axial – Clements Modification", key: "Shoulder_Inferosuperior_Axial_Clements_Modification", type: "special",
        info: { desc: "Patient supine; IR against neck superior to shoulder. Used when arm cannot be abducted.", cr: "Horizontal through axilla", ir: "18×24 cm LW", sid: "100 cm", kv: "75–85", resp: "Suspend" } },
      { name: "Inferosuperior Axial – Clements (5–15° Angle)", key: "Shoulder_Inferosuperior_Axial_Clements_Modification_Alternative_5_to_15deg_Angle", type: "special",
        info: { desc: "Alternative Clements modification with 5–15° CR angle adjustment.", cr: "5–15° toward the elbow through axilla", ir: "18×24 cm LW", sid: "100 cm", kv: "75–85", resp: "Suspend" } },
      { name: "PA Axial Transaxillary – Modified Bernageau Method", key: "Shoulder_PA_Axial_Transaxillary_Modified_Bernageau_Method", type: "special",
        info: { desc: "Patient erect facing IR, arm raised overhead. CR directed through axilla posteriorly.", cr: "Through axilla", ir: "18×24 cm LW", sid: "100 cm", kv: "75–85", resp: "Suspend" } },
      { name: "PA Oblique Scapular Y – Lateral Trauma", key: "Shoulder_PA_Oblique_Scapular_Y_Lateral_Trauma", type: "routine",
        info: { desc: "Patient rotated 45–60° toward IR. Shoulder joint in lateral projection. Used for trauma evaluation.", cr: "Perpendicular to glenohumeral joint", ir: "24×30 cm LW", sid: "100 cm", kv: "75–85", resp: "Suspend" } },
      { name: "Tangential – Intertubercular Sulcus (Fisk, Erect)", key: "Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Erect", type: "special",
        info: { desc: "Erect. Arm in external rotation, CR directed down the groove at 10–15° anterior.", cr: "10–15° anterior-superior along groove", ir: "8×10 cm", sid: "100 cm", kv: "65–75", resp: "Suspend" } },
      { name: "Tangential – Intertubercular Sulcus (Fisk, Supine)", key: "Shoulder_Tangential_Intertubercular_Sulcus_Fisk_Modification_Supine", type: "special",
        info: { desc: "Supine modification of Fisk method. CR directed along intertubercular groove.", cr: "Along intertubercular groove", ir: "8×10 cm", sid: "100 cm", kv: "65–75", resp: "Suspend" } },
      { name: "Tangential – Supraspinatus Outlet (Neer Method)", key: "Shoulder_Tangential_Supraspinatus_Outlet_Neer_Method_CR_10_to_15deg_Caudal", type: "special",
        info: { desc: "Patient 45–60° oblique (PA). CR 10–15° caudal. Demonstrates supraspinatus outlet and acromion shape.", cr: "10–15° caudal to supraspinatus outlet", ir: "24×30 cm LW", sid: "100 cm", kv: "75–85", resp: "Suspend" } },
      { name: "Transthoracic Lateral – Proximal Humerus Trauma (Erect)", key: "Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Erect", type: "routine",
        info: { desc: "Erect trauma position. Patient turned 90° to IR. Opposite arm raised. CR through thorax.", cr: "Perpendicular, through thorax to surgical neck", ir: "24×30 cm LW", sid: "100 cm", kv: "75–85", resp: "Full inspiration" } },
      { name: "Transthoracic Lateral – Proximal Humerus Trauma (Supine)", key: "Shoulder_Transthoracic_Lateral_Proximal_Humerus_Trauma_Supine", type: "routine",
        info: { desc: "Supine trauma position. Patient lateral on table. CR through thorax.", cr: "Perpendicular through thorax", ir: "24×30 cm LW", sid: "100 cm", kv: "75–85", resp: "Full inspiration" } }
    ]
  },
  clavicle: {
    name: "Clavicle",
    icon: "🦴",
    positions: [
      { name: "AP Projection (CR 0°)", key: "Clavicle_AP_Projection_CR_0deg", type: "routine",
        info: { desc: "Patient supine or erect. CR perpendicular. Demonstrates full clavicle.", cr: "Perpendicular to mid-clavicle", ir: "30×35 cm LW", sid: "100 cm", kv: "65–75", resp: "Suspend" } },
      { name: "AP Axial Projection (CR 15–30° Cephalad)", key: "Clavicle_AP_Axial_Projection_CR_15_to_30deg_Cephalad", type: "routine",
        info: { desc: "Patient supine. CR 15–30° cephalad lifts clavicle off the ribs.", cr: "15–30° cephalad to mid-clavicle", ir: "30×35 cm LW", sid: "100 cm", kv: "65–75", resp: "Suspend" } }
    ]
  },
  scapula: {
    name: "Scapula",
    icon: "🦴",
    positions: [
      { name: "AP Projection (Erect)", key: "Scapula_AP_Projection_Erect", type: "routine",
        info: { desc: "Patient erect. Arm abducted 90° to move scapula away from ribs. CR perpendicular.", cr: "Perpendicular to mid-scapula", ir: "24×30 cm LW", sid: "100 cm", kv: "70–80", resp: "Full expiration" } },
      { name: "Lateral – Erect, Acromion/Coracoid (60° LAO)", key: "Scapula_Lateral_Position_Erect_Acromion_Coracoid_Process_60deg_LAO", type: "routine",
        info: { desc: "Patient 45–60° oblique facing IR. CR perpendicular to medial border of scapula.", cr: "Perpendicular to mid-scapula", ir: "24×30 cm LW", sid: "100 cm", kv: "70–80", resp: "Suspend" } },
      { name: "Lateral – Erect, Body of Scapula (45° LAO)", key: "Scapula_Lateral_Position_Erect_Body_of_Scapula_45deg_LAO", type: "routine",
        info: { desc: "Patient 45° oblique. Arm across chest or behind back. Lateral view of scapula body.", cr: "Perpendicular to medial border of scapula", ir: "24×30 cm LW", sid: "100 cm", kv: "70–80", resp: "Suspend" } },
      { name: "Lateral – Recumbent", key: "Scapula_Lateral_Position_Recumbent", type: "routine",
        info: { desc: "Patient lateral recumbent, arm across chest. CR horizontal to medial border.", cr: "Horizontal to medial scapular border", ir: "24×30 cm LW", sid: "100 cm", kv: "70–80", resp: "Suspend" } },
      { name: "Lateral – Recumbent, Alternative Supine", key: "Scapula_Lateral_Position_Recumbent_Alternative_Supine", type: "special",
        info: { desc: "Supine alternative. IR lateral to shoulder. CR horizontal.", cr: "Horizontal through shoulder", ir: "24×30 cm LW", sid: "100 cm", kv: "70–80", resp: "Suspend" } },
      { name: "Lateral – Recumbent, Palpating Borders", key: "Scapula_Lateral_Position_Recumbent_Palpating_Borders", type: "special",
        info: { desc: "Recumbent position demonstrating technique for palpating borders before exposure.", cr: "Perpendicular to medial border", ir: "24×30 cm LW", sid: "100 cm", kv: "70–80", resp: "Suspend" } }
    ]
  },
  ac_joints: {
    name: "AC Joints",
    icon: "🦴",
    positions: [
      { name: "AP Axial – Zanca Method", key: "AC_Joints_AP_Axial_Zanca_Method", type: "routine",
        info: { desc: "Patient erect. CR 10–15° cephalad. Bilateral or unilateral exposure.", cr: "10–15° cephalad to AC joint", ir: "18×24 cm LW", sid: "100 cm", kv: "60–70", resp: "Suspend" } },
      { name: "AP Bilateral – Pearson Method (Stress, with Weights)", key: "AC_Joints_AP_Bilateral_Pearson_Method_Stress_View_with_Weights", type: "routine",
        info: { desc: "Bilateral AP erect, with and without weights. Evaluates AC joint separation.", cr: "Perpendicular to both AC joints", ir: "35×43 cm LW", sid: "183 cm", kv: "65–75", resp: "Suspend" } }
    ]
  },
  humerus: {
    name: "Humerus",
    icon: "🦴",
    positions: [
      { name: "AP Projection (Erect)", key: "Humerus_AP_Projection_Erect", type: "routine",
        info: { desc: "Patient erect. Humerus in anatomic position. IR includes both joints.", cr: "Perpendicular to mid-humerus", ir: "35×43 cm LW", sid: "100 cm", kv: "65–75", resp: "Suspend" } },
      { name: "AP Projection (Supine)", key: "Humerus_AP_Projection_Supine", type: "routine",
        info: { desc: "Patient supine. Humerus in external rotation if possible. Arm extended.", cr: "Perpendicular to mid-humerus", ir: "35×43 cm LW", sid: "100 cm", kv: "65–75", resp: "Suspend" } },
      { name: "Rotational Lateral – Lateromedial (Erect, Back to IR)", key: "Humerus_Rotational_Lateral_Lateromedial_Erect_Back_to_IR", type: "routine",
        info: { desc: "Erect, back to IR. Internal rotation produces lateromedial projection.", cr: "Perpendicular to mid-humerus", ir: "35×43 cm LW", sid: "100 cm", kv: "65–75", resp: "Suspend" } },
      { name: "Rotational Lateral – Mediolateral (Erect, Facing IR)", key: "Humerus_Rotational_Lateral_Mediolateral_Erect_Facing_IR", type: "routine",
        info: { desc: "Erect facing IR. External rotation produces mediolateral lateral view.", cr: "Perpendicular to mid-humerus", ir: "35×43 cm LW", sid: "100 cm", kv: "65–75", resp: "Suspend" } },
      { name: "Rotational Lateral – Supine", key: "Humerus_Rotational_Lateral_Supine", type: "routine",
        info: { desc: "Supine patient. Lateral humerus with arm elevated on support.", cr: "Perpendicular to mid-humerus", ir: "35×43 cm LW", sid: "100 cm", kv: "65–75", resp: "Suspend" } },
      { name: "Transthoracic Lateral – Trauma (Erect and Recumbent)", key: "Humerus_Transthoracic_Lateral_Projection_Trauma_Erect_and_Recumbent", type: "routine",
        info: { desc: "Trauma position. CR horizontal through thorax. Used when arm cannot be moved.", cr: "Horizontal, through thorax", ir: "35×43 cm LW", sid: "100 cm", kv: "80–90", resp: "Full inspiration" } },
      { name: "Trauma Horizontal Beam Lateral – Mid to Distal", key: "Humerus_Trauma_Horizontal_Beam_Lateral_Mid_to_Distal", type: "special",
        info: { desc: "Horizontal beam lateral for mid/distal humerus trauma. Arm stabilized.", cr: "Horizontal through mid-to-distal humerus", ir: "35×43 cm LW", sid: "100 cm", kv: "65–75", resp: "Suspend" } }
    ]
  },
  elbow: {
    name: "Elbow",
    icon: "🦴",
    positions: [
      { name: "AP Projection (Fully Extended)", key: "Elbow_AP_Projection_Fully_Extended", type: "routine",
        info: { desc: "Patient seated, elbow fully extended. Forearm supinated. Demonstrates distal humerus, radial head, and olecranon.", cr: "Perpendicular to elbow joint", ir: "18×24 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } },
      { name: "AP Oblique – Lateral (External Rotation 45°)", key: "Elbow_AP_Oblique_Lateral_External_Rotation", type: "routine",
        info: { desc: "45° external rotation. Demonstrates radial head and capitulum without superimposition.", cr: "Perpendicular to elbow joint", ir: "18×24 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } },
      { name: "AP Oblique – Medial (Internal Rotation 45°)", key: "Elbow_AP_Oblique_Medial_Internal_Rotation", type: "routine",
        info: { desc: "45° internal rotation. Demonstrates coronoid process and trochlea.", cr: "Perpendicular to elbow joint", ir: "18×24 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } },
      { name: "Lateromedial Projection (Flexed 90°)", key: "Elbow_Lateromedial_Projection_Flexed_90deg", type: "routine",
        info: { desc: "Elbow flexed 90°. True lateral demonstrates anterior fat pads.", cr: "Perpendicular to lateral epicondyle", ir: "18×24 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } },
      { name: "AP Alternate Partial Flexion – Forearm Parallel", key: "Elbow_AP_Alternate_Partial_Flexion_Forearm_Parallel", type: "special",
        info: { desc: "When elbow cannot be fully extended. Forearm parallel to IR. CR perpendicular.", cr: "Perpendicular to distal humerus", ir: "18×24 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } },
      { name: "AP Alternate Partial Flexion – Humerus Parallel", key: "Elbow_AP_Alternate_Partial_Flexion_Humerus_Parallel", type: "special",
        info: { desc: "When elbow cannot be fully extended. Humerus parallel to IR.", cr: "Perpendicular to proximal forearm", ir: "18×24 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } },
      { name: "Radial Head – Lateromedial, Hand Supinated (Max External Rotation)", key: "Elbow_Radial_Head_Lateromedial_Hand_Supinated_Maximum_External_Rotation", type: "special",
        info: { desc: "Four views of elbow in lateral position with hand in different rotations to show all radial head surfaces.", cr: "Perpendicular to radial head", ir: "8×10 cm", sid: "100 cm", kv: "60–70", resp: "N/A" } },
      { name: "Acute Flexion – Distal Humerus (CR ⊥ to Humerus)", key: "Elbow_Acute_Flexion_Distal_Humerus_CR_Perpendicular_to_Humerus", type: "special",
        info: { desc: "Maximum flexion with CR perpendicular to humerus. Demonstrates distal humerus through soft tissue.", cr: "Perpendicular to humerus", ir: "18×24 cm LW", sid: "100 cm", kv: "65–75", resp: "N/A" } },
      { name: "Acute Flexion – Proximal Forearm (CR ⊥ to Forearm)", key: "Elbow_Acute_Flexion_Proximal_Forearm_CR_Perpendicular_to_Forearm", type: "special",
        info: { desc: "Maximum flexion with CR perpendicular to forearm. Demonstrates olecranon process.", cr: "Perpendicular to forearm", ir: "18×24 cm LW", sid: "100 cm", kv: "65–75", resp: "N/A" } },
      { name: "Trauma Axial Lateromedial – Coyle Method (Radial Head, Erect)", key: "Elbow_Trauma_Axial_Lateromedial_Coyle_Method_Radial_Head_Erect", type: "special",
        info: { desc: "Elbow 90° flexion, 45° CR toward shoulder. Demonstrates radial head and capitulum.", cr: "45° toward shoulder", ir: "18×24 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } },
      { name: "Trauma Axial Mediolateral – Coyle Method (Coronoid Process, Erect)", key: "Elbow_Trauma_Axial_Mediolateral_Coyle_Method_Coronoid_Process_Erect", type: "special",
        info: { desc: "Elbow 80° flexion, 45° CR toward wrist. Demonstrates coronoid process.", cr: "45° toward wrist", ir: "18×24 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } }
    ]
  },
  forearm: {
    name: "Forearm",
    icon: "🦴",
    positions: [
      { name: "AP Projection", key: "Forearm_AP_Projection", type: "routine",
        info: { desc: "Patient seated. Forearm supinated, both joints included.", cr: "Perpendicular to mid-forearm", ir: "35×43 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } },
      { name: "Lateromedial Projection", key: "Forearm_Lateromedial_Projection", type: "routine",
        info: { desc: "Forearm in true lateral (thumb up). Both joints included.", cr: "Perpendicular to mid-forearm", ir: "35×43 cm LW", sid: "100 cm", kv: "60–70", resp: "N/A" } }
    ]
  },
  wrist: {
    name: "Wrist",
    icon: "🦴",
    positions: [
      { name: "PA Projection", key: "Wrist_PA_Projection", type: "routine",
        info: { desc: "Patient seated. Wrist PA, fingers slightly flexed.", cr: "Perpendicular to midcarpal area", ir: "24×30 cm LW", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "Lateromedial Projection", key: "Wrist_Lateromedial_Projection", type: "routine",
        info: { desc: "True lateral of wrist. Thumb up position.", cr: "Perpendicular to midcarpal area", ir: "24×30 cm LW", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "Lateromedial Projection (with Support)", key: "Wrist_Lateromedial_Projection_with_Support", type: "routine",
        info: { desc: "Lateral wrist with radiolucent support under wrist.", cr: "Perpendicular to midcarpal area", ir: "24×30 cm LW", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "Alternative AP Projection", key: "Wrist_Alternative_AP_Projection", type: "special",
        info: { desc: "AP alternative when PA not possible. Dorsum of wrist on IR.", cr: "Perpendicular to midcarpal area", ir: "24×30 cm LW", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "PA Oblique – Lateral Rotation (with Support)", key: "Wrist_PA_Oblique_Lateral_Rotation_with_Support", type: "routine",
        info: { desc: "Lateral rotation 45° oblique. Demonstrates trapezium and first CMC joint.", cr: "Perpendicular to midcarpal area", ir: "24×30 cm LW", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "PA Oblique – Lateral Rotation (without Support)", key: "Wrist_PA_Oblique_Lateral_Rotation_without_Support", type: "routine",
        info: { desc: "Lateral rotation 45° oblique without support.", cr: "Perpendicular to midcarpal area", ir: "24×30 cm LW", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "PA Radial Deviation", key: "Wrist_PA_Radial_Deviation", type: "special",
        info: { desc: "PA with wrist in radial deviation. Opens ulnar side of wrist.", cr: "Perpendicular to midcarpal area", ir: "24×30 cm LW", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "PA Axial Scaphoid – Ulnar Deviation, 15° CR", key: "Wrist_PA_Axial_Scaphoid_Ulnar_Deviation_15deg_CR", type: "special",
        info: { desc: "Wrist in ulnar deviation, CR 15° proximally. Demonstrates scaphoid without foreshortening.", cr: "15° toward elbow", ir: "18×24 cm", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "PA Scaphoid – Modified Stecher Method (Hand Elevated, Ulnar Deviation)", key: "Wrist_PA_Scaphoid_Modified_Stecher_Method_Hand_Elevated_Ulnar_Deviation", type: "special",
        info: { desc: "Fingers elevated 20° on a wedge, wrist in ulnar deviation. CR perpendicular.", cr: "Perpendicular to scaphoid", ir: "18×24 cm", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "PA Scaphoid – Modified Stecher Method (Severe Pain, No Ulnar Deviation)", key: "Wrist_PA_Scaphoid_Modified_Stecher_Method_Severe_Pain_No_Ulnar_Deviation", type: "special",
        info: { desc: "Alternative Stecher for severe pain cases. No ulnar deviation required.", cr: "CR 20° toward elbow", ir: "18×24 cm", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "Tangential – Carpal Canal (Gaynor-Hart Method)", key: "Wrist_Carpal_Canal_Tangential_Gaynor_Hart_Method", type: "special",
        info: { desc: "Wrist hyperextended. CR 25–30° to long axis. Demonstrates carpal tunnel.", cr: "25–30° from long axis through palm", ir: "18×24 cm", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "Tangential – Carpal Bridge", key: "Wrist_Carpal_Bridge_Tangential_Projection", type: "special",
        info: { desc: "Dorsum of wrist on IR. CR 45° toward elbow. Demonstrates dorsal carpal surfaces.", cr: "45° toward elbow", ir: "18×24 cm", sid: "100 cm", kv: "55–65", resp: "N/A" } }
    ]
  },
  hand: {
    name: "Hand",
    icon: "🦴",
    positions: [
      { name: "PA Projection", key: "Hand_PA_Projection", type: "routine",
        info: { desc: "Dorsum of hand on IR. Fingers slightly spread. All phalanges included.", cr: "Perpendicular to 3rd MCP joint", ir: "24×30 cm LW", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "PA Oblique – Digits Parallel", key: "Hand_PA_Oblique_Projection_Digits_Parallel", type: "routine",
        info: { desc: "Hand 45° oblique lateral rotation. Fingers parallel to IR (use wedge). Demonstrates 3rd–5th metacarpals.", cr: "Perpendicular to 3rd MCP joint", ir: "24×30 cm LW", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "PA Oblique – Digits Not Parallel", key: "Hand_PA_Oblique_Projection_Digits_Not_Parallel", type: "special",
        info: { desc: "Oblique without support. Digits not parallel to IR.", cr: "Perpendicular to 3rd MCP joint", ir: "24×30 cm LW", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "Lateral in Extension (Fan Lateral)", key: "Hand_Fan_Lateral_Lateromedial_Projection", type: "routine",
        info: { desc: "True lateral of hand. Fingers fanned in extension. Used for foreign body localization.", cr: "Perpendicular to 2nd MCP joint", ir: "24×30 cm LW", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "Lateral in Extension", key: "Hand_Lateral_in_Extension", type: "routine",
        info: { desc: "Fingers extended, hand lateral. Demonstrates metacarpals and phalanges in profile.", cr: "Perpendicular to 2nd MCP joint", ir: "24×30 cm LW", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "Lateral in Flexion", key: "Hand_Lateral_in_Flexion", type: "special",
        info: { desc: "Fingers flexed into ball position. Useful for ball/fist injuries.", cr: "Perpendicular to MCP joints", ir: "24×30 cm LW", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "AP Axial – Brewerton Method", key: "Hand_AP_Axial_Brewerton_Method", type: "special",
        info: { desc: "Dorsum of fingers on IR, MCPs flexed 65°. CR 15° ulnarly. Demonstrates MCP joints.", cr: "15° from ulnar side", ir: "18×24 cm LW", sid: "100 cm", kv: "50–60", resp: "N/A" } }
    ]
  },
  fingers: {
    name: "Fingers",
    icon: "🦴",
    positions: [
      { name: "PA Projection", key: "Fingers_PA_Projection", type: "routine",
        info: { desc: "Digit PA on IR. Demonstrates entire digit from distal phalanx to MCP.", cr: "Perpendicular to PIP joint", ir: "18×24 cm", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "PA Oblique Projection", key: "Fingers_PA_Oblique_Projection", type: "routine",
        info: { desc: "45° lateral rotation oblique. Demonstrates interphalangeal joints.", cr: "Perpendicular to PIP joint", ir: "18×24 cm", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "Lateromedial Projection", key: "Fingers_Lateromedial_Projection", type: "routine",
        info: { desc: "True lateral of finger. Demonstrates phalanges and joint spaces.", cr: "Perpendicular to PIP joint", ir: "18×24 cm", sid: "100 cm", kv: "50–60", resp: "N/A" } }
    ]
  },
  thumb: {
    name: "Thumb",
    icon: "🦴",
    positions: [
      { name: "AP Projection", key: "Thumb_AP_Projection", type: "routine",
        info: { desc: "Hand pronated, thumb PA (AP exception). Demonstrates entire thumb.", cr: "Perpendicular to 1st MCP joint", ir: "18×24 cm", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "Lateral Position", key: "Thumb_Lateral_Position", type: "routine",
        info: { desc: "True lateral of thumb. Demonstrates phalanges and 1st MCP in profile.", cr: "Perpendicular to 1st MCP joint", ir: "18×24 cm", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "PA Oblique Projection – Medial Rotation", key: "Thumb_PA_Oblique_Projection_Medial_Rotation", type: "routine",
        info: { desc: "Thumb 45° medial rotation oblique. Demonstrates 1st CMC joint.", cr: "Perpendicular to 1st CMC joint", ir: "18×24 cm", sid: "100 cm", kv: "50–60", resp: "N/A" } },
      { name: "AP Axial – Modified Robert Method", key: "Thumb_AP_Axial_Modified_Robert_Method", type: "special",
        info: { desc: "Both hands together, IR between thumbs. CR perpendicular. Bilateral 1st CMC joint views.", cr: "Perpendicular to 1st CMC joint", ir: "18×24 cm", sid: "100 cm", kv: "55–65", resp: "N/A" } },
      { name: "PA Stress – Folio Method", key: "Thumb_PA_Stress_Folio_Method", type: "special",
        info: { desc: "Stress applied to 1st MCP joint. Evaluates ulnar collateral ligament (gamekeeper's thumb).", cr: "Perpendicular to 1st MCP joint", ir: "18×24 cm", sid: "100 cm", kv: "50–60", resp: "N/A" } }
    ]
  }
};

// ─── QUIZ DATA STRUCTURE ───
const QUIZ = {};

// ─── STATISTICS HELPER ───
function getStatistics() {
  let totalPositions = 0;
  let totalChapters = 0;

  for (let chKey in BOOK) {
    const ch = BOOK[chKey];
    totalChapters++;
    if (ch.positions) {
      totalPositions += ch.positions.length;
    }
    if (ch.subchapters) {
      for (let schKey in ch.subchapters) {
        totalPositions += (ch.subchapters[schKey].positions || []).length;
      }
    }
  }

  return { chapters: totalChapters, positions: totalPositions };
}