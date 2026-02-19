// src/components/TopBar.tsx
// Breadcrumb, search input, status indicator

import { clsx } from 'clsx';
import {
  LayoutDashboard, MessageSquare, Clock, FolderOpen, Brain,
  Settings, Calendar, BarChart3, Search, Wifi, WifiOff,
} from 'lucide-react';
import { appStore, useStore } from '../lib/store';
import type { AppView } from '../lib/types';

interface Props {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const VIEW_META: Record<AppView, { label: string; icon: any }> = {
  dashboard: { label: 'Dashboard', icon: LayoutDashboard },
  conversations: { label: 'Conversations', icon: MessageSquare },
  cron: { label: 'Cron Jobs', icon: Clock },
  files: { label: 'Files', icon: FolderOpen },
  skills: { label: 'Skills', icon: Brain },
  config: { label: 'Config', icon: Settings },
  calendar: { label: 'Calendar', icon: Calendar },
  analytics: { label: 'Analytics', icon: BarChart3 },
};

export default function TopBar({ currentView, onNavigate }: Props) {
  const state = useStore(appStore);
  const meta = VIEW_META[currentView];
  const Icon = meta.icon;
  const isOnline = state.status?.online !== false;

  return (
    <header className="flex items-center h-14 px-4 sm:px-6 border-b border-surface-700/20 flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="w-4 h-4 text-brand-400 flex-shrink-0" />
        <h1 className="text-[14px] font-bold text-surface-100 tracking-tight truncate">
          {meta.label}
        </h1>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
        <input
          type="text"
          placeholder="Search..."
          value={state.searchQuery}
          onChange={(e) => appStore.setState({ searchQuery: e.target.value })}
          className="w-48 lg:w-64 pl-9 pr-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700/30 text-[13px] text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500/30 focus:ring-2 focus:ring-brand-500/5 transition-all"
        />
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 ml-4" title={isOnline ? 'Gateway online' : 'Gateway offline'}>
        {isOnline ? (
          <Wifi className="w-4 h-4 text-emerald-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-surface-600" />
        )}
        <span className={clsx(
          'w-2 h-2 rounded-full',
          isOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30' : 'bg-surface-600',
        )} />
      </div>
    </header>
  );
}
