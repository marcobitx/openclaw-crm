// src/pages/api/cron/index.ts
// GET: List cron jobs. POST: toggle/trigger actions.

import type { APIRoute } from 'astro';
import { gatewayJSON } from '../../../lib/gateway';
import fs from 'node:fs/promises';
import path from 'node:path';

const CRON_DIR = 'C:\\Users\\nj\\.openclaw\\cron';

// Try gateway first, fallback to scanning cron directory
async function getCronJobsFromFiles() {
  const jobs: any[] = [];
  try {
    const entries = await fs.readdir(CRON_DIR, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.json')) {
        try {
          const content = await fs.readFile(path.join(CRON_DIR, entry.name), 'utf-8');
          const data = JSON.parse(content);
          jobs.push({
            id: data.id || entry.name.replace('.json', ''),
            name: data.name || data.label || entry.name.replace('.json', ''),
            schedule: data.schedule || data.cron || '* * * * *',
            scheduleHuman: data.scheduleHuman || data.schedule || '',
            enabled: data.enabled !== false,
            lastRun: data.lastRun || null,
            nextRun: data.nextRun || null,
            payload: data.payload || data.command || null,
            status: data.enabled !== false ? 'active' : 'disabled',
          });
        } catch { /* skip bad json */ }
      }
    }
  } catch { /* dir may not exist */ }
  return jobs;
}

export const GET: APIRoute = async () => {
  try {
    // Try gateway API first
    try {
      const data = await gatewayJSON<any>('/api/cron/jobs');
      if (Array.isArray(data)) {
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      if (data?.jobs) {
        return new Response(JSON.stringify(data.jobs), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch { /* gateway offline, fallback */ }

    // Fallback: read cron files
    const jobs = await getCronJobsFromFiles();
    return new Response(JSON.stringify(jobs), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { action, id } = body;

    if (action === 'toggle') {
      const res = await gatewayJSON<any>(`/api/cron/jobs/${id}/toggle`, { method: 'POST' });
      return new Response(JSON.stringify(res), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'trigger') {
      const res = await gatewayJSON<any>(`/api/cron/jobs/${id}/run`, { method: 'POST' });
      return new Response(JSON.stringify(res), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
