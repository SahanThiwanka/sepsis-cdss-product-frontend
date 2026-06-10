export type ExplanationFactor = {
  feature: string;
  feature_value: number;
  contribution: number;
  direction: string;
};

export type ClinicalRules = {
  sirs_score: number;
  sirs_positive: boolean;
  criteria: {
    temperature: boolean;
    heart_rate: boolean;
    respiratory_rate: boolean;
    wbc: boolean;
  };
};

export type DecisionSupport = {
  final_alert: boolean;
  priority: string;
  recommendation: string;
  rationale: string[];
};

export type PredictionResponse = {
  patient_id: string | null;
  model_name: string;
  model_version: string;
  raw_probability: number;
  calibrated_probability: number;
  threshold: number;
  risk_level: string;
  alert: boolean;
  missing_features_count: number;
  missing_features: string[];
  clinical_rules: ClinicalRules;
  decision_support: DecisionSupport;
  top_risk_factors: ExplanationFactor[];
  top_protective_factors: ExplanationFactor[];
};

export type PredictionHistoryItem = {
  id: number;
  patient_code: string;
  model_name: string;
  model_version: string;
  raw_probability: number;
  calibrated_probability: number;
  threshold: number;
  risk_level: string;
  ai_alert: boolean;
  sirs_score: number;
  sirs_positive: boolean;
  final_alert: boolean;
  priority: string;
  recommendation: string;
  top_risk_factors: ExplanationFactor[];
  top_protective_factors: ExplanationFactor[];
  created_at: string;
};

export type AlertItem = {
  id: number;
  patient_id: number;
  patient_code: string;
  prediction_id: number;
  priority: string;
  message: string;
  is_active: boolean;
  created_at: string;
};

export type ModelInfo = {
  model_name: string;
  base_config: string;
  model_version: string;
  calibration: string;
  threshold: number;
  normalized_cinc_utility: number;
  brier_score: number;
  risk_levels: {
    low: {
      min: number;
      max: number;
    };
    moderate: {
      min: number;
      max: number;
    };
    high: {
      min: number;
      max: number;
    };
  };
};

export type PatientItem = {
  id: number;
  patient_code: string;
  age: number | null;
  gender: number | null;
  unit1: number | null;
  unit2: number | null;
  created_at: string;
};

export type DashboardStats = {
  total_patients: number;
  total_predictions: number;
  active_alerts: number;
  high_risk_predictions: number;
  latest_alerts: {
    id: number;
    patient_code: string;
    priority: string;
    message: string;
    created_at: string;
  }[];
};

export type PatientTimelineItem = {
  prediction_id: number;
  observation_id: number | null;
  patient_code: string;
  created_at: string;
  iculos: number | null;
  calibrated_probability: number;
  raw_probability: number;
  risk_level: string;
  ai_alert: boolean;
  final_alert: boolean;
  priority: string;
  sirs_score: number;
  sirs_positive: boolean;
  recommendation: string;
  observation: {
    HR: number | null;
    O2Sat: number | null;
    Temp: number | null;
    SBP: number | null;
    MAP: number | null;
    DBP: number | null;
    Resp: number | null;
    Lactate: number | null;
    WBC: number | null;
    Platelets: number | null;
    Creatinine: number | null;
    ICULOS: number | null;
  };
};

export type PatientTimelineResponse = {
  patient: PatientItem;
  timeline: PatientTimelineItem[];
};

export type AuditLogItem = {
  id: number;
  action: string;
  entity_type: string;
  entity_id: number | null;
  patient_id: number | null;
  actor: string;
  details: Record<string, unknown>;
  created_at: string;
};

export type PatientReport = {
  patient: PatientItem;
  latest_prediction: {
    id: number;
    created_at: string;
    model_name: string;
    model_version: string;
    raw_probability: number;
    calibrated_probability: number;
    threshold: number;
    risk_level: string;
    ai_alert: boolean;
    final_alert: boolean;
    priority: string;
    recommendation: string;
    sirs_score: number;
    sirs_positive: boolean;
    top_risk_factors: ExplanationFactor[];
    top_protective_factors: ExplanationFactor[];
    latest_observation: Record<string, number | null>;
  } | null;
  timeline: {
    prediction_id: number;
    created_at: string;
    iculos: number | null;
    calibrated_probability: number;
    risk_level: string;
    final_alert: boolean;
    sirs_score: number;
    priority: string;
    observation: Record<string, number | null>;
  }[];
  active_alerts: {
    id: number;
    priority: string;
    message: string;
    created_at: string;
    is_active: boolean;
  }[];
  clinical_safety_note: string;
};

export type SystemHealth = {
  overall_status: "healthy" | "unhealthy";
  checked_at: string;
  backend: {
    status: string;
    message: string;
  };
  database: {
    status: string;
    message: string;
    required_tables: string[];
    missing_tables: string[];
  };
  model_artifacts: {
    status: string;
    artifacts_directory: string;
    missing_artifacts: string[];
    files: {
      name: string;
      exists: boolean;
      size_bytes: number;
    }[];
  };
  security: {
    authenticated_user: string;
    role: string;
  };
};