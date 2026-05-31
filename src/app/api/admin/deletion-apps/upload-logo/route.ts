import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, verifySameOrigin } from "@/lib/deletion/admin-auth";
import { getCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (admin.error) return admin.error;

  if (!verifySameOrigin(req)) {
    return NextResponse.json({ success: false, message: "Invalid origin" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, message: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "Image must be <= 5MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const cloudinary = getCloudinary();
    const uploaded = await cloudinary.uploader.upload(dataUri, {
      folder: "appsbyhussnain/deletion-app-logos",
      resource_type: "image",
      overwrite: false,
    });

    return NextResponse.json({
      success: true,
      logoUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
