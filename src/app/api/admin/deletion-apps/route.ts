import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeletionApp from "@/models/DeletionApp";
import AuditLog from "@/models/AuditLog";
import { requireAdmin, verifySameOrigin } from "@/lib/deletion/admin-auth";
import { parseAuthType, parseDeletionMode, parseHeadersTemplate, validateHttpsUrl } from "@/lib/deletion/validation";

export async function GET() {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;

  await dbConnect();
  const apps = await DeletionApp.find({}).sort({ updatedAt: -1 }).lean();
  return NextResponse.json({ success: true, apps });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;

  if (!verifySameOrigin(req)) {
    return NextResponse.json({ success: false, message: "Invalid origin" }, { status: 403 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const app = await DeletionApp.create({
      appId: String(body.appId || "").trim(),
      appName: String(body.appName || "").trim(),
      logoUrl: String(body.logoUrl || "").trim(),
      backendBaseUrl: validateHttpsUrl(String(body.backendBaseUrl || "")),
      deletionMode: parseDeletionMode(body.deletionMode),
      deleteEndpoint: String(body.deleteEndpoint || "").trim(),
      authType: parseAuthType(body.authType),
      headersTemplate: parseHeadersTemplate(body.headersTemplate),
      privacySlug: String(body.privacySlug || "").trim() || undefined,
      isActive: Boolean(body.isActive ?? true),
    });

    await AuditLog.create({
      actorEmail: admin.session?.user?.email || "unknown",
      action: "create",
      entityType: "DeletionApp",
      entityId: app.appId,
      details: `Created deletion app ${app.appName}`,
    });

    return NextResponse.json({ success: true, app });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to create app" }, { status: 400 });
  }
}
