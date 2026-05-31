import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeletionRequest from "@/models/DeletionRequest";
import { requireAdmin } from "@/lib/deletion/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;

  await dbConnect();
  const requests = await DeletionRequest.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ success: true, requests });
}
