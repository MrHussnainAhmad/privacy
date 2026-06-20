"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PublicShell from "@/components/site/PublicShell";

type AppItem = { appId: string; appName: string; logoUrl: string; privacySlug?: string };

export default function RequestDataDeletionPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appId, setAppId] = useState("");
  const [email, setEmail] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/deletion/apps")
      .then((res) => res.json())
      .then((data) => setApps(data.apps || []))
      .finally(() => setAppsLoading(false));
  }, []);

  const selectedApp = apps.find((app) => app.appId === appId);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!appId) return;

    setLoading(true);
    setReferenceId("");
    setMessage("");

    const res = await fetch("/api/deletion/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appId, email, website: "" }),
    });

    const data = await res.json();
    setMessage(data.message || "If this account exists, we sent verification instructions.");
    if (data.referenceId) setReferenceId(data.referenceId);
    setLoading(false);
  }

  return (
    <PublicShell>
      <div className="px-4 sm:px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Request Data Deletion</h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Submit a request to delete your account data. We never ask for your password on this site.
            </p>

            <form onSubmit={onSubmit} className="mt-6 sm:mt-8 space-y-5">
              <div>
                <label htmlFor="app-select" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-200">
                  Select App
                </label>
                <select
                  id="app-select"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                  disabled={appsLoading}
                >
                  <option value="" disabled>
                    {appsLoading ? "Loading apps..." : "Choose an app..."}
                  </option>
                  {apps.map((app) => (
                    <option key={app.appId} value={app.appId}>
                      {app.appName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedApp && (
                <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={selectedApp.logoUrl}
                      alt={selectedApp.appName}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded object-cover shrink-0"
                      unoptimized={selectedApp.logoUrl.includes("cloudinary")}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{selectedApp.appName}</div>
                      <Link
                        href={`/privacy/${selectedApp.privacySlug || selectedApp.appId}`}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View privacy policy
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="account-email" className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-200">
                  Account Email
                </label>
                <input
                  id="account-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-3 text-sm sm:text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              <button
                type="submit"
                disabled={loading || !appId || appsLoading}
                className="w-full sm:w-auto rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Submitting..." : "Submit Deletion Request"}
              </button>
            </form>

            {message && (
              <div className="mt-6 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-emerald-900 dark:text-emerald-200">
                <p>{message}</p>
                {referenceId && <p className="mt-2 text-sm font-semibold break-all">Reference ID: {referenceId}</p>}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">How this works</h2>
            <ul className="mt-4 list-disc pl-5 text-sm sm:text-base text-slate-600 dark:text-slate-400 space-y-2">
              <li>We verify the requester using a short-lived link or code (10-30 minutes).</li>
              <li>Your request is sent to the app backend to delete account data.</li>
              <li>Typical completion timeline is up to 7 days depending on app backend workload.</li>
              <li>Some records may be retained for fraud prevention, legal, or security obligations.</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
