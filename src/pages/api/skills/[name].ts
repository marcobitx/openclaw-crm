// src/pages/api/skills/[name].ts
// GET: Full SKILL.md content for a specific skill

import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

const SKILL_DIRS = [
  'C:\\Users\\nj\\.openclaw\\workspace\\skills',
  'C:\\Users\\nj\\.agents\\skills',
];

export const GET: APIRoute = async ({ params }) => {
  try {
    const name = params.name;
    if (!name) {
      return new Response(JSON.stringify({ error: 'Skill name required' }), { status: 400 });
    }

    for (const dir of SKILL_DIRS) {
      const skillMd = path.join(dir, name, 'SKILL.md');
      try {
        const content = await fs.readFile(skillMd, 'utf-8');
        return new Response(JSON.stringify({ name, content, location: dir }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch { /* try next dir */ }
    }

    return new Response(JSON.stringify({ error: 'Skill not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
