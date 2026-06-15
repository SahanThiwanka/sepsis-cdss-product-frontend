import {
  AlertItem,
  AuditLogItem,
  DashboardStats,
  ModelInfo,
  ModelMonitoring,
  PatientItem,
  PatientReport,
  PatientTimelineResponse,
  PredictionHistoryItem,
  PredictionResponse,
  SystemHealth,
} from "@/types/prediction";
import { getAuthHeaders } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

function authHeaders(): Record<string, string> {
  return getAuthHeaders() as Record<string, string>;
}

function jsonAuthHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...authHeaders(),
  };
}

export async function predictSepsisRisk(payload: {
  patient_id: string;
  observation: Record<string, number>;
}): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predictions/predict`, {
    method: "POST",
    headers: jsonAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Prediction request failed: ${errorText}`);
  }

  return response.json();
}

export async function getPatientPredictionHistory(
  patientCode: string
): Promise<PredictionHistoryItem[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/predictions/patient/${encodeURIComponent(patientCode)}`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`History request failed: ${errorText}`);
  }

  return response.json();
}

export async function getActiveAlerts(): Promise<AlertItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/alerts/`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Alerts request failed: ${errorText}`);
  }

  return response.json();
}

export async function resolveAlert(alertId: number): Promise<{
  message: string;
  alert_id: number;
  is_active: boolean;
}> {
  const response = await fetch(`${API_BASE_URL}/api/alerts/${alertId}/resolve`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resolve alert request failed: ${errorText}`);
  }

  return response.json();
}

export async function getModelInfo(): Promise<ModelInfo> {
  const response = await fetch(`${API_BASE_URL}/api/model/info`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model info request failed: ${errorText}`);
  }

  return response.json();
}

export async function getPatients(): Promise<PatientItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/patients/`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Patients request failed: ${errorText}`);
  }

  return response.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dashboard stats request failed: ${errorText}`);
  }

  return response.json();
}

export async function getPatientTimeline(
  patientCode: string
): Promise<PatientTimelineResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/predictions/patient/${encodeURIComponent(
      patientCode
    )}/timeline`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Timeline request failed: ${errorText}`);
  }

  return response.json();
}

export async function getAuditLogs(): Promise<AuditLogItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/audit-logs/`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Audit logs request failed: ${errorText}`);
  }

  return response.json();
}

export async function getPatientReport(
  patientCode: string
): Promise<PatientReport> {
  const response = await fetch(
    `${API_BASE_URL}/api/reports/patient/${encodeURIComponent(patientCode)}`,
    {
      headers: authHeaders(),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Patient report request failed: ${errorText}`);
  }

  return response.json();
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const response = await fetch(`${API_BASE_URL}/api/system-health/`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`System health request failed: ${errorText}`);
  }

  return response.json();
}

export async function getModelMonitoring(): Promise<ModelMonitoring> {
  const response = await fetch(`${API_BASE_URL}/api/monitoring/`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model monitoring request failed: ${errorText}`);
  }

  return response.json();
}