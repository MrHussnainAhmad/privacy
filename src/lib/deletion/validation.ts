export function parseHeadersTemplate(input: unknown): Record<string, string> {
  if (!input || typeof input !== "object") return {};
  const record = input as Record<string, unknown>;
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string" && key.trim()) {
      out[key.trim()] = value;
    }
  }
  return out;
}

export function validateHttpsUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:") {
    throw new Error("Only HTTPS backends are allowed");
  }
  return url.toString().replace(/\/$/, "");
}

export function validateDeletionPayload(body: Record<string, unknown>) {
  const appId = typeof body.appId === "string" ? body.appId.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const honeypot = typeof body.website === "string" ? body.website.trim() : "";

  if (!appId) throw new Error("appId is required");
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Valid email is required");
  if (honeypot) throw new Error("Invalid request");

  return { appId, email };
}

export function parseDeletionMode(input: unknown): DeletionMode {
  if (typeof input === "string" && DELETION_MODES.includes(input as DeletionMode)) {
    return input as DeletionMode;
  }
  throw new Error("Invalid deletionMode");
}

export function parseAuthType(input: unknown): AuthType {
  if (typeof input === "string" && AUTH_TYPES.includes(input as AuthType)) {
    return input as AuthType;
  }
  throw new Error("Invalid authType");
}
import type { AuthType, DeletionMode } from "@/models/DeletionApp";

const DELETION_MODES: DeletionMode[] = ["direct_api", "verification_then_api"];
const AUTH_TYPES: AuthType[] = ["bearer_jwt", "api_key", "service_token"];
