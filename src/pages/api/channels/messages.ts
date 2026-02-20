// src/pages/api/channels/messages.ts
// GET: Read messages from a Discord channel
// POST: Send a message to a Discord channel

import type { APIRoute } from 'astro';

const GATEWAY_PORT = 18789;
const GATEWAY_TOKEN = 'f1fa263f746003d4667660b5c88920a329771b5eddb62ba1';
const GATEWAY_BASE = `http://127.0.0.1:${GATEWAY_PORT}`;

async function invokeMessageTool(args: Record<string, any>): Promise<any> {
  const res = await fetch(`${GATEWAY_BASE}/tools/invoke`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GATEWAY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tool: 'message', args }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gateway error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (!json.ok) {
    throw new Error(json.error?.message || 'Tool invocation failed');
  }

  // Parse text content
  const textContent = json.result?.content?.find((c: any) => c.type === 'text');
  if (textContent?.text) {
    try {
      return JSON.parse(textContent.text);
    } catch {
      return textContent.text;
    }
  }
  return json.result?.details || json.result;
}

// GET /api/channels/messages?channelId=xxx&limit=50
export const GET: APIRoute = async ({ url }) => {
  try {
    const channelId = url.searchParams.get('channelId');
    const limit = parseInt(url.searchParams.get('limit') || '30');
    const before = url.searchParams.get('before') || undefined;

    if (!channelId) {
      return new Response(JSON.stringify({ error: 'channelId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const args: any = {
      action: 'read',
      channel: 'discord',
      target: channelId,
      limit,
    };
    if (before) args.before = before;

    const data = await invokeMessageTool(args);

    // Normalize messages from Discord raw format
    // Response can be { ok, messages: [...] } or just [...]
    const raw = Array.isArray(data) ? data : (data?.messages || data?.data || []);
    const messages = raw.map((m: any) => ({
      id: m.id,
      content: m.content || '',
      timestamp: m.timestamp,
      author: {
        id: m.author?.id,
        username: m.author?.username || m.author?.global_name || 'Unknown',
        displayName: m.author?.global_name || m.author?.username || 'Unknown',
        bot: m.author?.bot || false,
      },
      attachments: (m.attachments || []).map((a: any) => ({
        url: a.url,
        filename: a.filename,
        size: a.size,
        contentType: a.content_type,
      })),
      embeds: m.embeds || [],
    }));

    return new Response(JSON.stringify(messages), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST /api/channels/messages  { channelId, message, replyTo? }
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { channelId, message, replyTo } = body;

    if (!channelId || !message) {
      return new Response(JSON.stringify({ error: 'channelId and message required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const args: any = {
      action: 'send',
      channel: 'discord',
      target: channelId,
      message,
    };
    if (replyTo) args.replyTo = replyTo;

    const data = await invokeMessageTool(args);

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
