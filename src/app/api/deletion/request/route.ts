import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeletionApp from "@/models/DeletionApp";
import DeletionRequest from "@/models/DeletionRequest";
import { checkRateLimit } from "@/lib/deletion/rate-limit";
import { createRequestId, createVerificationToken, hashToken, maskEmail } from "@/lib/deletion/token";
import { validateDeletionPayload } from "@/lib/deletion/validation";
import { processDeletionRequest } from "@/lib/deletion/orchestrator";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit(`deletion:request:${ip}`, 15 * 60 * 1000, 5);
  if (!limit.ok) {
    return NextResponse.json({ success: true, status: "pending_verification", message: "If this account exists, we sent verification instructions." });
  }

  try {
    const body = await req.json();
    const { appId, email } = validateDeletionPayload(body as Record<string, unknown>);

    await dbConnect();
    const app = await DeletionApp.findOne({ appId, isActive: true }).lean();
    if (!app) {
      return NextResponse.json({ success: true, status: "pending_verification", message: "If this account exists, we sent verification instructions." });
    }

    const requestId = createRequestId();
    const token = createVerificationToken();
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

    const deletionRequest = await DeletionRequest.create({
      requestId,
      appId,
      email,
      emailMasked: maskEmail(email),
      status: app.deletionMode === "direct_api" ? "verified" : "pending_verification",
      verificationTokenHash: app.deletionMode === "direct_api" ? undefined : tokenHash,
      verificationExpiresAt: app.deletionMode === "direct_api" ? undefined : expiresAt,
    });

    if (app.deletionMode === "direct_api") {
      void processDeletionRequest(deletionRequest.requestId);
    } else {
      const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const verifyLink = `${appUrl}/request-data-deletion/verify?rid=${encodeURIComponent(requestId)}&token=${encodeURIComponent(token)}`;
      console.log(`[Deletion Verify Link] ${verifyLink}`);
    }

    return NextResponse.json({
      success: true,
      status: deletionRequest.status,
      referenceId: requestId,
      message: "If this account exists, we sent verification instructions.",
    });
  } catch {
    return NextResponse.json({ success: true, status: "pending_verification", message: "If this account exists, we sent verification instructions." });
  }
}
