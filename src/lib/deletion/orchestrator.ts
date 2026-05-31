import dbConnect from "@/lib/db";
import DeletionApp from "@/models/DeletionApp";
import DeletionRequest from "@/models/DeletionRequest";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildHeaders(app: { authType: string; headersTemplate?: Record<string, string> }) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(app.headersTemplate || {}),
  };

  if (app.authType === "bearer_jwt") {
    const token = process.env.DELETION_BEARER_JWT;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  if (app.authType === "api_key") {
    const apiKey = process.env.DELETION_API_KEY;
    if (apiKey) headers["x-api-key"] = apiKey;
  }

  if (app.authType === "service_token") {
    const token = process.env.DELETION_SERVICE_TOKEN;
    if (token) headers["x-service-token"] = token;
  }

  return headers;
}

export async function processDeletionRequest(requestId: string) {
  await dbConnect();
  const request = await DeletionRequest.findOne({ requestId });
  if (!request) {
    return { success: false, status: "failed", message: "Request not found" };
  }

  if (request.status === "completed") {
    return { success: true, status: request.status, message: "Request already completed" };
  }

  const app = await DeletionApp.findOne({ appId: request.appId, isActive: true }).lean();
  if (!app) {
    request.status = "failed";
    request.error = "App configuration missing or inactive";
    await request.save();
    return { success: false, status: "failed", message: "App unavailable" };
  }

  request.status = "processing";
  await request.save();

  const endpoint = `${String(app.backendBaseUrl).replace(/\/$/, "")}${String(app.deleteEndpoint).startsWith("/") ? app.deleteEndpoint : `/${app.deleteEndpoint}`}`;

  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      request.attemptCount = attempt;
      request.lastAttemptAt = new Date();
      await request.save();

      const response = await fetch(endpoint, {
        method: "POST",
        headers: buildHeaders(app),
        body: JSON.stringify({ email: request.email, requestId: request.requestId }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
      }

      request.status = "completed";
      request.completedAt = new Date();
      request.error = undefined;
      await request.save();

      return { success: true, status: "completed", message: "Deletion completed" };
    } catch (error) {
      if (attempt < maxAttempts) {
        await sleep(attempt * 1500);
      } else {
        request.status = "failed";
        request.error = error instanceof Error ? error.message : "Unknown deletion failure";
        request.completedAt = new Date();
        await request.save();
        return { success: false, status: "failed", message: "Deletion failed" };
      }
    }
  }

  return { success: false, status: "failed", message: "Deletion failed" };
}
