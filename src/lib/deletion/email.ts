import nodemailer from "nodemailer";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;

  if (!host || !user || !pass || !from) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    from,
  };
}

export async function sendDeletionVerificationEmail(params: {
  to: string;
  appId: string;
  requestId: string;
  verifyLink: string;
  expiresMinutes: number;
}) {
  const config = getSmtpConfig();
  if (!config) {
    return { sent: false, reason: "SMTP not configured" };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
  });

  const subject = `Verify your data deletion request (${params.appId})`;
  const text = [
    "We received a request to delete your account/data.",
    "",
    `App: ${params.appId}`,
    `Reference ID: ${params.requestId}`,
    "",
    `Verify request: ${params.verifyLink}`,
    "",
    `This link expires in ${params.expiresMinutes} minutes.`,
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>We received a request to delete your account/data.</p>
    <p><strong>App:</strong> ${params.appId}<br/>
    <strong>Reference ID:</strong> ${params.requestId}</p>
    <p><a href="${params.verifyLink}">Verify deletion request</a></p>
    <p>This link expires in ${params.expiresMinutes} minutes.</p>
    <p>If you did not request this, you can ignore this email.</p>
  `;

  await transporter.sendMail({
    from: config.from,
    to: params.to,
    subject,
    text,
    html,
  });

  return { sent: true };
}
