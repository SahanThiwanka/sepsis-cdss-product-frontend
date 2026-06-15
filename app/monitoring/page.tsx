"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getModelMonitoring } from "@/lib/api";
import { ModelMonitoring } from "@/types/prediction";

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

function riskBadgeClass(riskLevel: string) {
  if (riskLevel === "high") {
    return "bg-red-100 text-red-700";
  }

  if (riskLevel === "moderate") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-green-100 text-green-700";
}

export default function MonitoringPage() {
  const [monitoring, setMonitoring] = useState<ModelMonitoring | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadMonitoring() {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getModelMonitoring();
      setMonitoring(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load model monitoring data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMonitoring();
  }, []);

  const riskDistributionData = monitoring
    ? [
        {
          name: "Low",
          value: monitoring.risk_distribution.low,
        },
        {
          name: "Moderate",
          value: monitoring.risk_distribution.moderate,
        },
        {
          name: "High",
          value: monitoring.risk_distribution.high,
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              AI Operations
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Model Monitoring Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Monitor prediction volume, risk distribution, alert rate, and
              recent model outputs.
            </p>
          </div>

          <button
            onClick={loadMonitoring}
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
            <p className="text-slate-600">Loading monitoring data...</p>
          </div>
        )}

        {monitoring && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <MetricCard
                title="Total Predictions"
                value={monitoring.total_predictions.toString()}
                description="All predictions stored in the CDSS database."
              />

              <MetricCard
                title="Average Risk Score"
                value={`${(monitoring.average_risk_score * 100).toFixed(2)}%`}
                description="Mean calibrated sepsis risk score."
              />

              <MetricCard
                title="High-Risk Predictions"
                value={monitoring.high_risk_predictions.toString()}
                description="Predictions classified as high risk."
              />

              <MetricCard
                title="Alert Rate"
                value={`${(monitoring.alert_rate * 100).toFixed(2)}%`}
                description="Alerts created compared with prediction count."
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                  Daily Prediction Volume
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Number of predictions over the last 14 days.
                </p>

                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monitoring.daily_prediction_volume}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Risk Distribution</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Count of low, moderate, and high-risk predictions.
                </p>

                <div className="mt-6 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistributionData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {riskDistributionData.map((entry) => (
                          <Cell key={entry.name} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="rounded-xl bg-green-50 p-3 text-green-700">
                    Low: {monitoring.low_risk_predictions}
                  </div>
                  <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                    Moderate: {monitoring.moderate_risk_predictions}
                  </div>
                  <div className="rounded-xl bg-red-50 p-3 text-red-700">
                    High: {monitoring.high_risk_predictions}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Latest Predictions</h2>
              <p className="mt-1 text-sm text-slate-500">
                Most recent model outputs stored in the system.
              </p>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 pr-4 font-semibold">Patient</th>
                      <th className="py-3 pr-4 font-semibold">Risk Level</th>
                      <th className="py-3 pr-4 font-semibold">
                        Calibrated Risk
                      </th>
                      <th className="py-3 pr-4 font-semibold">Raw Risk</th>
                      <th className="py-3 pr-4 font-semibold">Created At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {monitoring.latest_predictions.map((prediction, index) => (
                      <tr
                        key={`${prediction.patient_code}-${index}`}
                        className="border-b border-slate-100"
                      >
                        <td className="py-3 pr-4 font-semibold">
                          {prediction.patient_code}
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${riskBadgeClass(
                              prediction.risk_level
                            )}`}
                          >
                            {prediction.risk_level}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {(prediction.calibrated_probability * 100).toFixed(2)}
                          %
                        </td>
                        <td className="py-3 pr-4">
                          {(prediction.raw_probability * 100).toFixed(2)}%
                        </td>
                        <td className="py-3 pr-4">
                          {new Date(prediction.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}

                    {monitoring.latest_predictions.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-6 text-center text-slate-500"
                        >
                          No predictions available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <h2 className="text-xl font-semibold text-blue-900">
                Monitoring Interpretation
              </h2>
              <p className="mt-3 leading-7 text-blue-900">
                This page supports operational review of the deployed AI model.
                It does not measure real-world clinical effectiveness by itself.
                For clinical deployment, further monitoring would include model
                drift, calibration over time, subgroup performance, missing data
                patterns, and clinician feedback.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}