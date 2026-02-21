// src/pages/api/sessions/index.ts  
// GET: List sessions from agent session files (direct filesystem read)

import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

const AGENTS_DIR = 'C:\\Users\\nj\\.openclaw\\agents';

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

export const GET: APIRoute = async () => {
  try {
    const sessions: any[] = [];

    for (const agent of ['opus', 'main']) {
      const sessDir = path.join(AGENTS_DIR, agent, 'sessions');
      try {
        const files = (await fs.readdir(sessDir)).filter(f => f.endsWith('.jsonl'));
        
        for (const file of files) {
          const fullPath = path.join(sessDir, file);
          const stat = await fs.stat(fullPath);
          const sessionId = file.replace('.jsonl', '');

          // Read first line to get session metadata
          const content = await fs.readFile(fullPath, 'utf-8');
          const firstLine = content.split('\n')[0];
          let meta: any = {};
          try { meta = JSON.parse(firstLine); } catch {}

          // Try to determine channel from session content
          let channelName = 'unknown';
          let channelType = 'unknown';
          let channelId = '';

          // Check for discord channel references in content
          for (const [cid, cname] of Object.entries(CHANNEL_NAMES)) {
            if (content.includes(cid)) {
              channelName = cname;
              channelType = 'discord';
              channelId = cid;
              break;
            }
          }

          if (!channelId && content.includes('webchat')) {
            channelName = 'TUI';
            channelType = 'webchat';
          }

          sessions.push({
            key: `agent:${agent}:${sessionId}`,
            sessionId,
            agent,
            channel: channelType,
            channelName,
            channelId,
            size: stat.size,
            updatedAt: stat.mtime.toISOString(),
            createdAt: meta.timestamp || stat.birthtime.toISOString(),
          });
        }
      } catch { /* agent dir may not exist */ }
    }

    // Sort by updated descending
    sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return new Response(JSON.stringify(sessions), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
