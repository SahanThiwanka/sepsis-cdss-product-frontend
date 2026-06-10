"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";
import { DashboardStats } from "@/types/prediction";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboardStats() {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardStats();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Sepsis CDSS Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Clinical Decision Support Overview
            </h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              This prototype uses a tuned isotonic-calibrated LightGBM model,
              SIRS clinical screening, and SHAP explanations to support early
              sepsis risk prediction.
            </p>
          </div>

          <button
            onClick={loadDashboardStats}
            disabled={loading}
            className="rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-600">Loading dashboard...</p>
          </div>
        )}

        {!loading && stats && (
          <>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Total Patients
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  {stats.total_patients}
                </h2>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Total Predictions
                </p>
                <h2 className="mt-2 text-3xl font-bold">
                  {stats.total_predictions}
                </h2>
              </div>

              <div className="rounded-2xl bg-red-50 p-6 shadow-sm">
                <p className="text-sm font-semibold text-red-700">
                  Active Alerts
                </p>
                <h2 className="mt-2 text-3xl font-bold text-red-700">
                  {stats.active_alerts}
                </h2>
              </div>

              <div className="rounded-2xl bg-yellow-50 p-6 shadow-sm">
                <p className="text-sm font-semibold text-yellow-700">
                  High-Risk Predictions
                </p>
                <h2 className="mt-2 text-3xl font-bold text-yellow-700">
                  {stats.high_risk_predictions}
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Primary Model
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  Calibrated LightGBM
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  A+B tuned isotonic-calibrated LightGBM selected as the primary
                  deployment model.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Alert Threshold
                </p>
                <h2 className="mt-2 text-xl font-bold">0.05</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Calibrated probability threshold used to generate AI sepsis
                  alerts.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Clinical Rule Layer
                </p>
                <h2 className="mt-2 text-xl font-bold">SIRS</h2>
                <p className="mt-2 text-sm text-slate-600">
                  SIRS criteria are shown together with the AI prediction for
                  clinical context.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Link
                href="/predict"
                className="rounded-2xl bg-blue-700 p-6 text-white shadow-sm hover:bg-blue-800"
              >
                <h2 className="text-xl font-bold">Run Sepsis Prediction</h2>
                <p className="mt-2 text-blue-100">
                  Enter patient vitals and labs to generate AI risk, SIRS score,
                  alert decision, and SHAP explanation.
                </p>
              </Link>

              <Link
                href="/alerts"
                className="rounded-2xl bg-red-600 p-6 text-white shadow-sm hover:bg-red-700"
              >
                <h2 className="text-xl font-bold">View Active Alerts</h2>
                <p className="mt-2 text-red-100">
                  Review high-risk alerts generated by the prediction engine.
                </p>
              </Link>

              <Link
                href="/patients"
                className="rounded-2xl bg-white p-6 shadow-sm hover:bg-slate-50"
              >
                <h2 className="text-xl font-bold text-slate-900">Patients</h2>
                <p className="mt-2 text-slate-600">
                  View registered patients and prediction history.
                </p>
              </Link>

              <Link
                href="/model"
                className="rounded-2xl bg-white p-6 shadow-sm hover:bg-slate-50"
              >
                <h2 className="text-xl font-bold text-slate-900">
                  Model Info
                </h2>
                <p className="mt-2 text-slate-600">
                  View model version, calibration method, threshold, and
                  evaluation details.
                </p>
              </Link>
            </div>

            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Latest Active Alerts</h2>
                <Link
                  href="/alerts"
                  className="text-sm font-semibold text-blue-700 hover:underline"
                >
                  View all alerts
                </Link>
              </div>

              {stats.latest_alerts.length === 0 ? (
                <p className="mt-4 text-slate-600">
                  No active alerts available.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {stats.latest_alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="rounded-xl border border-red-100 bg-red-50 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-red-700">
                            {alert.patient_code}
                          </p>
                          <p className="mt-1 text-sm text-red-900">
                            {alert.message}
                          </p>
                        </div>

                        <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
                          {alert.priority}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}