import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/models/User";
import bcrypt from "bcryptjs";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

type LoginAttempt = {
    count: number;
    firstAttemptAt: number;
};

const loginAttempts = new Map<string, LoginAttempt>();

type AuthRequestLike = {
    headers?: Record<string, string> | Headers;
};

function getClientKey(req: AuthRequestLike | undefined, email: string) {
    const rawHeaders = req?.headers;
    const forwardedFor =
        rawHeaders instanceof Headers
            ? rawHeaders.get("x-forwarded-for")
            : rawHeaders?.["x-forwarded-for"] || rawHeaders?.["X-Forwarded-For"];
    const ip = (forwardedFor || "unknown-ip").split(",")[0]?.trim() || "unknown-ip";
    return `${ip}:${email.toLowerCase()}`;
}

function isRateLimited(key: string) {
    const now = Date.now();
    const attempt = loginAttempts.get(key);

    if (!attempt) {
        return false;
    }

    if (now - attempt.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
        loginAttempts.delete(key);
        return false;
    }

    return attempt.count >= RATE_LIMIT_MAX_ATTEMPTS;
}

function recordFailedAttempt(key: string) {
    const now = Date.now();
    const attempt = loginAttempts.get(key);

    if (!attempt || now - attempt.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
        loginAttempts.set(key, { count: 1, firstAttemptAt: now });
        return;
    }

    attempt.count += 1;
    loginAttempts.set(key, attempt);
}

function clearFailedAttempts(key: string) {
    loginAttempts.delete(key);
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const configuredAdminEmail = process.env.ADMIN_EMAIL || "admin@local";
                const normalizedEmail = credentials.email.trim().toLowerCase();
                const key = getClientKey(req, normalizedEmail);

                if (isRateLimited(key)) {
                    throw new Error("Too many attempts. Try again later.");
                }

                if (normalizedEmail !== configuredAdminEmail.toLowerCase()) {
                    recordFailedAttempt(key);
                    throw new Error("Invalid credentials");
                }

                await dbConnect();
                const user = await User.findOne({ email: configuredAdminEmail }) as IUser;
                if (!user) {
                    throw new Error("Admin not seeded");
                }
                const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isValid) {
                    recordFailedAttempt(key);
                    throw new Error("Invalid credentials");
                }

                clearFailedAttempts(key);
                return { id: (user as { _id: { toString(): string } })._id.toString(), email: user.email };
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isAdmin = true;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};
