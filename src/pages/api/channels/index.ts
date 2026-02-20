// src/pages/api/channels/index.ts
// GET: List all known channels — static config + quick message probe

import type { APIRoute } from 'astro';

const GATEWAY_PORT = 18789;
const GATEWAY_TOKEN = 'f1fa263f746003d4667660b5c88920a329771b5eddb62ba1';
const GATEWAY_BASE = `http://127.0.0.1:${GATEWAY_PORT}`;

// Channel configs with metadata
const CHANNELS = [
  { id: '1471576831214878814', name: 'general', type: 'discord', emoji: '💬', model: 'sonnet' },
  { id: '1471596099671425278', name: 'coding', type: 'discord', emoji: '💻', model: 'opus' },
  { id: '1471596209750933630', name: 'research', type: 'discord', emoji: '🔬', model: 'opus' },
  { id: '1471596286091460877', name: 'power_bi', type: 'discord', emoji: '📊', model: 'sonnet' },
  { id: '1471596380782067916', name: 'investment', type: 'discord', emoji: '💰', model: 'opus' },
  { id: '1471610729499987974', name: 'x_com', type: 'discord', emoji: '𝕏', model: 'sonnet' },
  { id: '1471610790103617677', name: 'moltbook', type: 'discord', emoji: '🦞', model: 'sonnet' },
  { id: '1471613757594533908', name: 'manutd', type: 'discord', emoji: '⚽', model: 'sonnet' },
  { id: '1471613811625558221', name: 'zalgiris', type: 'discord', emoji: '🏀', model: 'sonnet' },
  { id: '1474163138231406716', name: 'pinigai', type: 'discord', emoji: '🏦', model: 'sonnet' },
];

// Quick probe: read 1 message to check if channel has content
async function probeChannel(channelId: string): Promise<{ active: boolean; lastMessage?: string; lastTime?: string }> {
  try {
    const res = await fetch(`${GATEWAY_BASE}/tools/invoke`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'message',
        args: { action: 'read', channel: 'discord', target: channelId, limit: 1 },
      }),
    });
    if (!res.ok) return { active: false };
    const json = await res.json();
    if (!json.ok) return { active: false };

    const textContent = json.result?.content?.find((c: any) => c.type === 'text');
    if (!textContent?.text) return { active: false };

    const parsed = JSON.parse(textContent.text);
    const messages = Array.isArray(parsed) ? parsed : (parsed?.messages || []);
    if (messages.length > 0) {
      const last = messages[0];
      const authorName = last.author?.global_name || last.author?.username || '';
      const preview = last.content?.slice(0, 60) || '';
      return {
        active: true,
        lastMessage: authorName ? `${authorName}: ${preview}` : preview,
        lastTime: last.timestamp,
      };
    }
    return { active: true };
  } catch {
    return { active: false };
  }
}

export const GET: APIRoute = async ({ url }) => {
  const withProbe = url.searchParams.get('probe') !== 'false';

  try {
    let channels;

    if (withProbe) {
      // Probe all channels in parallel for latest message
      const probes = CHANNELS.map(async (ch) => {
        const probe = await probeChannel(ch.id);
        return { ...ch, ...probe };
      });
      channels = await Promise.all(probes);
    } else {
      channels = CHANNELS.map(ch => ({ ...ch, active: true }));
    }

    // Add TUI at top
    channels.unshift({
      id: 'main',
      name: 'Terminal (TUI)',
      type: 'webchat' as any,
      emoji: '🖥️',
      model: 'opus',
      active: true,
    });

    return new Response(JSON.stringify(channels), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    // Fallback: return static list
    const fallback = [
      { id: 'main', name: 'Terminal (TUI)', type: 'webchat', emoji: '🖥️', model: 'opus', active: false },
      ...CHANNELS.map(ch => ({ ...ch, active: false })),
    ];
    return new Response(JSON.stringify(fallback), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
