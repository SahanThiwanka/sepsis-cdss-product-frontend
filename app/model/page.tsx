"use client";

import { useEffect, useState } from "react";
import { getModelInfo } from "@/lib/api";
import { ModelInfo } from "@/types/prediction";

function toPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`;
}

export default function ModelInfoPage() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadModelInfo() {
    setLoading(true);
    setErrorMessage("");

    try {
      const info = await getModelInfo();
      setModelInfo(info);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load model info."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModelInfo();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            Model Information
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Deployed CDSS Prediction Model
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            This page summarizes the deployed machine learning model,
            calibration method, decision threshold, and risk-level rules used by
            the sepsis CDSS prototype.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-600">Loading model information...</p>
          </div>
        )}

        {!loading && modelInfo && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">{modelInfo.model_name}</h2>
              <p className="mt-2 text-slate-600">
                Version:{" "}
                <span className="font-semibold text-slate-900">
                  {modelInfo.model_version}
                </span>
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Base Config</p>
                  <p className="mt-1 text-lg font-bold">
                    {modelInfo.base_config}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Calibration</p>
                  <p className="mt-1 text-lg font-bold">
                    {modelInfo.calibration}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Alert Threshold</p>
                  <p className="mt-1 text-lg font-bold">
                    {toPercent(modelInfo.threshold)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Normalized CinC Utility</p>
                  <p className="mt-1 text-lg font-bold">
                    {modelInfo.normalized_cinc_utility.toFixed(4)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Brier Score</p>
                  <p className="mt-1 text-lg font-bold">
                    {modelInfo.brier_score.toFixed(4)}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Clinical Rule Layer</p>
                  <p className="mt-1 text-lg font-bold">SIRS enabled</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Risk Level Rules</h3>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <p className="font-semibold text-green-700">Low Risk</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {toPercent(modelInfo.risk_levels.low.min)} to{" "}
                    {toPercent(modelInfo.risk_levels.low.max)}
                  </p>
                </div>

                <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                  <p className="font-semibold text-yellow-700">
                    Moderate Risk
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {toPercent(modelInfo.risk_levels.moderate.min)} to{" "}
                    {toPercent(modelInfo.risk_levels.moderate.max)}
                  </p>
                </div>

                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="font-semibold text-red-700">High Risk</p>
                  <p className="mt-2 text-sm text-slate-700">
                    {toPercent(modelInfo.risk_levels.high.min)} to{" "}
                    {toPercent(modelInfo.risk_levels.high.max)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Deployment Notes</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>
                  The primary prediction model is a tuned LightGBM classifier
                  trained on combined Hospital A+B data.
                </li>
                <li>
                  Isotonic calibration is applied to make the model probability
                  more reliable.
                </li>
                <li>
                  SHAP explanations are used to show key risk-increasing and
                  risk-reducing features.
                </li>
                <li>
                  SIRS criteria are displayed as a clinical rule layer to support
                  interpretability.
                </li>
                <li>
                  This system is a research prototype and not a replacement for
                  clinician judgment.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}