// src/pages/api/status.ts
// GET: Gateway health/status

import type { APIRoute } from 'astro';
import { gatewayFetch, GATEWAY_PORT } from '../../lib/gateway';
import fs from 'node:fs/promises';

export const GET: APIRoute = async () => {
  try {
    let online = false;
    let version = 'unknown';
    let model = 'unknown';

    // Try to reach gateway
    try {
      const res = await gatewayFetch('/health');
      if (res.ok) {
        online = true;
        const data = await res.json().catch(() => ({}));
        version = data.version || version;
      }
    } catch { /* gateway offline */ }

    // Read config for model info
    try {
      const content = await fs.readFile('C:\\Users\\nj\\.openclaw\\openclaw.json', 'utf-8');
      const config = JSON.parse(content);
      model = config.model?.default || model;
      version = config.meta?.lastTouchedByVersion || version;
    } catch { /* config not readable */ }

    return new Response(JSON.stringify({
      online,
      version,
      port: GATEWAY_PORT,
      model,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      online: false,
      version: 'unknown',
      port: GATEWAY_PORT,
      model: 'unknown',
      error: err.message,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
