import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4 text-center">
      <div className="rounded-2xl bg-white/50 p-12 backdrop-blur-xl shadow-xl ring-1 ring-gray-900/5">
        <div className="mb-6 flex justify-center text-blue-600">
          <ShieldCheck size={64} />
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          AppsByHussnain
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Privacy Policy Management System
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Admin Login
        </Link>
      </div>
      <footer className="absolute bottom-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} AppsByHussnain.
      </footer>
    </div>
  );
}
