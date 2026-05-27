"use client";

import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
    >
      Logout
    </button>
  );
}
