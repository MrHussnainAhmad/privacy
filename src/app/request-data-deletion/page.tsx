"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AppItem = { appId: string; appName: string; logoUrl: string; privacySlug?: string };

export default function RequestDataDeletionPage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [appId, setAppId] = useState("");
  const [email, setEmail] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/deletion/apps")
      .then((res) => res.json())
      .then((data) => {
        const list = data.apps || [];
        setApps(list);
        if (list[0]) setAppId(list[0].appId);
      });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setReferenceId("");

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
    <div className="min-h-screen bg-slate-50 px-6 py-14 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold">Request Data Deletion</h1>
          <p className="mt-3 text-slate-600">
            Submit a request to delete your account data. We never ask for your password on this site.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Select App</label>
              <select value={appId} onChange={(e) => setAppId(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3" required>
                {apps.map((app) => (
                  <option key={app.appId} value={app.appId}>{app.appName}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {apps.map((app) => (
                <button type="button" key={app.appId} onClick={() => setAppId(app.appId)} className={`rounded-xl border p-4 text-left ${app.appId === appId ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}`}>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={app.logoUrl} alt={app.appName} className="h-10 w-10 rounded object-cover" />
                    <div>
                      <div className="font-semibold">{app.appName}</div>
                      <Link href={`/privacy/${app.privacySlug || app.appId}`} className="text-xs text-blue-600 hover:underline">Privacy policy</Link>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Account Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 p-3" placeholder="you@example.com" required />
            </div>

            <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

            <button disabled={loading} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Submitting..." : "Submit Deletion Request"}
            </button>
          </form>

          {message && (
            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
              <p>{message}</p>
              {referenceId && <p className="mt-2 text-sm font-semibold">Reference ID: {referenceId}</p>}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold">How this works</h2>
          <ul className="mt-4 list-disc pl-5 text-slate-600 space-y-2">
            <li>We verify the requester using a short-lived link or code (10-30 minutes).</li>
            <li>Your request is sent to the app backend to delete account data.</li>
            <li>Typical completion timeline is up to 7 days depending on app backend workload.</li>
            <li>Some records may be retained for fraud prevention, legal, or security obligations.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
