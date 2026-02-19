// src/pages/api/skills/index.ts
// GET: Scan skills directories, parse SKILL.md frontmatter

import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

const SKILL_DIRS = [
  'C:\\Users\\nj\\.openclaw\\workspace\\skills',
  'C:\\Users\\nj\\.agents\\skills',
];

interface SkillInfo {
  name: string;
  description: string;
  location: string;
  category: string;
}

function parseSkillMd(content: string): { description: string; category: string } {
  let description = '';
  let category = 'other';

  // Try to parse YAML frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];
    const descMatch = fm.match(/description:\s*(.+)/);
    if (descMatch) description = descMatch[1].trim().replace(/^["']|["']$/g, '');
    const catMatch = fm.match(/category:\s*(.+)/);
    if (catMatch) category = catMatch[1].trim().toLowerCase();
  }

  // Fallback: first paragraph after frontmatter
  if (!description) {
    const body = fmMatch ? content.slice(fmMatch[0].length).trim() : content.trim();
    const firstLine = body.split('\n').find(l => l.trim() && !l.startsWith('#'));
    if (firstLine) description = firstLine.trim().slice(0, 200);
  }

  return { description, category };
}

async function scanSkillsDir(dirPath: string): Promise<SkillInfo[]> {
  const skills: SkillInfo[] = [];
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillMd = path.join(dirPath, entry.name, 'SKILL.md');
      try {
        const content = await fs.readFile(skillMd, 'utf-8');
        const { description, category } = parseSkillMd(content);
        skills.push({
          name: entry.name,
          description,
          location: dirPath,
          category,
        });
      } catch { /* no SKILL.md */ }
    }
  } catch { /* dir may not exist */ }
  return skills;
}

export const GET: APIRoute = async () => {
  try {
    const allSkills: SkillInfo[] = [];
    for (const dir of SKILL_DIRS) {
      const skills = await scanSkillsDir(dir);
      allSkills.push(...skills);
    }

    // Deduplicate by name (prefer workspace version)
    const seen = new Map<string, SkillInfo>();
    for (const skill of allSkills) {
      if (!seen.has(skill.name)) {
        seen.set(skill.name, skill);
      }
    }

    const result = Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
