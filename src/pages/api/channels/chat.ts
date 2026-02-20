// src/pages/api/channels/chat.ts
// POST: Send message to Discord channel or handle slash commands
// Messages sent via bot — they appear in Discord and in AI context history

import type { APIRoute } from 'astro';

const GATEWAY_PORT = 18789;
const GATEWAY_TOKEN = 'f1fa263f746003d4667660b5c88920a329771b5eddb62ba1';
const GATEWAY_BASE = `http://127.0.0.1:${GATEWAY_PORT}`;

async function invokeGatewayTool(tool: string, args: Record<string, any>): Promise<any> {
  const res = await fetch(`${GATEWAY_BASE}/tools/invoke`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tool, args }),
  });
  if (!res.ok) throw new Error(`Gateway ${res.status}`);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error?.message || 'Tool error');
  const tc = json.result?.content?.find((c: any) => c.type === 'text');
  if (tc?.text) { try { return JSON.parse(tc.text); } catch { return tc.text; } }
  return json.result?.details || json.result;
}

// Slash commands
const SLASH: Record<string, (a: string) => Promise<any>> = {
  '/help': async () => ({
    type: 'local',
    content: `**CRM Commands:**
• \`/status\` — Session status
• \`/cron\` — Cron jobs list  
• \`/skills\` — Available skills
• \`/clear\` — Clear display
• Regular text → sends to Discord channel`,
  }),
  '/status': async () => {
    const d = await invokeGatewayTool('session_status', {});
    return { type: 'local', content: typeof d === 'string' ? d : JSON.stringify(d, null, 2) };
  },
  '/cron': async () => {
    const d = await invokeGatewayTool('cron', { action: 'list', includeDisabled: true });
    const jobs = d?.jobs || [];
    return { type: 'local', content: `**Cron Jobs (${jobs.length}):**\n${jobs.map((j: any) => `• ${j.enabled ? '✅' : '❌'} **${j.name}** — \`${j.schedule?.expr || 'custom'}\``).join('\n')}` };
  },
  '/skills': async () => {
    try {
      const r = await fetch('http://localhost:3000/api/skills');
      const s = await r.json();
      if (!Array.isArray(s)) return { type: 'local', content: 'Could not load skills' };
      return { type: 'local', content: `**Skills (${s.length}):**\n${s.slice(0, 20).map((x: any) => `• **${x.name}**`).join('\n')}${s.length > 20 ? `\n...and ${s.length - 20} more` : ''}` };
    } catch { return { type: 'local', content: 'Failed to fetch skills' }; }
  },
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { channelId, message } = await request.json();
    if (!channelId || !message) {
      return json(400, { error: 'channelId and message required' });
    }

    const trimmed = message.trim();

    // Slash commands
    if (trimmed.startsWith('/')) {
      const cmd = (trimmed.split(' ')[0] || '').toLowerCase();
      if (cmd === '/clear') return json(200, { type: 'clear' });
      const handler = SLASH[cmd];
      if (handler) {
        try { return json(200, await handler(trimmed.slice(cmd.length).trim())); }
        catch (e: any) { return json(200, { type: 'local', content: `Error: ${e.message}` }); }
      }
    }

    // Send message to Discord channel via message tool
    await invokeGatewayTool('message', {
      action: 'send',
      channel: 'discord',
      target: channelId,
      message: trimmed,
    });

    return json(200, { type: 'sent', method: 'discord', message: trimmed });
  } catch (err: any) {
    return json(500, { error: err.message });
  }
};

function json(status: number, data: any) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}
