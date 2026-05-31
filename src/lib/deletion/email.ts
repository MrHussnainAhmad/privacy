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
    "Account/Data Deletion Verification",
    "",
    "We received a request to delete your account/data.",
    `App: ${params.appId}`,
    `Reference ID: ${params.requestId}`,
    "",
    `Verify request link: ${params.verifyLink}`,
    "",
    `This link expires in ${params.expiresMinutes} minutes.`,
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="margin:0;padding:24px;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
        <tr>
          <td style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:20px 24px;">
            <p style="margin:0;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#bfdbfe;font-weight:700;">AppsByHussnain</p>
            <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff;">Verify Your Deletion Request</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">
              We received a request to delete account/data for <strong>${params.appId}</strong>.
              Confirm this request to proceed securely.
            </p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
              <tr>
                <td style="padding:14px 16px;">
                  <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#64748b;font-weight:700;">Reference ID</p>
                  <p style="margin:6px 0 0;font-size:14px;color:#0f172a;font-weight:700;">${params.requestId}</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 22px;text-align:center;">
              <a href="${params.verifyLink}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 20px;border-radius:10px;">
                Verify Deletion Request
              </a>
            </p>

            <p style="margin:0 0 8px;font-size:13px;color:#475569;">
              This link expires in <strong>${params.expiresMinutes} minutes</strong>.
            </p>
            <p style="margin:0 0 14px;font-size:13px;color:#475569;">
              If you did not request this, you can safely ignore this email.
            </p>
            <p style="margin:0;font-size:12px;color:#64748b;word-break:break-all;">
              Button not working? Open this link manually:<br/>
              <a href="${params.verifyLink}" style="color:#2563eb;">${params.verifyLink}</a>
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;

  const info = await transporter.sendMail({
    from: config.from,
    to: params.to,
    subject,
    text,
    html,
  });

  return {
    sent: true,
    messageId: info.messageId || null,
    accepted: Array.isArray(info.accepted) ? info.accepted : [],
    rejected: Array.isArray(info.rejected) ? info.rejected : [],
    response: typeof info.response === "string" ? info.response : "",
    smtpHost: config.host,
    from: config.from,
  };
}
