"use client";

import { useState } from "react";
import {
  getActiveAlerts,
  getPatientPredictionHistory,
  predictSepsisRisk,
} from "@/lib/api";
import {
  AlertItem,
  PredictionHistoryItem,
  PredictionResponse,
} from "@/types/prediction";

type FormState = {
  patient_id: string;
  HR: string;
  O2Sat: string;
  Temp: string;
  SBP: string;
  MAP: string;
  DBP: string;
  Resp: string;
  FiO2: string;
  pH: string;
  PaCO2: string;
  SaO2: string;
  BUN: string;
  Creatinine: string;
  Glucose: string;
  Lactate: string;
  WBC: string;
  Platelets: string;
  Age: string;
  Gender: string;
  Unit1: string;
  Unit2: string;
  HospAdmTime: string;
  ICULOS: string;
};

const initialForm: FormState = {
  patient_id: "P001",
  HR: "110",
  O2Sat: "94",
  Temp: "38.5",
  SBP: "95",
  MAP: "65",
  DBP: "55",
  Resp: "24",
  FiO2: "0.21",
  pH: "7.35",
  PaCO2: "40",
  SaO2: "95",
  BUN: "20",
  Creatinine: "1.2",
  Glucose: "130",
  Lactate: "2.5",
  WBC: "13",
  Platelets: "180",
  Age: "65",
  Gender: "1",
  Unit1: "1",
  Unit2: "0",
  HospAdmTime: "-10",
  ICULOS: "12",
};

function toPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function getRiskBadgeClass(riskLevel: string) {
  if (riskLevel === "high") {
    return "bg-red-100 text-red-700 border-red-200";
  }

  if (riskLevel === "moderate") {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  return "bg-green-100 text-green-700 border-green-200";
}

export default function Home() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handlePredict() {
    setLoading(true);
    setErrorMessage("");
    setResult(null);

    try {
      const observation: Record<string, number> = {};

      Object.entries(form).forEach(([key, value]) => {
        if (key === "patient_id") return;

        const numericValue = Number(value);

        if (!Number.isNaN(numericValue) && value !== "") {
          observation[key] = numericValue;
        }
      });

      const prediction = await predictSepsisRisk({
        patient_id: form.patient_id,
        observation,
      });

      setResult(prediction);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Prediction failed."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadHistory() {
  setHistoryLoading(true);
  setErrorMessage("");

  try {
    const items = await getPatientPredictionHistory(form.patient_id);
    setHistory(items);
  } catch (error) {
    setErrorMessage(
      error instanceof Error ? error.message : "Failed to load history."
    );
  } finally {
    setHistoryLoading(false);
  }
}

async function handleLoadAlerts() {
  setAlertsLoading(true);
  setErrorMessage("");

  try {
    const items = await getActiveAlerts();
    setAlerts(items);
  } catch (error) {
    setErrorMessage(
      error instanceof Error ? error.message : "Failed to load alerts."
    );
  } finally {
    setAlertsLoading(false);
  }
}

  const inputFields: { key: keyof FormState; label: string }[] = [
    { key: "HR", label: "Heart Rate" },
    { key: "O2Sat", label: "O2 Saturation" },
    { key: "Temp", label: "Temperature" },
    { key: "SBP", label: "Systolic BP" },
    { key: "MAP", label: "MAP" },
    { key: "DBP", label: "Diastolic BP" },
    { key: "Resp", label: "Respiratory Rate" },
    { key: "FiO2", label: "FiO2" },
    { key: "pH", label: "pH" },
    { key: "PaCO2", label: "PaCO2" },
    { key: "SaO2", label: "SaO2" },
    { key: "BUN", label: "BUN" },
    { key: "Creatinine", label: "Creatinine" },
    { key: "Glucose", label: "Glucose" },
    { key: "Lactate", label: "Lactate" },
    { key: "WBC", label: "WBC" },
    { key: "Platelets", label: "Platelets" },
    { key: "Age", label: "Age" },
    { key: "Gender", label: "Gender" },
    { key: "Unit1", label: "Unit1" },
    { key: "Unit2", label: "Unit2" },
    { key: "HospAdmTime", label: "HospAdmTime" },
    { key: "ICULOS", label: "ICULOS" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            Sepsis CDSS Prototype
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Early Sepsis Risk Prediction
          </h1>
          <p className="mt-2 text-slate-600">
            A clinical decision support prototype using calibrated LightGBM,
            SIRS rules, and SHAP explanations.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Patient Observation</h2>

            <div className="mt-5">
              <label className="text-sm font-medium">Patient ID</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={form.patient_id}
                onChange={(event) =>
                  updateField("patient_id", event.target.value)
                }
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              {inputFields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium">{field.label}</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    value={form[field.key]}
                    onChange={(event) =>
                      updateField(field.key, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Predicting..." : "Run Prediction"}
            </button>
            <div className="mt-3 grid grid-cols-2 gap-3">

            <button
              onClick={handleLoadHistory}
              disabled={historyLoading}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {historyLoading ? "Loading..." : "Load Patient History"}
            </button>

            <button
              onClick={handleLoadAlerts}
              disabled={alertsLoading}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {alertsLoading ? "Loading..." : "Load Active Alerts"}
            </button>
          </div>

            {errorMessage && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}
          </section>

          <section className="space-y-6">
            {!result && (
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Prediction Result</h2>
                <p className="mt-3 text-slate-600">
                  Run a prediction to see calibrated risk, alert decision,
                  clinical rule status, and explanation.
                </p>
              </div>
            )}

            {result && (
              <>
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Prediction Result</h2>
                    <span
                      className={`rounded-full border px-3 py-1 text-sm font-semibold ${getRiskBadgeClass(
                        result.risk_level
                      )}`}
                    >
                      {result.risk_level.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">
                        Calibrated Probability
                      </p>
                      <p className="mt-1 text-2xl font-bold">
                        {toPercent(result.calibrated_probability)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Alert Threshold</p>
                      <p className="mt-1 text-2xl font-bold">
                        {toPercent(result.threshold)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">AI Alert</p>
                      <p className="mt-1 text-2xl font-bold">
                        {result.alert ? "Yes" : "No"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">Raw Probability</p>
                      <p className="mt-1 text-2xl font-bold">
                        {toPercent(result.raw_probability)}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-2xl p-6 shadow-sm ${
                    result.decision_support.final_alert
                      ? "bg-red-50"
                      : "bg-green-50"
                  }`}
                >
                  <p className="text-sm font-semibold uppercase tracking-wide">
                    Decision Support
                  </p>
                  <h3 className="mt-2 text-xl font-bold">
                    {result.decision_support.recommendation}
                  </h3>
                  <p className="mt-2 text-sm">
                    Priority:{" "}
                    <span className="font-semibold">
                      {result.decision_support.priority}
                    </span>
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                    {result.decision_support.rationale.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">SIRS Clinical Rule</h3>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">SIRS Score</p>
                      <p className="mt-1 text-2xl font-bold">
                        {result.clinical_rules.sirs_score}
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm text-slate-500">SIRS Positive</p>
                      <p className="mt-1 text-2xl font-bold">
                        {result.clinical_rules.sirs_positive ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Top Risk Factors</h3>
                  <div className="mt-4 space-y-3">
                    {result.top_risk_factors.map((factor) => (
                      <div
                        key={factor.feature}
                        className="rounded-xl border border-red-100 bg-red-50 p-3"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            {factor.feature}
                          </span>
                          <span>{factor.feature_value}</span>
                        </div>
                        <p className="mt-1 text-sm text-red-700">
                          Contribution: {factor.contribution.toFixed(4)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">
                    Top Protective Factors
                  </h3>
                  <div className="mt-4 space-y-3">
                    {result.top_protective_factors.map((factor) => (
                      <div
                        key={factor.feature}
                        className="rounded-xl border border-green-100 bg-green-50 p-3"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">
                            {factor.feature}
                          </span>
                          <span>{factor.feature_value}</span>
                        </div>
                        <p className="mt-1 text-sm text-green-700">
                          Contribution: {factor.contribution.toFixed(4)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Missing Features</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {result.missing_features_count} missing features were filled
                    using training defaults.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.missing_features.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {history.length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Patient Prediction History</h3>

                  <div className="mt-4 space-y-3">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Prediction #{item.id}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              item.final_alert
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {item.final_alert ? "Alert" : "No Alert"}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                          <p>
                            Calibrated risk:{" "}
                            <span className="font-semibold">
                              {(item.calibrated_probability * 100).toFixed(2)}%
                            </span>
                          </p>
                          <p>
                            SIRS score:{" "}
                            <span className="font-semibold">{item.sirs_score}</span>
                          </p>
                          <p>
                            Priority:{" "}
                            <span className="font-semibold">{item.priority}</span>
                          </p>
                          <p>
                            Risk level:{" "}
                            <span className="font-semibold">{item.risk_level}</span>
                          </p>
                        </div>

                        <p className="mt-3 text-sm text-slate-700">
                          {item.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {alerts.length > 0 && (
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold">Active Alerts</h3>

                  <div className="mt-4 space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="rounded-xl border border-red-100 bg-red-50 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">Alert #{alert.id}</p>
                          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                            {alert.priority}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-red-800">{alert.message}</p>

                        <p className="mt-2 text-xs text-slate-500">
                          Created: {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}