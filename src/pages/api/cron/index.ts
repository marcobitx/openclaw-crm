// src/pages/api/cron/index.ts
// GET: List cron jobs via gateway tools/invoke -> cron
// POST: toggle/trigger actions

import type { APIRoute } from 'astro';
import { toolInvoke } from '../../../lib/gateway';

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
    const data = await toolInvoke<any>('cron', {
      action: 'list',
      includeDisabled: true,
    });

    const rawJobs = data?.jobs || data || [];
    const jobs = rawJobs.map((j: any) => {
      const state = j.state || {};
      const lastStatus = state.lastStatus || null;
      const hasErrors = state.consecutiveErrors > 0;

      return {
        id: j.id || j.jobId,
        name: j.name || j.label || 'Unnamed',
        schedule: formatSchedule(j.schedule),
        scheduleRaw: j.schedule,
        enabled: j.enabled !== false,
        status: !j.enabled ? 'disabled' : hasErrors ? 'error' : lastStatus === 'ok' ? 'active' : 'active',
        lastRun: state.lastRunAtMs ? new Date(state.lastRunAtMs).toISOString() : null,
        nextRun: state.nextRunAtMs ? new Date(state.nextRunAtMs).toISOString() : null,
        lastStatus: lastStatus,
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

    if (action === 'toggle') {
      // Get current job to check enabled state
      const listData = await toolInvoke<any>('cron', {
        action: 'list',
        includeDisabled: true,
      });
      const jobs = listData?.jobs || listData || [];
      const job = jobs.find((j: any) => (j.id || j.jobId) === id);
      const currentEnabled = job?.enabled !== false;

      const res = await toolInvoke<any>('cron', {
        action: 'update',
        jobId: id,
        patch: { enabled: !currentEnabled },
      });
      return new Response(JSON.stringify({ ok: true, enabled: !currentEnabled }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (action === 'trigger') {
      const res = await toolInvoke<any>('cron', {
        action: 'run',
        jobId: id,
      });
      return new Response(JSON.stringify({ ok: true }), {
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
