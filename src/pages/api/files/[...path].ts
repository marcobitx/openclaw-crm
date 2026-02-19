// src/pages/api/files/[...path].ts
// GET: Read file content, PUT: Write file content

import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

const WORKSPACE = 'C:\\Users\\nj\\.openclaw\\workspace';

export const GET: APIRoute = async ({ params }) => {
  try {
    const filePath = params.path;
    if (!filePath) {
      return new Response(JSON.stringify({ error: 'Path required' }), { status: 400 });
    }

    // Security: prevent directory traversal
    const resolved = path.resolve(WORKSPACE, filePath);
    if (!resolved.startsWith(WORKSPACE)) {
      return new Response(JSON.stringify({ error: 'Access denied' }), { status: 403 });
    }

    const content = await fs.readFile(resolved, 'utf-8');
    const stat = await fs.stat(resolved);

    return new Response(JSON.stringify({
      name: path.basename(filePath),
      path: filePath,
      content,
      lastModified: stat.mtime.toISOString(),
      size: stat.size,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    const status = err.code === 'ENOENT' ? 404 : 500;
    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const filePath = params.path;
    if (!filePath) {
      return new Response(JSON.stringify({ error: 'Path required' }), { status: 400 });
    }

    const resolved = path.resolve(WORKSPACE, filePath);
    if (!resolved.startsWith(WORKSPACE)) {
      return new Response(JSON.stringify({ error: 'Access denied' }), { status: 403 });
    }

    const body = await request.json();
    await fs.writeFile(resolved, body.content, 'utf-8');

    return new Response(JSON.stringify({ success: true, path: filePath }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
