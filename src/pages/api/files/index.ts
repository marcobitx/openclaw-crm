// src/pages/api/files/index.ts
// GET: List workspace files (MEMORY.md, SOUL.md, USER.md, IDENTITY.md, etc.)

import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

const WORKSPACE = 'C:\\Users\\nj\\.openclaw\\workspace';

const CORE_FILES = [
  'MEMORY.md', 'SOUL.md', 'USER.md', 'IDENTITY.md',
  'TOOLS.md', 'HEARTBEAT.md', 'AGENTS.md',
];

interface FileInfo {
  name: string;
  path: string;
  lastModified: string;
  size: number;
  group: 'core' | 'memory' | 'config';
}

export const GET: APIRoute = async () => {
  try {
    const files: FileInfo[] = [];

    // Core files
    for (const name of CORE_FILES) {
      const fullPath = path.join(WORKSPACE, name);
      try {
        const stat = await fs.stat(fullPath);
        files.push({
          name,
          path: name,
          lastModified: stat.mtime.toISOString(),
          size: stat.size,
          group: 'core',
        });
      } catch { /* file may not exist */ }
    }

    // Memory files
    const memoryDir = path.join(WORKSPACE, 'memory');
    try {
      const entries = await fs.readdir(memoryDir);
      for (const entry of entries) {
        if (entry.endsWith('.md')) {
          const fullPath = path.join(memoryDir, entry);
          const stat = await fs.stat(fullPath);
          files.push({
            name: entry,
            path: `memory/${entry}`,
            lastModified: stat.mtime.toISOString(),
            size: stat.size,
            group: 'memory',
          });
        }
      }
    } catch { /* memory dir may not exist */ }

    // Sort: core files first, then memory files by date descending
    files.sort((a, b) => {
      if (a.group !== b.group) return a.group === 'core' ? -1 : 1;
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    });

    return new Response(JSON.stringify(files), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
