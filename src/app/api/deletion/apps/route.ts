import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DeletionApp from "@/models/DeletionApp";

export const revalidate = 60;

export async function GET() {
  await dbConnect();
  const apps = await DeletionApp.find({ isActive: true })
    .select({ appId: 1, appName: 1, logoUrl: 1, privacySlug: 1, _id: 0 })
    .sort({ appName: 1 })
    .lean();

  return NextResponse.json(
    { success: true, apps },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
