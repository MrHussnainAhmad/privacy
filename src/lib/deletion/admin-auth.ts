import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export function verifySameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  const expected = process.env.NEXTAUTH_URL;
  if (!origin || !expected) return true;
  return origin === expected;
}
