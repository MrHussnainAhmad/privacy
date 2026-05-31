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
  if (!origin) return true;

  const runtimeOrigin = req.nextUrl.origin;
  if (origin === runtimeOrigin) return true;

  const expected = process.env.NEXTAUTH_URL;
  if (!expected) return false;

  try {
    return origin === new URL(expected).origin;
  } catch {
    return origin === expected;
  }
}
