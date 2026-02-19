// src/components/DashboardView.tsx
// Home overview — stats cards, recent activity, upcoming crons, system status

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
  FolderOpen, Brain, Clock, MessageSquare,
  Activity, ArrowRight, Server, Cpu,
} from 'lucide-react';
import GlassCard from './common/GlassCard';
import StatusBadge from './common/StatusBadge';
import type { AppView } from '../lib/types';

interface Props {
  onNavigate: (view: AppView) => void;
}

interface StatCardData {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  bg: string;
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
          sessions: 0,
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
    { label: 'Files', value: stats.files, icon: FolderOpen, color: 'text-brand-400', bg: 'bg-brand-500/10', view: 'files' },
    { label: 'Skills', value: stats.skills, icon: Brain, color: 'text-accent-400', bg: 'bg-accent-500/10', view: 'skills' },
    { label: 'Cron Jobs', value: stats.crons, icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10', view: 'cron' },
    { label: 'Sessions', value: stats.sessions, icon: MessageSquare, color: 'text-amber-400', bg: 'bg-amber-500/10', view: 'conversations' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-surface-100 tracking-tight">Welcome back, Marco</h2>
        <p className="text-[13px] text-surface-400 mt-1">Here's your OpenClaw overview</p>
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
              className={clsx('animate-stagger', `animate-stagger-${i + 1}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-surface-400 uppercase tracking-wider">{card.label}</p>
                  <p className="text-2xl font-bold text-surface-100 mt-1">{card.value}</p>
                </div>
                <div className={clsx('p-2.5 rounded-xl', card.bg)}>
                  <Icon className={clsx('w-5 h-5', card.color)} />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-[11px] text-surface-500">
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-bold text-surface-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" />
              Recent Files
            </h3>
            <button onClick={() => onNavigate('files')} className="text-[11px] text-brand-400 hover:text-brand-300 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-2">
            {recentFiles.length === 0 ? (
              <p className="text-[13px] text-surface-500">No files found</p>
            ) : (
              recentFiles.map((file: any) => (
                <div key={file.path} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface-800/40 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FolderOpen className="w-3.5 h-3.5 text-surface-500 flex-shrink-0" />
                    <span className="text-[13px] text-surface-200 truncate">{file.name}</span>
                  </div>
                  <span className="text-[11px] text-surface-500 flex-shrink-0 ml-2">
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
              <Server className="w-4 h-4 text-accent-400" />
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
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
