// src/lib/types.ts
// TypeScript interfaces for all data models

export type AppView =
  | 'dashboard'
  | 'conversations'
  | 'cron'
  | 'files'
  | 'skills'
  | 'config'
  | 'calendar'
  | 'analytics';

export interface WorkspaceFile {
  name: string;
  path: string;
  content: string;
  lastModified: string;
  size: number;
  group: 'core' | 'memory' | 'config';
}

export interface Skill {
  name: string;
  description: string;
  location: string;
  category: 'always' | 'on-demand' | 'tech-specific' | 'design' | 'video' | 'other';
  content?: string;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  scheduleHuman: string;
  enabled: boolean;
  lastRun: string | null;
  nextRun: string | null;
  payload?: any;
  status: 'active' | 'disabled' | 'failed';
}

export interface CronRun {
  id: string;
  jobId: string;
  startedAt: string;
  completedAt: string | null;
  status: 'success' | 'failed' | 'running';
  output?: string;
}

export interface Session {
  key: string;
  channelName: string;
  lastMessage: string;
  lastTimestamp: string;
  messageCount: number;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isBot: boolean;
}

export interface DiscordChannel {
  id: string;
  name: string;
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount?: number;
}

export interface GatewayConfig {
  meta: Record<string, any>;
  auth: Record<string, any>;
  model: Record<string, any>;
  agents: Record<string, any>;
  discord: Record<string, any>;
  gateway: Record<string, any>;
  bindings: any[];
  [key: string]: any;
}

export interface GatewayStatus {
  online: boolean;
  version: string;
  port: number;
  model: string;
  uptime?: string;
}

export interface AnalyticsData {
  tokenUsage: { date: string; tokens: number; cost: number }[];
  sessionsPerDay: { date: string; count: number }[];
  modelBreakdown: { model: string; tokens: number; percentage: number }[];
  totals: {
    totalTokens: number;
    totalCost: number;
    totalSessions: number;
    avgSessionDuration: number;
  };
}

export interface StatCard {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  change?: string;
}
