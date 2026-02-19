// src/lib/gateway.ts
// Helper to call OpenClaw gateway API

const GATEWAY_PORT = 18789;
const GATEWAY_TOKEN = 'f1fa263f746003d4667660b5c88920a329771b5eddb62ba1';
const GATEWAY_BASE = `http://127.0.0.1:${GATEWAY_PORT}`;

export async function gatewayFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = `${GATEWAY_BASE}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
}

export async function gatewayJSON<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await gatewayFetch(path, options);
  if (!res.ok) {
    throw new Error(`Gateway ${res.status}: ${await res.text().catch(() => res.statusText)}`);
  }
  return res.json();
}

export { GATEWAY_PORT, GATEWAY_BASE };
