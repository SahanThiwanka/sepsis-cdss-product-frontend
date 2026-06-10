export default function BackupPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-700">
            Data Protection
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            PostgreSQL Backup and Restore Guide
          </h1>
          <p className="mt-2 text-slate-600">
            This page documents how system data can be backed up and restored
            during development or demonstration.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Why Backup Matters</h2>
            <p className="mt-3 leading-7 text-slate-700">
              The CDSS stores patient records, observations, prediction results,
              alerts, resolved alert history, users, and audit logs in
              PostgreSQL. Backup is important to prevent loss of clinical
              workflow evidence and system activity records.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Create Database Backup</h2>
            <p className="mt-3 text-slate-700">
              Run this command from the main project folder:
            </p>

            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
{`docker compose exec postgres pg_dump -U sepsis_user sepsis_cdss > sepsis_cdss_backup.sql`}
            </pre>

            <p className="mt-3 text-sm text-slate-600">
              This creates a backup file named{" "}
              <span className="font-semibold">sepsis_cdss_backup.sql</span>.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Restore Database Backup</h2>
            <p className="mt-3 text-slate-700">
              To restore a backup during development, run:
            </p>

            <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100">
{`docker compose exec -T postgres psql -U sepsis_user -d sepsis_cdss < sepsis_cdss_backup.sql`}
            </pre>

            <p className="mt-3 text-sm text-slate-600">
              Restore should be done carefully because it can overwrite existing
              data depending on the backup contents.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Recommended Backup Policy</h2>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
              <li>Take a backup before changing database structure.</li>
              <li>Take a backup before demonstration or supervisor review.</li>
              <li>Store backup files separately from the application folder.</li>
              <li>Do not commit patient data backups to GitHub.</li>
              <li>Protect backup files because they may contain sensitive data.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-xl font-semibold text-amber-900">
              Important Note
            </h2>
            <p className="mt-3 leading-7 text-amber-900">
              This backup guide is for development and demonstration. In a real
              hospital environment, backup handling must follow hospital data
              governance, encryption, access control, and privacy requirements.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}