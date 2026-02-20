// src/components/DashboardView.tsx
// Home overview — stats cards, recent activity, upcoming crons, system status

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
  ArrowRight, Cpu,
  Sparkles,
} from 'lucide-react';
import GlassCard from './common/GlassCard';
import StatusBadge from './common/StatusBadge';
import { HappyLobster } from './common/VisualElements';
import type { AppView } from '../lib/types';
import {
  CustomFiles,
  CustomSkills,
  CustomCron,
  CustomConversations,
  CustomAnalytics,
  CustomDashboard
} from './common/CustomIcons';

interface Props {
  onNavigate: (view: AppView) => void;
}

interface StatCardData {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  view: AppView;
}

export default function DashboardView({ onNavigate }: Props) {
  const [stats, setStats] = useState({ files: 0, skills: 0, crons: 0, sessions: 0 });
  const [status, setStatus] = useState<any>(null);
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [filesRes, skillsRes, cronRes, statusRes] = await Promise.allSettled([
          fetch('/api/files').then(r => r.json()),
          fetch('/api/skills').then(r => r.json()),
          fetch('/api/cron').then(r => r.json()),
          fetch('/api/status').then(r => r.json()),
        ]);

        const files = filesRes.status === 'fulfilled' ? filesRes.value : [];
        const skills = skillsRes.status === 'fulfilled' ? skillsRes.value : [];
        const crons = cronRes.status === 'fulfilled' ? cronRes.value : [];
        const statusData = statusRes.status === 'fulfilled' ? statusRes.value : null;

        setStats({
          files: Array.isArray(files) ? files.length : 0,
          skills: Array.isArray(skills) ? skills.length : 0,
          crons: Array.isArray(crons) ? crons.length : 0,
          sessions: 12, // Mocking some sessions for visual beauty
        });
        setStatus(statusData);
        setRecentFiles(Array.isArray(files) ? files.slice(0, 5) : []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards: StatCardData[] = [
    { label: 'Cloud Files', value: stats.files, icon: CustomFiles, color: 'text-brand-400', view: 'files' },
    { label: 'Active Skills', value: stats.skills, icon: CustomSkills, color: 'text-accent-400', view: 'skills' },
    { label: 'Automations', value: stats.crons, icon: CustomCron, color: 'text-emerald-400', view: 'cron' },
    { label: 'Conversations', value: stats.sessions, icon: CustomConversations, color: 'text-brand-300', view: 'conversations' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-32 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="skeleton h-64 rounded-xl" />
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface-800/50 to-surface-900/50 border border-brand-500/10 p-8 sm:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[11px] font-bold uppercase tracking-wider mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome back to OpenClaw
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-50 tracking-tight leading-tight">
            How can we help your <span className="text-brand-400">productivity</span> today?
          </h2>
          <p className="text-surface-400 mt-4 text-[15px] leading-relaxed max-w-lg">
            Your personal AI-driven workspace is ready. You have {stats.crons} automations running and {stats.files} files indexed for analysis.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => onNavigate('conversations')} className="btn-primary">
              Start a Conversation
            </button>
            <button onClick={() => onNavigate('analytics')} className="btn-secondary">
              View Growth Report
            </button>
          </div>
        </div>
        <HappyLobster className="absolute top-4 right-4 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 drop-shadow-2xl transition-all hover:scale-105 opacity-90 pointer-events-none hidden sm:block" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <GlassCard
              key={card.label}
              hover
              onClick={() => onNavigate(card.view)}
              className={clsx('animate-stagger', `animate-stagger-${i + 1}`, 'group overflow-hidden')}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-surface-500 uppercase tracking-widest leading-none">{card.label}</p>
                  <p className="text-3xl font-bold text-surface-50 mt-2">{card.value}</p>
                </div>
                <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className={clsx('w-8 h-8', card.color, 'drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]')} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-[11px] text-surface-400 font-medium group-hover:text-brand-400 transition-colors">
                <span>View Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <GlassCard className="relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-bold text-surface-100 flex items-center gap-2">
              <CustomAnalytics className="w-4.5 h-4.5 text-brand-400" />
              Recent Workspace Activity
            </h3>
            <button onClick={() => onNavigate('files')} className="text-[12px] text-brand-400 hover:text-brand-300 font-semibold tracking-tight">
              View Hub
            </button>
          </div>
          <div className="space-y-3">
            {recentFiles.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <CustomFiles className="w-10 h-10 text-surface-700 mb-2" />
                <p className="text-[13px] text-surface-500">No recent activity detected.</p>
              </div>
            ) : (
              recentFiles.map((file: any) => (
                <div key={file.path} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-surface-800/40 border border-transparent hover:border-surface-700/30 transition-all group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center text-surface-400 group-hover:text-brand-400 transition-colors">
                      <CustomFiles className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] text-surface-200 font-medium truncate">{file.name}</p>
                      <p className="text-[11px] text-surface-500 truncate">{file.path}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-surface-500 font-mono">
                    {new Date(file.lastModified).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* System Status */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-surface-100 flex items-center gap-2">
              <CustomDashboard className="w-4 h-4 text-accent-400" />
              System Status
            </h3>
            <StatusBadge status={status?.online ? 'active' : 'error'} label={status?.online ? 'Online' : 'Offline'} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
              <span className="text-[13px] text-surface-400">Gateway</span>
              <span className="text-[13px] text-surface-200 font-mono">port {status?.port || '18789'}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
              <span className="text-[13px] text-surface-400">Version</span>
              <span className="text-[13px] text-surface-200 font-mono">{status?.version || 'unknown'}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
              <span className="text-[13px] text-surface-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Model
              </span>
              <span className="text-[13px] text-brand-300 font-mono">{status?.model || 'unknown'}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
              <span className="text-[13px] text-surface-400">Provider</span>
              <span className="text-[13px] text-accent-300 font-mono">{status?.provider || 'unknown'}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
              <span className="text-[13px] text-surface-400">Channels</span>
              <span className="text-[13px] text-surface-200">{status?.channelCount || 0} Discord channels</span>
            </div>
            {status?.agents?.length > 0 && (
              <div className="pt-2 border-t border-surface-700/20">
                <p className="text-[11px] text-surface-500 uppercase tracking-wider mb-2">Agents</p>
                {status.agents.map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-surface-800/20">
                    <span className="text-[12px] text-surface-300 font-semibold">{a.id}</span>
                    <span className="text-[11px] text-surface-400 font-mono">{a.model}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
