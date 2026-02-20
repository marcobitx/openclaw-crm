// src/components/TopBar.tsx
// Breadcrumb, search input, status indicator

import { clsx } from 'clsx';
import {
  Search,
} from 'lucide-react';
import { appStore, useStore } from '../lib/store';
import type { AppView } from '../lib/types';
import {
  CustomDashboard,
  CustomConversations,
  CustomCron,
  CustomFiles,
  CustomSkills,
  CustomConfig,
  CustomCalendar,
  CustomAnalytics
} from './common/CustomIcons';

interface Props {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const VIEW_META: Record<AppView, { label: string; icon: any }> = {
  dashboard: { label: 'Dashboard', icon: CustomDashboard },
  conversations: { label: 'Conversations', icon: CustomConversations },
  cron: { label: 'Cron Jobs', icon: CustomCron },
  files: { label: 'Files', icon: CustomFiles },
  skills: { label: 'Skills', icon: CustomSkills },
  config: { label: 'Config', icon: CustomConfig },
  calendar: { label: 'Calendar', icon: CustomCalendar },
  analytics: { label: 'Analytics', icon: CustomAnalytics },
};

export default function TopBar({ currentView, onNavigate }: Props) {
  const state = useStore(appStore);
  const meta = VIEW_META[currentView];
  const Icon = meta.icon;
  const isOnline = state.status?.online !== false;

  return (
    <header className="flex items-center h-14 px-4 sm:px-6 border-b border-white/[0.05] flex-shrink-0 z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20 shadow-sm shadow-brand-500/5">
          <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.15em] text-surface-500 font-bold leading-none mb-0.5">OpenClaw</span>
          <h1 className="text-[14px] font-extrabold text-surface-100 tracking-tight truncate leading-none">
            {meta.label}
          </h1>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:block group">
        <div className="absolute inset-0 bg-brand-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500 group-focus-within:text-brand-400 transition-colors" />
        <input
          type="text"
          placeholder="Search something..."
          value={state.searchQuery}
          onChange={(e) => appStore.setState({ searchQuery: e.target.value })}
          className="relative w-48 lg:w-72 pl-9 pr-3 py-1.5 rounded-xl bg-surface-950/40 border border-white/[0.05] text-[13px] text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500/30 focus:bg-surface-950/60 transition-all duration-300 shadow-inner"
        />
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/5" title={isOnline ? 'Gateway online' : 'Gateway offline'}>
        <div className="flex flex-col items-end hidden md:flex">
          <span className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">System</span>
          <span className={clsx("text-[11px] font-bold", isOnline ? "text-emerald-400" : "text-surface-600")}>
            {isOnline ? 'Active' : 'Offline'}
          </span>
        </div>
        <div className="relative">
          <div className={clsx(
            'w-2.5 h-2.5 rounded-full relative z-10',
            isOnline ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-surface-700',
          )} />
          {isOnline && (
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
          )}
        </div>
      </div>
    </header>
  );
}
