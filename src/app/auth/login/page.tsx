"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn("credentials", {
            redirect: false,
            password,
        });

        if (result?.error) {
            setError("Invalid credentials");
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen text-slate-900">
            <div className="relative overflow-hidden">
                <div className="login-bg" aria-hidden="true">
                    <div className="login-bg-layer"></div>
                    <div className="login-glow"></div>
                    <div className="login-shard" style={{ top: "8%", left: "6%" }}></div>
                    <div className="login-shard secondary" style={{ top: "18%", right: "8%" }}></div>
                    <div className="login-shard tertiary" style={{ bottom: "6%", left: "18%" }}></div>
                    <div className="login-shard secondary" style={{ bottom: "12%", right: "14%" }}></div>
                    <div className="login-noise"></div>
                </div>
                <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
                    <div className="w-full max-w-md rounded-3xl bg-white/65 p-10 shadow-2xl shadow-blue-900/15 ring-1 ring-white/60 backdrop-blur-2xl">
                        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <div className="relative mt-2">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-3 pr-12 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                                <path d="M10.6 10.6a2.5 2.5 0 003.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                                <path d="M6.4 6.4C4.6 7.7 3.2 9.5 2.5 12c1.6 5 5.8 8 9.5 8 1.3 0 2.6-.3 3.9-.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                                <path d="M9.8 5.2C10.5 5.1 11.2 5 12 5c3.7 0 7.9 3 9.5 7-.6 1.8-1.5 3.4-2.8 4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M2.5 12C4.1 7 8.3 4 12 4s7.9 3 9.5 8c-1.6 5-5.8 8-9.5 8s-7.9-3-9.5-8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                                <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition"
                            >
                                Unlock Dashboard
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
