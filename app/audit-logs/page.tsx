"use client";

import { useEffect, useState } from "react";
import { getAuditLogs } from "@/lib/api";
import { AuditLogItem } from "@/types/prediction";

function formatAction(action: string) {
  return action.replaceAll("_", " ");
}

function getActionBadgeClass(action: string) {
  if (action.includes("alert")) {
    return "bg-red-100 text-red-700";
  }

  if (action.includes("prediction")) {
    return "bg-blue-100 text-blue-700";
  }

  if (action.includes("patient")) {
    return "bg-green-100 text-green-700";
  }

  return "bg-slate-100 text-slate-700";
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadAuditLogs() {
    setLoading(true);
    setErrorMessage("");

    try {
      const items = await getAuditLogs();
      setLogs(items);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuditLogs();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              System Accountability
            </p>
            <h1 className="mt-2 text-3xl font-bold">Audit Logs</h1>
            <p className="mt-2 text-slate-600">
              Review prediction, alert, and system actions recorded by the CDSS.
            </p>
          </div>

          <button
            onClick={loadAuditLogs}
            disabled={loading}
            className="rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Refreshing..." : "Refresh Logs"}
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-600">Loading audit logs...</p>
          </div>
        )}

        {!loading && logs.length === 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">No audit logs found</h2>
            <p className="mt-2 text-slate-600">
              System actions will appear here after predictions, alerts, or
              other tracked actions occur.
            </p>
          </div>
        )}

        {!loading && logs.length > 0 && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 pr-4 font-semibold">Time</th>
                    <th className="py-3 pr-4 font-semibold">Action</th>
                    <th className="py-3 pr-4 font-semibold">Entity</th>
                    <th className="py-3 pr-4 font-semibold">Actor</th>
                    <th className="py-3 pr-4 font-semibold">Patient</th>
                    <th className="py-3 pr-4 font-semibold">Details</th>
                  </tr>
                </thead>

                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100">
                      <td className="py-3 pr-4 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>

                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getActionBadgeClass(
                            log.action
                          )}`}
                        >
                          {formatAction(log.action)}
                        </span>
                      </td>

                      <td className="py-3 pr-4">
                        <p className="font-medium">{log.entity_type}</p>
                        <p className="text-xs text-slate-500">
                          ID: {log.entity_id ?? "-"}
                        </p>
                      </td>

                      <td className="py-3 pr-4">{log.actor}</td>

                      <td className="py-3 pr-4">
                        {String(log.details?.patient_code ?? log.patient_id ?? "-")}
                      </td>

                      <td className="py-3 pr-4">
                        <pre className="max-w-xl overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
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