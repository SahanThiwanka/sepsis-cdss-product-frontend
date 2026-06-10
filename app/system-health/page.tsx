"use client";

import { useEffect, useState } from "react";
import { getSystemHealth } from "@/lib/api";
import { SystemHealth } from "@/types/prediction";

function StatusBadge({ status }: { status: string }) {
  const healthy = status === "healthy";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        healthy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {healthy ? "Healthy" : "Unhealthy"}
    </span>
  );
}

export default function SystemHealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadHealth() {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await getSystemHealth();
      setHealth(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load system health."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              System Readiness
            </p>
            <h1 className="mt-2 text-3xl font-bold">System Health</h1>
            <p className="mt-2 text-slate-600">
              Check backend, database, migrations, model artifacts, and
              authenticated access.
            </p>
          </div>

          <button
            onClick={loadHealth}
            disabled={loading}
            className="rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Checking..." : "Refresh"}
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-600">Checking system health...</p>
          </div>
        )}

        {health && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Overall Status</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Last checked: {new Date(health.checked_at).toLocaleString()}
                  </p>
                </div>

                <StatusBadge status={health.overall_status} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Backend API</h2>
                  <StatusBadge status={health.backend.status} />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {health.backend.message}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Database</h2>
                  <StatusBadge status={health.database.status} />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {health.database.message}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Model Artifacts</h2>
                  <StatusBadge status={health.model_artifacts.status} />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Required deployment files for prediction and calibration.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Database Tables</h2>

              {health.database.missing_tables.length === 0 ? (
                <p className="mt-3 text-sm text-green-700">
                  All required database tables are available.
                </p>
              ) : (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Missing tables: {health.database.missing_tables.join(", ")}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {health.database.required_tables.map((table) => (
                  <span
                    key={table}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      health.database.missing_tables.includes(table)
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {table}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Model Artifact Files</h2>

              {health.model_artifacts.missing_artifacts.length === 0 ? (
                <p className="mt-3 text-sm text-green-700">
                  All required model files are available.
                </p>
              ) : (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Missing files:{" "}
                  {health.model_artifacts.missing_artifacts.join(", ")}
                </div>
              )}

              <div className="mt-5 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-3 pr-4 font-semibold">File</th>
                      <th className="py-3 pr-4 font-semibold">Status</th>
                      <th className="py-3 pr-4 font-semibold">Size</th>
                    </tr>
                  </thead>

                  <tbody>
                    {health.model_artifacts.files.map((file) => (
                      <tr key={file.name} className="border-b border-slate-100">
                        <td className="py-3 pr-4 font-medium">{file.name}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              file.exists
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {file.exists ? "Available" : "Missing"}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {file.exists
                            ? `${(file.size_bytes / 1024).toFixed(1)} KB`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Security Context</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Authenticated User</p>
                  <p className="font-semibold">
                    {health.security.authenticated_user}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="font-semibold capitalize">
                    {health.security.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}