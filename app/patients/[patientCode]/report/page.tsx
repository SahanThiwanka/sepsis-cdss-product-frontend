"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPatientReport } from "@/lib/api";
import { PatientReport } from "@/types/prediction";

function toPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

export default function PatientReportPage() {
  const params = useParams();
  const patientCode = decodeURIComponent(params.patientCode as string);

  const [report, setReport] = useState<PatientReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadReport() {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getPatientReport(patientCode);
      setReport(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load report."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, [patientCode]);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900 print:bg-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link
            href={`/patients/${encodeURIComponent(patientCode)}`}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Patient
          </Link>

          <button
            onClick={() => window.print()}
            className="rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Print / Save as PDF
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            Loading report...
          </div>
        )}

        {!loading && report && (
          <div className="rounded-2xl bg-white p-8 shadow-sm print:shadow-none">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-sm font-semibold text-blue-700">
                Sepsis CDSS Patient Report
              </p>
              <h1 className="mt-2 text-3xl font-bold">
                Patient {report.patient.patient_code}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Generated: {new Date().toLocaleString()}
              </p>
            </div>

            <section className="mt-6">
              <h2 className="text-xl font-bold">Patient Information</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-4">
                <p>Age: {report.patient.age ?? "-"}</p>
                <p>Gender: {report.patient.gender ?? "-"}</p>
                <p>Unit1: {report.patient.unit1 ?? "-"}</p>
                <p>Unit2: {report.patient.unit2 ?? "-"}</p>
              </div>
            </section>

            {report.latest_prediction && (
              <>
                <section className="mt-8 rounded-xl bg-slate-50 p-5">
                  <h2 className="text-xl font-bold">Latest Risk Summary</h2>

                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-slate-500">Calibrated Risk</p>
                      <p className="text-2xl font-bold">
                        {toPercent(report.latest_prediction.calibrated_probability)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Threshold</p>
                      <p className="text-2xl font-bold">
                        {toPercent(report.latest_prediction.threshold)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">SIRS Score</p>
                      <p className="text-2xl font-bold">
                        {report.latest_prediction.sirs_score}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Final Alert</p>
                      <p className="text-2xl font-bold">
                        {report.latest_prediction.final_alert ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 font-semibold">
                    Recommendation: {report.latest_prediction.recommendation}
                  </p>
                </section>

                <section className="mt-8">
                  <h2 className="text-xl font-bold">Top Risk Factors</h2>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {report.latest_prediction.top_risk_factors.map((factor) => (
                      <div
                        key={factor.feature}
                        className="rounded-lg border border-red-100 bg-red-50 p-3"
                      >
                        <p className="font-semibold">{factor.feature}</p>
                        <p className="text-sm">
                          Value: {factor.feature_value} | Contribution:{" "}
                          {factor.contribution.toFixed(4)}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-xl font-bold">Latest Observation</h2>
                  <div className="mt-3 grid gap-3 md:grid-cols-4">
                    {Object.entries(
                      report.latest_prediction.latest_observation
                    ).map(([key, value]) => (
                      <div key={key} className="rounded-lg bg-slate-50 p-3">
                        <p className="text-sm text-slate-500">{key}</p>
                        <p className="font-semibold">{String(value ?? "-")}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            <section className="mt-8">
              <h2 className="text-xl font-bold">Risk Timeline</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2 pr-4">ICULOS</th>
                      <th className="py-2 pr-4">Risk</th>
                      <th className="py-2 pr-4">Risk Level</th>
                      <th className="py-2 pr-4">SIRS</th>
                      <th className="py-2 pr-4">Alert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.timeline.map((item) => (
                      <tr
                        key={item.prediction_id}
                        className="border-b border-slate-100"
                      >
                        <td className="py-2 pr-4">
                          {formatDateTime(item.created_at)}
                        </td>
                        <td className="py-2 pr-4">{item.iculos ?? "-"}</td>
                        <td className="py-2 pr-4">
                          {toPercent(item.calibrated_probability)}
                        </td>
                        <td className="py-2 pr-4">{item.risk_level}</td>
                        <td className="py-2 pr-4">{item.sirs_score}</td>
                        <td className="py-2 pr-4">
                          {item.final_alert ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
              <h2 className="text-lg font-bold">Clinical Safety Note</h2>
              <p className="mt-2 text-sm text-slate-700">
                {report.clinical_safety_note}
              </p>
            </section>

            <section className="mt-8 text-sm text-slate-600">
              <p>
                Model: {report.latest_prediction?.model_name ?? "-"} | Version:{" "}
                {report.latest_prediction?.model_version ?? "-"}
              </p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}