// src/lib/gateway.ts
// Helper to call OpenClaw gateway API via /tools/invoke

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

/**
 * Invoke an OpenClaw tool via POST /tools/invoke
 * This is the primary way to interact with the gateway API.
 * Returns the parsed result from the tool's text content.
 */
export async function toolInvoke<T = any>(tool: string, args: Record<string, any> = {}, sessionKey?: string): Promise<T> {
  const payload: any = { tool, args };
  if (sessionKey) payload.sessionKey = sessionKey;

  const res = await fetch(`${GATEWAY_BASE}/tools/invoke`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Gateway tool ${tool} failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Tool ${tool} error: ${data.error?.message || 'unknown'}`);
  }

  // Tools return { ok: true, result: { content: [{ type: "text", text: "..." }], details: ... } }
  // Prefer details (already parsed), fallback to parsing text content
  if (data.result?.details) {
    return data.result.details as T;
  }

  const textContent = data.result?.content?.find((c: any) => c.type === 'text');
  if (textContent?.text) {
    try {
      return JSON.parse(textContent.text) as T;
    } catch {
      return textContent.text as T;
    }
  }

  return data.result as T;
}

export { GATEWAY_PORT, GATEWAY_BASE };
