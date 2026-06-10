export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            Clinical Safety
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Safety and Responsible Use Statement
          </h1>
          <p className="mt-2 text-slate-600">
            This page explains how the Sepsis CDSS should be used safely and
            responsibly in a clinical decision-support context.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Purpose of the System</h2>
            <p className="mt-3 leading-7 text-slate-700">
              The Sepsis Clinical Decision Support System is designed to support
              early identification of patients who may be at risk of sepsis. It
              uses patient observations, a calibrated machine learning model,
              clinical rule support, and explanation features to assist clinical
              review.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Not a Replacement for Clinicians</h2>
            <p className="mt-3 leading-7 text-slate-700">
              This system does not replace clinical judgement, medical
              diagnosis, or treatment decisions made by qualified healthcare
              professionals. Predictions and alerts should be reviewed together
              with the patient&apos;s full clinical condition, medical history,
              laboratory results, and clinician assessment.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Alert Interpretation</h2>
            <p className="mt-3 leading-7 text-slate-700">
              A high-risk alert indicates that the system has detected patterns
              associated with increased sepsis risk. It should prompt timely
              clinical review, but it should not automatically determine
              diagnosis or treatment. A low-risk result also does not guarantee
              that the patient is safe, because sepsis can develop rapidly and
              data may be incomplete.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Data Quality and Missing Values</h2>
            <p className="mt-3 leading-7 text-slate-700">
              Prediction quality depends on the accuracy and completeness of
              entered patient observations. Missing or incorrect values may
              affect the model output. The system uses default values and
              missing-value indicators where appropriate, but users should enter
              the most accurate clinical data available.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Model Limitations</h2>
            <p className="mt-3 leading-7 text-slate-700">
              The deployed model was trained and evaluated using retrospective
              clinical data. Performance in a real hospital environment may vary
              depending on patient population, data collection practices, and
              clinical workflow. Before real-world use, the system would require
              further validation, clinical governance approval, security review,
              and continuous monitoring.
            </p>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-semibold text-amber-900">
              Important Safety Notice
            </h2>
            <p className="mt-3 leading-7 text-amber-900">
              This implementation is a university research and prototype system.
              It is not approved as a medical device and must not be used as the
              sole basis for real patient diagnosis or treatment.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}