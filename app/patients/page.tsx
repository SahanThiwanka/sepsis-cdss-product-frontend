"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPatients } from "@/lib/api";
import { PatientItem } from "@/types/prediction";

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadPatients() {
    setLoading(true);
    setErrorMessage("");

    try {
      const items = await getPatients();
      setPatients(items);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load patients."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Patient Management
            </p>
            <h1 className="mt-2 text-3xl font-bold">Patients</h1>
            <p className="mt-2 text-slate-600">
              View registered patients and their prediction history.
            </p>
          </div>

          <button
            onClick={loadPatients}
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
            <p className="text-slate-600">Loading patients...</p>
          </div>
        )}

        {!loading && patients.length === 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">No patients found</h2>
            <p className="mt-2 text-slate-600">
              Run a prediction or create a patient to see records here.
            </p>
          </div>
        )}

        {!loading && patients.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 pr-4 font-semibold">Patient Code</th>
                    <th className="py-3 pr-4 font-semibold">Age</th>
                    <th className="py-3 pr-4 font-semibold">Gender</th>
                    <th className="py-3 pr-4 font-semibold">Unit1</th>
                    <th className="py-3 pr-4 font-semibold">Unit2</th>
                    <th className="py-3 pr-4 font-semibold">Created</th>
                    <th className="py-3 pr-4 font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4 font-semibold">
                        {patient.patient_code}
                      </td>
                      <td className="py-3 pr-4">{patient.age ?? "-"}</td>
                      <td className="py-3 pr-4">{patient.gender ?? "-"}</td>
                      <td className="py-3 pr-4">{patient.unit1 ?? "-"}</td>
                      <td className="py-3 pr-4">{patient.unit2 ?? "-"}</td>
                      <td className="py-3 pr-4">
                        {new Date(patient.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          href={`/patients/${encodeURIComponent(patient.patient_code)}`}
                          className="rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          View Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}