import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeletionApp from "@/models/DeletionApp";
import DeletionRequest from "@/models/DeletionRequest";
import { createRequestId, createVerificationToken, hashToken, maskEmail } from "@/lib/deletion/token";
import { validateDeletionPayload } from "@/lib/deletion/validation";
import { sendDeletionVerificationEmail } from "@/lib/deletion/email";

export async function POST(req: NextRequest) {
  const traceId = crypto.randomUUID();
  try {
    const body = await req.json();
    const debugRequested = Boolean((body as { debug?: boolean }).debug);
    const { appId, email } = validateDeletionPayload(body as Record<string, unknown>);

    await dbConnect();
    const app = await DeletionApp.findOne({ appId, isActive: true }).lean();
    if (!app) {
      return NextResponse.json({ success: true, status: "pending_verification", message: "If this account exists, we sent verification instructions." });
    }

    const requestId = createRequestId();
    const token = createVerificationToken();
    const tokenHash = hashToken(token);
    const expiresMinutes = 20;
    const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

    const deletionRequest = await DeletionRequest.create({
      requestId,
      appId,
      email,
      emailMasked: maskEmail(email),
      status: "pending_verification",
      verificationTokenHash: tokenHash,
      verificationExpiresAt: expiresAt,
    });

    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const verifyLink = `${appUrl}/request-data-deletion/verify?rid=${encodeURIComponent(requestId)}&token=${encodeURIComponent(token)}`;
    let emailSent = false;
    let emailReason = "unknown";
    let emailMeta: Record<string, unknown> | null = null;

    try {
      const emailResult = await sendDeletionVerificationEmail({
        to: email,
        appId,
        requestId,
        verifyLink,
        expiresMinutes,
      });

      if (!emailResult.sent) {
        emailReason = emailResult.reason || "not_sent";
        emailMeta = {
          smtpHost: (emailResult as { smtpHost?: string }).smtpHost || null,
          from: (emailResult as { from?: string }).from || null,
        };
        console.warn(
          `[Deletion Email] trace=${traceId} requestId=${requestId} EMAIL_SENT=false reason=${emailResult.reason} fallback=${verifyLink}`
        );
      } else {
        emailSent = true;
        emailReason = "sent";
        emailMeta = {
          messageId: (emailResult as { messageId?: string | null }).messageId || null,
          accepted: (emailResult as { accepted?: unknown[] }).accepted || [],
          rejected: (emailResult as { rejected?: unknown[] }).rejected || [],
          response: (emailResult as { response?: string }).response || "",
          smtpHost: (emailResult as { smtpHost?: string }).smtpHost || null,
          from: (emailResult as { from?: string }).from || null,
        };
        console.info(`[Deletion Email] trace=${traceId} requestId=${requestId} EMAIL_SENT=true to=${email}`);
      }
    } catch (emailError) {
      const msg = emailError instanceof Error ? emailError.message : "unknown_error";
      emailReason = msg;
      emailMeta = { error: msg };
      console.error(`[Deletion Email] trace=${traceId} requestId=${requestId} EMAIL_SENT=false reason=${msg}`);
      console.log(`[Deletion Verify Link Fallback] trace=${traceId} requestId=${requestId} link=${verifyLink}`);
    }

    console.info(
      `[Deletion Request] trace=${traceId} requestId=${requestId} appId=${appId} status=${deletionRequest.status} accepted=true`
    );
    return NextResponse.json({
      success: true,
      status: deletionRequest.status,
      referenceId: requestId,
      message: "If this account exists, we sent verification instructions.",
      debug: debugRequested
        ? {
            traceId,
            requestId,
            mode: "verification_then_api",
            emailSent,
            reason: emailReason,
            emailMeta,
            fallbackVerifyLink: emailSent ? null : verifyLink,
          }
        : undefined,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown_error";
    console.error(`[Deletion Request] trace=${traceId} accepted=false reason=${msg}`);
    return NextResponse.json({ success: true, status: "pending_verification", message: "If this account exists, we sent verification instructions." });
  }
}
