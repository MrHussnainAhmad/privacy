import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AuditLog from "@/models/AuditLog";
import { requireAdmin } from "@/lib/deletion/admin-auth";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;

  await dbConnect();
  const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ success: true, logs });
}
