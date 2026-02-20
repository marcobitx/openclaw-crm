// src/pages/api/status.ts
// GET: Gateway health/status — reads config for version, model, provider info

import type { APIRoute } from 'astro';
import { GATEWAY_PORT } from '../../lib/gateway';
import fs from 'node:fs/promises';

export const GET: APIRoute = async () => {
  try {
    let online = false;
    let version = 'unknown';
    let model = 'unknown';
    let provider = 'unknown';
    let agents: any[] = [];
    let uptime = '';
    let channelCount = 0;
    let guildId = '';

    // Check if gateway is reachable
    try {
      const res = await fetch(`http://127.0.0.1:${GATEWAY_PORT}/`, {
        signal: AbortSignal.timeout(3000),
      });
      online = res.ok || res.status === 200;
    } catch { /* truly offline */ }

    // Read config for detailed info
    try {
      const content = await fs.readFile('C:\\Users\\nj\\.openclaw\\openclaw.json', 'utf-8');
      const config = JSON.parse(content);

      // Version
      version = config.meta?.lastTouchedByVersion || 'unknown';

      // Default model
      const defaultModel = config.agents?.defaults?.model?.primary || config.model?.default || '';
      model = defaultModel;

      // Extract provider from model string (e.g. "anthropic/claude-opus-4-6" -> "anthropic")
      if (defaultModel.includes('/')) {
        provider = defaultModel.split('/')[0];
      }

      // Agent list
      if (config.agents?.list) {
        agents = Object.entries(config.agents.list).map(([id, cfg]: [string, any]) => ({
          id,
          model: cfg.model?.primary || defaultModel,
          provider: (cfg.model?.primary || defaultModel).split('/')[0] || provider,
        }));
      }

      // Channel count
      if (config.channels?.discord?.guilds) {
        const guilds = config.channels.discord.guilds;
        const guildIds = Object.keys(guilds);
        guildId = guildIds[0] || '';
        for (const gid of guildIds) {
          const channels = guilds[gid]?.channels;
          if (channels) {
            channelCount += Object.keys(channels).length;
          }
        }
      }
    } catch { /* config not readable */ }

    // Read package.json for openclaw version
    try {
      const pkgPath = 'C:\\Users\\nj\\AppData\\Roaming\\npm\\node_modules\\openclaw\\package.json';
      const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
      if (pkg.version) version = pkg.version;
    } catch { /* fallback to config version */ }

    return new Response(JSON.stringify({
      online,
      version,
      port: GATEWAY_PORT,
      model,
      provider,
      agents,
      channelCount,
      guildId,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({
      online: false,
      version: 'unknown',
      port: GATEWAY_PORT,
      model: 'unknown',
      provider: 'unknown',
      error: err.message,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
