// src/pages/api/channels/tui-history.ts
// GET: Read TUI/any session history from transcript JSONL file

import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

const AGENTS_DIR = 'C:\\Users\\nj\\.openclaw\\agents';

// Known TUI session ID — from sessions_list webchat session
const TUI_SESSION_ID = 'c214f19e-39af-4d14-95e5-2dc47eaa01e9';

async function findTranscript(): Promise<string | null> {
  // First try known TUI session
  const knownPath = path.join(AGENTS_DIR, 'opus', 'sessions', `${TUI_SESSION_ID}.jsonl`);
  try {
    await fs.access(knownPath);
    return knownPath;
  } catch {}

  // Fallback: find most recent session in each agent dir
  for (const agent of ['opus', 'main']) {
    const sessDir = path.join(AGENTS_DIR, agent, 'sessions');
    try {
      const files = (await fs.readdir(sessDir)).filter(f => f.endsWith('.jsonl'));
      let newest = { path: '', mtime: 0 };
      for (const f of files) {
        const fp = path.join(sessDir, f);
        const stat = await fs.stat(fp);
        if (stat.mtimeMs > newest.mtime) newest = { path: fp, mtime: stat.mtimeMs };
      }
      if (newest.path) return newest.path;
    } catch { continue; }
  }
  return null;
}

interface NormalizedMessage {
  id: string;
  content: string;
  timestamp: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    bot: boolean;
  };
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const limit = parseInt(url.searchParams.get('limit') || '30');
    const transcriptPath = await findTranscript();

    if (!transcriptPath) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Read file and parse JSONL
    const content = await fs.readFile(transcriptPath, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);

    const messages: NormalizedMessage[] = [];

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);

        // Only process message entries
        if (entry.type !== 'message') continue;
        if (!entry.message) continue;

        const msg = entry.message;
        const role = msg.role;

        // Skip system messages
        if (role === 'system' || role === 'tool') continue;

        // Extract text from content array
        let text = '';
        if (typeof msg.content === 'string') {
          text = msg.content;
        } else if (Array.isArray(msg.content)) {
          const textParts = msg.content
            .filter((c: any) => c.type === 'text')
            .map((c: any) => c.text || '');
          text = textParts.join('\n');
        }

        if (!text.trim()) continue;

        // Clean up: remove conversation metadata blocks from user messages
        let cleanText = text;
        if (role === 'user') {
          // Remove "Conversation info..." blocks
          const convMatch = cleanText.match(/Conversation info \(untrusted metadata\):[\s\S]*?```\n\n/);
          if (convMatch) cleanText = cleanText.slice(convMatch.index! + convMatch[0].length);
          // Remove "Sender..." blocks
          const senderMatch = cleanText.match(/Sender \(untrusted metadata\):[\s\S]*?```\n\n/);
          if (senderMatch) cleanText = cleanText.slice(senderMatch.index! + senderMatch[0].length);
          cleanText = cleanText.trim();
          if (!cleanText) continue;
        }

        // Skip very long assistant messages (tool dumps)
        if (role === 'assistant' && cleanText.length > 3000) {
          cleanText = cleanText.slice(0, 3000) + '\n\n[... truncated]';
        }

        const isBot = role === 'assistant';
        messages.push({
          id: entry.id || `tui-${messages.length}`,
          content: cleanText,
          timestamp: entry.timestamp || new Date().toISOString(),
          author: {
            id: isBot ? 'bot' : '1471565107174707284',
            username: isBot ? 'OpenMarco' : 'marcobit',
            displayName: isBot ? 'OpenMarco' : 'marcobit',
            bot: isBot,
          },
        });
      } catch { /* skip bad lines */ }
    }

    // Return last N messages
    return new Response(JSON.stringify(messages.slice(-limit)), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
