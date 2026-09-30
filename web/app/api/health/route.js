import { isHealthResponse } from "../../../lib/health.js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const base = process.env.API_BASE_URL || "http://127.0.0.1:8000";
    const response = await fetch(`${base.replace(/\/$/, "")}/api/v1/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();
    if (!isHealthResponse(data)) throw new Error("Unexpected API response");
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "The API is unavailable or returned an unsupported response." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
