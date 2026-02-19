// src/pages/api/sessions/index.ts
// GET: List sessions from gateway

import type { APIRoute } from 'astro';
import { gatewayJSON } from '../../../lib/gateway';

export const GET: APIRoute = async () => {
  try {
    try {
      const data = await gatewayJSON<any>('/api/sessions');
      const sessions = Array.isArray(data) ? data : (data?.sessions || []);
      return new Response(JSON.stringify(sessions), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      // Gateway offline — return empty
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
