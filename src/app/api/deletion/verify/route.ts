import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeletionRequest from "@/models/DeletionRequest";
import { hashToken } from "@/lib/deletion/token";
import { processDeletionRequest } from "@/lib/deletion/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { requestId?: string; token?: string };
    if (!body.requestId || !body.token) {
      return NextResponse.json({ success: false, status: "failed", message: "Invalid verification request" }, { status: 400 });
    }

    await dbConnect();
    const request = await DeletionRequest.findOne({ requestId: body.requestId });
    if (!request) {
      return NextResponse.json({ success: false, status: "failed", message: "Request not found" }, { status: 404 });
    }

    if (request.status !== "pending_verification") {
      return NextResponse.json({ success: true, status: request.status, message: "Request already handled" });
    }

    const tokenHash = hashToken(body.token);
    const validToken = request.verificationTokenHash === tokenHash;
    const notExpired = request.verificationExpiresAt && new Date(request.verificationExpiresAt).getTime() > Date.now();

    if (!validToken || !notExpired) {
      return NextResponse.json({ success: false, status: "failed", message: "Verification link is invalid or expired" }, { status: 400 });
    }

    request.status = "verified";
    request.verifiedAt = new Date();
    request.verificationTokenHash = undefined;
    request.verificationExpiresAt = undefined;
    await request.save();

    const result = await processDeletionRequest(request.requestId);
    if (!result.success) {
      const latest = await DeletionRequest.findOne({ requestId: request.requestId }).lean();
      const failureReason = latest?.error || "Unknown failure";
      return NextResponse.json({
        ...result,
        reason: failureReason,
      });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, status: "failed", message: "Could not verify request" }, { status: 500 });
  }
}
