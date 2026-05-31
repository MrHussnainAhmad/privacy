import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeletionApp from "@/models/DeletionApp";
import AuditLog from "@/models/AuditLog";
import { requireAdmin, verifySameOrigin } from "@/lib/deletion/admin-auth";
import { parseAuthType, parseDeletionMode, parseHeadersTemplate, validateHttpsUrl } from "@/lib/deletion/validation";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;
  if (!verifySameOrigin(req)) return NextResponse.json({ success: false, message: "Invalid origin" }, { status: 403 });

  const { id } = await params;

  try {
    const body = (await req.json()) as Record<string, unknown>;
    await dbConnect();

    const updates: Record<string, unknown> = {
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
    };

    const app = await DeletionApp.findByIdAndUpdate(id, updates, { new: true });
    if (!app) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    await AuditLog.create({
      actorEmail: admin.session?.user?.email || "unknown",
      action: "update",
      entityType: "DeletionApp",
      entityId: app.appId,
      details: `Updated deletion app ${app.appName}`,
    });

    return NextResponse.json({ success: true, app });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Failed to update app" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;
  if (!verifySameOrigin(req)) return NextResponse.json({ success: false, message: "Invalid origin" }, { status: 403 });

  const { id } = await params;
  await dbConnect();

  const objectIdPattern = /^[a-fA-F0-9]{24}$/;
  const app = objectIdPattern.test(id)
    ? await DeletionApp.findByIdAndDelete(id)
    : await DeletionApp.findOneAndDelete({ appId: id });
  if (!app) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

  await AuditLog.create({
    actorEmail: admin.session?.user?.email || "unknown",
    action: "delete",
    entityType: "DeletionApp",
    entityId: app.appId,
    details: `Deleted deletion app ${app.appName}`,
  });

  return NextResponse.json({ success: true });
}
