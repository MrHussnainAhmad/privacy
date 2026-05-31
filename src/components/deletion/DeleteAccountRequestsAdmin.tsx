"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type DeletionApp = {
  _id?: string;
  appId: string;
  appName: string;
  logoUrl: string;
  backendBaseUrl: string;
  deletionMode: "direct_api" | "verification_then_api";
  deleteEndpoint: string;
  authType: "bearer_jwt" | "api_key" | "service_token";
  headersTemplate?: Record<string, string>;
  privacySlug?: string;
  isActive: boolean;
};

type DeletionRequestLog = {
  _id?: string;
  requestId: string;
  appId: string;
  emailMasked: string;
  status: string;
  createdAt: string;
  error?: string;
};

type AdminAuditLog = {
  _id?: string;
  createdAt: string;
  actorEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
};

const EMPTY_FORM: DeletionApp = {
  appId: "",
  appName: "",
  logoUrl: "",
  backendBaseUrl: "https://",
  deletionMode: "verification_then_api",
  deleteEndpoint: "/api/auth/account",
  authType: "service_token",
  headersTemplate: {},
  privacySlug: "",
  isActive: true,
};

function Label({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-2">
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export default function DeleteAccountRequestsPage() {
  const [apps, setApps] = useState<DeletionApp[]>([]);
  const [requests, setRequests] = useState<DeletionRequestLog[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DeletionApp>(EMPTY_FORM);
  const [headersJson, setHeadersJson] = useState("{}\n");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  async function loadAll() {
    const [appsRes, reqRes, logRes] = await Promise.all([
      fetch("/api/admin/deletion-apps"),
      fetch("/api/admin/deletion-requests"),
      fetch("/api/admin/audit-logs"),
    ]);
    const [appsData, reqData, logData] = await Promise.all([appsRes.json(), reqRes.json(), logRes.json()]);
    setApps(appsData.apps || []);
    setRequests(reqData.requests || []);
    setLogs(logData.logs || []);
  }

  useEffect(() => {
    void Promise.resolve().then(() => loadAll());
  }, []);

  const modeTag = useMemo(() => {
    return form.deletionMode === "verification_then_api"
      ? "Recommended for compliance"
      : "Immediate API deletion";
  }, [form.deletionMode]);

  async function uploadLogo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    setUploadingLogo(true);
    const res = await fetch("/api/admin/deletion-apps/upload-logo", {
      method: "POST",
      body: data,
    });
    const payload = await res.json();
    setUploadingLogo(false);

    if (!payload.success) {
      alert(payload.message || "Logo upload failed");
      return;
    }

    setForm((prev) => ({ ...prev, logoUrl: payload.logoUrl }));
  }

  async function saveApp() {
    if (!form.logoUrl) {
      alert("Please upload a logo image first.");
      return;
    }

    let parsedHeaders: Record<string, string> = {};
    try {
      const raw = JSON.parse(headersJson || "{}");
      if (raw && typeof raw === "object") {
        parsedHeaders = raw as Record<string, string>;
      }
    } catch {
      alert("Headers JSON is invalid. Example: {\"x-source\":\"appsbyhussnain\"}");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/deletion-apps/${editingId}` : "/api/admin/deletion-apps";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, headersTemplate: parsedHeaders }),
    });

    const data = await res.json();
    if (!data.success) {
      alert(data.message || "Failed to save app");
      return;
    }

    setEditingId(null);
    setForm(EMPTY_FORM);
    setHeadersJson("{}\n");
    await loadAll();
  }

  async function deleteApp(id?: string) {
    if (!id) return;
    if (!confirm("Delete this app configuration?")) return;
    const res = await fetch(`/api/admin/deletion-apps/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data.message || "Failed to delete app");
      return;
    }
    await loadAll();
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Delete Account Requests</h1>
          <p className="mt-2 text-slate-600">Register each app once, then user deletion requests are verified and sent to that app backend automatically.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">No password collection</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Token verification</span>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">Audit logs enabled</span>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">App Registry</h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{modeTag}</span>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <Label title="App ID" hint="Unique stable key. Example: wedeen, fitmate, com.company.app." />
              <input className="w-full rounded-xl border border-slate-300 p-3" placeholder="wedeen" value={form.appId} onChange={(e) => setForm({ ...form, appId: e.target.value })} />
            </div>
            <div>
              <Label title="App Name" hint="Display name users will select on /request-data-deletion." />
              <input className="w-full rounded-xl border border-slate-300 p-3" placeholder="Wedeen" value={form.appName} onChange={(e) => setForm({ ...form, appName: e.target.value })} />
            </div>
            <div>
              <Label title="Logo Image" hint="Upload image file (PNG/JPG/SVG/WebP). Stored on Cloudinary automatically." />
              <input type="file" accept="image/*" onChange={uploadLogo} className="w-full rounded-xl border border-slate-300 p-3" />
              <p className="mt-2 text-xs text-slate-500">Max size: 5MB</p>
              {uploadingLogo && <p className="mt-2 text-sm text-blue-700">Uploading logo...</p>}
              {form.logoUrl && (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.logoUrl} alt="Uploaded logo preview" className="h-14 w-14 rounded object-cover" />
                  <p className="mt-2 break-all text-xs text-slate-600">{form.logoUrl}</p>
                </div>
              )}
            </div>
            <div>
              <Label title="Privacy Slug (Optional)" hint="Links to /privacy/[slug]. Example: wedeen." />
              <input className="w-full rounded-xl border border-slate-300 p-3" placeholder="wedeen" value={form.privacySlug} onChange={(e) => setForm({ ...form, privacySlug: e.target.value })} />
            </div>
            <div>
              <Label title="Backend Base URL" hint="Your app backend root URL, HTTPS only." />
              <input className="w-full rounded-xl border border-slate-300 p-3" placeholder="https://api.yourapp.com" value={form.backendBaseUrl} onChange={(e) => setForm({ ...form, backendBaseUrl: e.target.value })} />
            </div>
            <div>
              <Label title="Delete Endpoint" hint="Path on your backend that receives deletion request." />
              <input className="w-full rounded-xl border border-slate-300 p-3" placeholder="/api/auth/account" value={form.deleteEndpoint} onChange={(e) => setForm({ ...form, deleteEndpoint: e.target.value })} />
            </div>
            <div>
              <Label title="Deletion Mode" hint="verification_then_api is safest and recommended." />
              <select className="w-full rounded-xl border border-slate-300 p-3" value={form.deletionMode} onChange={(e) => setForm({ ...form, deletionMode: e.target.value as DeletionApp["deletionMode"] })}>
                <option value="verification_then_api">verification_then_api</option>
                <option value="direct_api">direct_api</option>
              </select>
            </div>
            <div>
              <Label title="Auth Type" hint="How this system authenticates to your app backend." />
              <select className="w-full rounded-xl border border-slate-300 p-3" value={form.authType} onChange={(e) => setForm({ ...form, authType: e.target.value as DeletionApp["authType"] })}>
                <option value="service_token">service_token</option>
                <option value="bearer_jwt">bearer_jwt</option>
                <option value="api_key">api_key</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <Label title="Optional Headers Template (JSON)" hint="Extra static headers sent to app backend. Example below." />
            <textarea
              value={headersJson}
              onChange={(e) => setHeadersJson(e.target.value)}
              className="min-h-28 w-full rounded-xl border border-slate-300 p-3 font-mono text-sm"
              placeholder='{"x-source":"appsbyhussnain","x-app-region":"pk"}'
            />
          </div>

          <label className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Is Active (visible on public request page)
          </label>

          <div className="mt-5 flex gap-3">
            <button onClick={saveApp} className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700">{editingId ? "Update App" : "Create App"}</button>
            {editingId && <button onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setHeadersJson("{}\n"); }} className="rounded-xl border border-slate-300 px-5 py-2.5">Cancel</button>}
          </div>

          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="p-3">App</th><th className="p-3">App ID</th><th className="p-3">Mode</th><th className="p-3">Auth</th><th className="p-3">Active</th><th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app._id || app.appId} className="border-t border-slate-200">
                    <td className="p-3 font-medium">{app.appName}</td>
                    <td className="p-3">{app.appId}</td>
                    <td className="p-3">{app.deletionMode}</td>
                    <td className="p-3">{app.authType}</td>
                    <td className="p-3">{String(app.isActive)}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingId(app._id || null);
                            setForm({ ...app });
                            setHeadersJson(JSON.stringify(app.headersTemplate || {}, null, 2));
                          }}
                          className="rounded-lg border border-slate-300 px-3 py-1.5"
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteApp(app._id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Deletion Request Logs</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50"><tr className="text-left"><th className="p-3">Reference</th><th className="p-3">App</th><th className="p-3">Email</th><th className="p-3">Status</th><th className="p-3">Created</th><th className="p-3">Error</th></tr></thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={String(r._id || r.requestId)} className="border-t border-slate-200">
                    <td className="p-3 font-medium">{r.requestId}</td>
                    <td className="p-3">{r.appId}</td>
                    <td className="p-3">{r.emailMasked}</td>
                    <td className="p-3">{r.status}</td>
                    <td className="p-3">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="p-3 text-red-700">{r.error || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Admin Audit Logs</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50"><tr className="text-left"><th className="p-3">When</th><th className="p-3">Actor</th><th className="p-3">Action</th><th className="p-3">Entity</th><th className="p-3">Details</th></tr></thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={String(l._id || l.createdAt)} className="border-t border-slate-200">
                    <td className="p-3">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="p-3">{l.actorEmail}</td>
                    <td className="p-3">{l.action}</td>
                    <td className="p-3">{l.entityType}: {l.entityId}</td>
                    <td className="p-3">{l.details || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
