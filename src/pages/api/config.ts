// src/pages/api/config.ts
// GET: Read gateway config

import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';

const CONFIG_PATH = 'C:\\Users\\nj\\.openclaw\\openclaw.json';

export const GET: APIRoute = async () => {
  try {
    const content = await fs.readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(content);

    // Redact sensitive fields
    if (config.discord?.token) config.discord.token = '***REDACTED***';
    if (config.auth) {
      for (const key of Object.keys(config.auth)) {
        const profile = config.auth[key];
        if (profile?.apiKey) profile.apiKey = '***REDACTED***';
        if (profile?.token) profile.token = '***REDACTED***';
      }
    }
    if (config.gateway?.authToken) config.gateway.authToken = '***REDACTED***';

    return new Response(JSON.stringify(config), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
