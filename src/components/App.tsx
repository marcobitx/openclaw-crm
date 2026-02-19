// src/components/App.tsx
// Root application shell — 3-column layout with icon sidebar + main + right panel
// Entry point for the React island; mounted client-only in index.astro

import { useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import { appStore, useStore } from '../lib/store';
import type { AppView } from '../lib/types';
import IconSidebar from './IconSidebar';
import TopBar from './TopBar';
import DashboardView from './DashboardView';
import FilesView from './FilesView';
import SkillsView from './SkillsView';
import CronView from './CronView';
import ConversationsView from './ConversationsView';
import ConfigView from './ConfigView';
import CalendarView from './CalendarView';
import AnalyticsView from './AnalyticsView';

const VIEW_LABELS: Record<AppView, string> = {
  dashboard: 'Dashboard',
  conversations: 'Conversations',
  cron: 'Cron Jobs',
  files: 'Files',
  skills: 'Skills',
  config: 'Config',
  calendar: 'Calendar',
  analytics: 'Analytics',
};

export default function App() {
  const state = useStore(appStore);

  const navigate = useCallback((view: AppView) => {
    appStore.setState({ view, error: null });
  }, []);

  const renderView = () => {
    switch (state.view) {
      case 'dashboard':
        return <DashboardView onNavigate={navigate} />;
      case 'files':
        return <FilesView />;
      case 'skills':
        return <SkillsView />;
      case 'cron':
        return <CronView />;
      case 'conversations':
        return <ConversationsView />;
      case 'config':
        return <ConfigView />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      default:
        return <DashboardView onNavigate={navigate} />;
    }
  };

  // Fetch gateway status on load
  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(data => appStore.setState({ status: data }))
      .catch(() => appStore.setState({ status: { online: false, version: 'unknown', port: 18789, model: 'unknown' } }));
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.altKey && e.key === '1') { e.preventDefault(); navigate('dashboard'); }
      else if (e.altKey && e.key === '2') { e.preventDefault(); navigate('conversations'); }
      else if (e.altKey && e.key === '3') { e.preventDefault(); navigate('cron'); }
      else if (e.altKey && e.key === '4') { e.preventDefault(); navigate('files'); }
      else if (e.altKey && e.key === '5') { e.preventDefault(); navigate('skills'); }
      else if (e.altKey && e.key === '6') { e.preventDefault(); navigate('config'); }
      else if (e.altKey && e.key === '7') { e.preventDefault(); navigate('calendar'); }
      else if (e.altKey && e.key === '8') { e.preventDefault(); navigate('analytics'); }
      else if (e.key === 'Escape') {
        appStore.setState({ error: null, selectedSkill: null, selectedCronJob: null });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  return (
    <div className="relative z-10 flex h-screen overflow-hidden">
      {/* Left — Icon Sidebar */}
      <IconSidebar currentView={state.view} onNavigate={navigate} />

      {/* Center + Right — Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 mt-3 mr-3 mb-3 rounded-2xl border border-surface-700/20 bg-surface-900/50">
        <TopBar currentView={state.view} onNavigate={navigate} />

        <div className="flex-1 flex overflow-hidden min-h-0">
          <main className="flex-1 overflow-y-auto scrollbar-thin">
            <div key={state.view} className="px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-6 view-enter">
              {renderView()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
