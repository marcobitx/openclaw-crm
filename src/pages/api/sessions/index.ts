// src/pages/api/sessions/index.ts
// GET: List all sessions by probing known channel session keys + main session

import type { APIRoute } from 'astro';

const GATEWAY_PORT = 18789;
const GATEWAY_TOKEN = 'f1fa263f746003d4667660b5c88920a329771b5eddb62ba1';
const GATEWAY_BASE = `http://127.0.0.1:${GATEWAY_PORT}`;

// Channel ID -> name mapping (from Discord guild config)
const CHANNEL_NAMES: Record<string, string> = {
  '1471576831214878814': 'general',
  '1471596099671425278': 'coding',
  '1471596209750933630': 'research',
  '1471596286091460877': 'power_bi',
  '1471596380782067916': 'investment',
  '1471610729499987974': 'x_com',
  '1471610790103617677': 'moltbook',
  '1471613757594533908': 'manutd',
  '1471613811625558221': 'zalgiris',
  '1474163138231406716': 'pinigai',
};

const AGENTS = ['opus'];

async function probeSession(sessionKey: string): Promise<any | null> {
  try {
    const res = await fetch(`${GATEWAY_BASE}/tools/invoke`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tool: 'sessions_list',
        args: { limit: 1, messageLimit: 1, activeMinutes: 43200 },
        sessionKey,
      }),
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (!json.ok) return null;

    // Parse text content
    const textContent = json.result?.content?.find((c: any) => c.type === 'text');
    if (!textContent?.text) return null;

    const data = JSON.parse(textContent.text);
    return data?.sessions?.[0] || null;
  } catch {
    return null;
  }
}

function formatSession(s: any, knownChannelName?: string): any {
  let channelName = knownChannelName || s.displayName || s.key || 'Unknown';
  if (!knownChannelName) {
    const hashMatch = s.displayName?.match(/#(\w+)/);
    if (hashMatch) channelName = hashMatch[1];
  }

  let lastMessage = '';
  let lastTimestamp = '';
  if (s.messages?.length) {
    const msg = s.messages[0];
    lastTimestamp = msg.timestamp ? new Date(msg.timestamp).toISOString() : '';
    if (typeof msg.content === 'string') {
      lastMessage = msg.content;
    } else if (Array.isArray(msg.content)) {
      const textPart = msg.content.find((c: any) => c.type === 'text');
      lastMessage = textPart?.text || '';
    }
  }

  const agentMatch = s.key?.match(/^agent:(\w+):/);
  const agent = agentMatch ? agentMatch[1] : 'unknown';

  return {
    key: s.key,
    kind: s.kind,
    channel: s.channel || 'unknown',
    channelName,
    displayName: s.displayName || s.key,
    model: s.model || 'unknown',
    agent,
    totalTokens: s.totalTokens || 0,
    contextTokens: s.contextTokens || 0,
    updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : '',
    lastMessage: (lastMessage || '').slice(0, 500),
    lastTimestamp,
    sessionId: s.sessionId,
  };
}

export const GET: APIRoute = async () => {
  try {
    const results: any[] = [];
    const seen = new Set<string>();

    // Build list of session keys to probe
    const keys: { key: string; name?: string }[] = [];

    for (const agent of AGENTS) {
      keys.push({ key: `agent:${agent}:main` });
      for (const [channelId, channelName] of Object.entries(CHANNEL_NAMES)) {
        keys.push({ key: `agent:${agent}:discord:channel:${channelId}`, name: channelName });
      }
    }

    // Probe all in parallel
    const probes = keys.map(async ({ key, name }) => {
      const session = await probeSession(key);
      if (session && !seen.has(session.key)) {
        seen.add(session.key);
        results.push(formatSession(session, name));
      }
    });

    await Promise.all(probes);

    // Sort by updatedAt descending
    results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message, sessions: [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
