import { createHash, randomBytes } from "crypto";

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createVerificationToken() {
  return randomBytes(32).toString("hex");
}

export function createRequestId() {
  return `del_${randomBytes(8).toString("hex")}`;
}

export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const head = local.slice(0, 2);
  const tail = local.length > 2 ? "*".repeat(Math.max(local.length - 2, 2)) : "**";
  return `${head}${tail}@${domain}`;
}
