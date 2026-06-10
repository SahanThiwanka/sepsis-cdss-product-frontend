"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import { getPatientTimeline } from "@/lib/api";
import {
  PatientTimelineItem,
  PatientTimelineResponse,
} from "@/types/prediction";

function toPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function getAlertBadgeClass(finalAlert: boolean) {
  return finalAlert
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";
}

export default function PatientDetailPage() {
  const params = useParams();
  const patientCode = decodeURIComponent(params.patientCode as string);

  const [timelineData, setTimelineData] =
    useState<PatientTimelineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadTimeline() {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getPatientTimeline(patientCode);
      setTimelineData(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load patient timeline."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (patientCode) {
      loadTimeline();
    }
  }, [patientCode]);

  const timeline = timelineData?.timeline ?? [];
  const latest = timeline.length > 0 ? timeline[timeline.length - 1] : null;

  const chartData = useMemo(() => {
    return timeline.map((item, index) => ({
      index: index + 1,
      timeLabel: item.iculos ? `ICULOS ${item.iculos}` : `#${index + 1}`,
      createdAt: item.created_at,
      riskPercent: Number((item.calibrated_probability * 100).toFixed(2)),
      sirsScore: item.sirs_score,
      HR: item.observation.HR,
      Temp: item.observation.Temp,
      MAP: item.observation.MAP,
      Resp: item.observation.Resp,
      Lactate: item.observation.Lactate,
      WBC: item.observation.WBC,
      finalAlert: item.final_alert,
    }));
  }, [timeline]);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Patient Monitoring
            </p>
            <h1 className="mt-2 text-3xl font-bold">{patientCode}</h1>
            <p className="mt-2 text-slate-600">
              Patient risk trend, SIRS trend, observation history, and alert
              decisions.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadTimeline}
              disabled={loading}
              className="rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <Link
            href={`/patients/${encodeURIComponent(patientCode)}/report`}
            className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800"
            >
            Generate Report
            </Link>

            <Link
              href="/patients"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to Patients
            </Link>
            
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-600">Loading patient timeline...</p>
          </div>
        )}

        {!loading && timeline.length === 0 && !errorMessage && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">No timeline data</h2>
            <p className="mt-2 text-slate-600">
              No predictions or observations are available for this patient yet.
            </p>
          </div>
        )}

        {!loading && latest && timelineData && (
          <>
            <div className="mb-6 grid gap-6 md:grid-cols-5">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Age</p>
                <p className="mt-2 text-2xl font-bold">
                  {timelineData.patient.age ?? "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Latest Risk</p>
                <p className="mt-2 text-2xl font-bold">
                  {toPercent(latest.calibrated_probability)}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Risk Level</p>
                <p className="mt-2 text-2xl font-bold capitalize">
                  {latest.risk_level}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">SIRS Score</p>
                <p className="mt-2 text-2xl font-bold">{latest.sirs_score}</p>
              </div>

              <div
                className={`rounded-2xl p-6 shadow-sm ${
                  latest.final_alert ? "bg-red-50" : "bg-green-50"
                }`}
              >
                <p className="text-sm text-slate-500">Final Alert</p>
                <p className="mt-2 text-2xl font-bold">
                  {latest.final_alert ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div
              className={`mb-6 rounded-2xl p-6 shadow-sm ${
                latest.final_alert ? "bg-red-50" : "bg-green-50"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wide">
                Latest Decision Support
              </p>
              <h2 className="mt-2 text-xl font-bold">
                {latest.recommendation}
              </h2>
              <p className="mt-2 text-sm">
                Priority:{" "}
                <span className="font-semibold capitalize">
                  {latest.priority}
                </span>
              </p>
            </div>

            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">
                  Calibrated Risk Trend
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Risk threshold is 5.00%. Points above the threshold generate AI
                  alerts.
                </p>

                <div className="mt-5 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timeLabel" />
                      <YAxis
                        domain={[0, "dataMax + 5"]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        formatter={(value) => `${value}%`}
                        labelFormatter={(_, payload) => {
                          const row = payload?.[0]?.payload;
                          return row
                            ? `${row.timeLabel} | ${formatDateTime(
                                row.createdAt
                              )}`
                            : "";
                        }}
                      />
                      <ReferenceLine
                        y={5}
                        strokeDasharray="4 4"
                        label="Alert threshold"
                      />
                      <Line
                        type="monotone"
                        dataKey="riskPercent"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        name="Calibrated Risk"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">SIRS Score Trend</h2>
                <p className="mt-1 text-sm text-slate-600">
                  SIRS is positive when the score is 2 or above.
                </p>

                <div className="mt-5 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timeLabel" />
                      <YAxis domain={[0, 4]} allowDecimals={false} />
                      <Tooltip
                        labelFormatter={(_, payload) => {
                          const row = payload?.[0]?.payload;
                          return row
                            ? `${row.timeLabel} | ${formatDateTime(
                                row.createdAt
                              )}`
                            : "";
                        }}
                      />
                      <ReferenceLine
                        y={2}
                        strokeDasharray="4 4"
                        label="SIRS positive"
                      />
                      <Line
                        type="monotone"
                        dataKey="sirsScore"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                        name="SIRS Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Key Vital/Lab Trends</h2>
              <p className="mt-1 text-sm text-slate-600">
                Selected clinical observations used to monitor patient
                deterioration.
              </p>

              <div className="mt-5 grid gap-6 lg:grid-cols-2">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timeLabel" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="HR" strokeWidth={2} />
                      <Line type="monotone" dataKey="Resp" strokeWidth={2} />
                      <Line type="monotone" dataKey="MAP" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timeLabel" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="Temp" strokeWidth={2} />
                      <Line
                        type="monotone"
                        dataKey="Lactate"
                        strokeWidth={2}
                      />
                      <Line type="monotone" dataKey="WBC" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Observation History</h2>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 pr-4 font-semibold">Time</th>
                      <th className="py-3 pr-4 font-semibold">ICULOS</th>
                      <th className="py-3 pr-4 font-semibold">Risk</th>
                      <th className="py-3 pr-4 font-semibold">Alert</th>
                      <th className="py-3 pr-4 font-semibold">SIRS</th>
                      <th className="py-3 pr-4 font-semibold">HR</th>
                      <th className="py-3 pr-4 font-semibold">Temp</th>
                      <th className="py-3 pr-4 font-semibold">MAP</th>
                      <th className="py-3 pr-4 font-semibold">Resp</th>
                      <th className="py-3 pr-4 font-semibold">Lactate</th>
                      <th className="py-3 pr-4 font-semibold">WBC</th>
                    </tr>
                  </thead>

                  <tbody>
                    {timeline
                      .slice()
                      .reverse()
                      .map((item) => (
                        <tr
                          key={item.prediction_id}
                          className="border-b border-slate-100"
                        >
                          <td className="py-3 pr-4">
                            {formatDateTime(item.created_at)}
                          </td>
                          <td className="py-3 pr-4">{item.iculos ?? "-"}</td>
                          <td className="py-3 pr-4 font-semibold">
                            {toPercent(item.calibrated_probability)}
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getAlertBadgeClass(
                                item.final_alert
                              )}`}
                            >
                              {item.final_alert ? "Alert" : "No Alert"}
                            </span>
                          </td>
                          <td className="py-3 pr-4">{item.sirs_score}</td>
                          <td className="py-3 pr-4">
                            {item.observation.HR ?? "-"}
                          </td>
                          <td className="py-3 pr-4">
                            {item.observation.Temp ?? "-"}
                          </td>
                          <td className="py-3 pr-4">
                            {item.observation.MAP ?? "-"}
                          </td>
                          <td className="py-3 pr-4">
                            {item.observation.Resp ?? "-"}
                          </td>
                          <td className="py-3 pr-4">
                            {item.observation.Lactate ?? "-"}
                          </td>
                          <td className="py-3 pr-4">
                            {item.observation.WBC ?? "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}