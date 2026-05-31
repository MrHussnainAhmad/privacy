import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeletionRequest from "@/models/DeletionRequest";

export async function GET(_: Request, { params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  await dbConnect();

  const request = await DeletionRequest.findOne({ requestId }).lean();
  if (!request) {
    return NextResponse.json({ success: false, status: "failed", message: "Request not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    status: request.status,
    message: request.status === "completed" ? "Deletion request completed" : "Request received",
    referenceId: request.requestId,
    timestamps: {
      createdAt: request.createdAt,
      verifiedAt: request.verifiedAt,
      completedAt: request.completedAt,
    },
  });
}
