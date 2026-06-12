/**
 * ML Service client — calls the Python FastAPI ml-service on port 8000.
 * Only ML inference calls go here; business logic stays in Next.js API routes.
 */

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export async function callMLService(
  endpoint: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const res = await fetch(`${ML_SERVICE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`ML Service error (${res.status}): ${error}`);
  }

  return res.json();
}

export async function getMLService(
  endpoint: string
): Promise<Record<string, unknown>> {
  const res = await fetch(`${ML_SERVICE_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`ML Service error (${res.status})`);
  }
  return res.json();
}
