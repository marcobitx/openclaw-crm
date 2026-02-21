// src/pages/api/cron/index.ts
// GET: List cron jobs from jobs.json file (direct read — faster & more reliable)
// POST: toggle/trigger via gateway tools/invoke

import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';

const CRON_JOBS_PATH = 'C:\\Users\\nj\\.openclaw\\cron\\jobs.json';
const CRON_RUNS_DIR = 'C:\\Users\\nj\\.openclaw\\cron\\runs';

function formatSchedule(schedule: any): string {
  if (!schedule) return 'unknown';
  if (schedule.kind === 'cron') {
    return `${schedule.expr}${schedule.tz ? ` (${schedule.tz})` : ''}`;
  }
  if (schedule.kind === 'every') {
    const ms = schedule.everyMs;
    if (ms >= 86400000) return `every ${Math.round(ms / 86400000)}d`;
    if (ms >= 3600000) return `every ${Math.round(ms / 3600000)}h`;
    if (ms >= 60000) return `every ${Math.round(ms / 60000)}min`;
    return `every ${ms}ms`;
  }
  if (schedule.kind === 'at') {
    return `once at ${new Date(schedule.at).toLocaleString()}`;
  }
  return JSON.stringify(schedule);
}

export const GET: APIRoute = async () => {
  try {
    const raw = await fs.readFile(CRON_JOBS_PATH, 'utf-8');
    const data = JSON.parse(raw);
    const rawJobs = data.jobs || [];

    const jobs = rawJobs.map((j: any) => {
      const state = j.state || {};
      return {
        id: j.id,
        name: j.name || 'Unnamed',
        schedule: formatSchedule(j.schedule),
        scheduleRaw: j.schedule,
        enabled: j.enabled !== false,
        status: !j.enabled ? 'disabled' : (state.consecutiveErrors > 0) ? 'error' : (state.lastStatus === 'ok') ? 'active' : 'active',
        lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : null,
        nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : null,
        lastStatus: state.lastStatus || null,
        lastDurationMs: state.lastDurationMs || null,
        lastError: state.lastError || null,
        consecutiveErrors: state.consecutiveErrors || 0,
        payload: j.payload || null,
        delivery: j.delivery || null,
        sessionTarget: j.sessionTarget || null,
        model: j.payload?.model || null,
        agentId: j.agentId || null,
      };
    });

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

    // Read current jobs
    const raw = await fs.readFile(CRON_JOBS_PATH, 'utf-8');
    const data = JSON.parse(raw);
    const jobs = data.jobs || [];

    if (action === 'toggle') {
      const job = jobs.find((j: any) => j.id === id);
      if (!job) return resp(404, { error: 'Job not found' });
      
      job.enabled = !job.enabled;
      job.updatedAtMs = Date.now();
      
      await fs.writeFile(CRON_JOBS_PATH, JSON.stringify(data, null, 2));
      return resp(200, { ok: true, enabled: job.enabled });
    }

    return resp(400, { error: 'Unknown action (toggle supported)' });
  } catch (err: any) {
    return resp(500, { error: err.message });
  }
};

function resp(status: number, data: any) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
