import { Metadata } from "next";

type PageProps = {
  searchParams: Promise<{ rid?: string; token?: string }>;
};

export const metadata: Metadata = {
  title: "Deletion Verification",
};

export default async function VerifyDeletionPage({ searchParams }: PageProps) {
  const { rid, token } = await searchParams;

  if (!rid || !token) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-2xl font-bold text-slate-900">Deletion Verification</h1>
          <p className="mt-4 text-slate-700">Invalid verification link.</p>
        </div>
      </div>
    );
  }

  let state = "Could not verify request. Please try again later.";

  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/deletion/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: rid, token }),
      cache: "no-store",
    });
    const data = (await response.json()) as { message?: string; status?: string };
    state = `${data.message || "Verification complete"} (Status: ${data.status || "unknown"})`;
  } catch {
    // keep fallback message
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-slate-900">Deletion Verification</h1>
        <p className="mt-4 text-slate-700">{state}</p>
        <p className="mt-3 text-sm text-slate-500">Reference ID: {rid}</p>
      </div>
    </div>
  );
}
