import { Metadata } from "next";
import PublicShell from "@/components/site/PublicShell";

export const metadata: Metadata = {
  title: "Deletion Verification",
};

type PageProps = {
  searchParams: Promise<{ rid?: string; token?: string }>;
};

export default async function VerifyDeletionPage({ searchParams }: PageProps) {
  const { rid, token } = await searchParams;

  if (!rid || !token) {
    return (
      <PublicShell>
        <div className="px-4 sm:px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Deletion Verification</h1>
            <p className="mt-4 text-slate-700 dark:text-slate-300">Invalid verification link.</p>
          </div>
        </div>
      </PublicShell>
    );
  }

  let state = "Could not verify request. Please try again later.";
  let reason: string | null = null;

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/deletion/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: rid, token }),
      cache: "no-store",
    });
    const data = (await response.json()) as { message?: string; status?: string; reason?: string };
    state = `${data.message || "Verification complete"} (Status: ${data.status || "unknown"})`;
    if (data.status === "failed" && data.reason) {
      reason = data.reason;
    }
  } catch {
    // keep fallback message
  }

  return (
    <PublicShell>
      <div className="px-4 sm:px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Deletion Verification</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">{state}</p>
          {reason && (
            <p className="mt-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-sm text-amber-900 dark:text-amber-200">
              Why it failed: {reason}
            </p>
          )}
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 break-all">Reference ID: {rid}</p>
        </div>
      </div>
    </PublicShell>
  );
}
