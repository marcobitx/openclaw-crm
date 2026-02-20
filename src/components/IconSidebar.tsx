// src/components/IconSidebar.tsx
// Collapsible sidebar — smooth collapse/expand with opacity transitions
// 8 nav items + help + collapse toggle

import { clsx } from 'clsx';
import {
  PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import { appStore, useStore } from '../lib/store';
import { AnimatedLogo } from './common/VisualElements';
import type { AppView } from '../lib/types';
import {
  CustomDashboard,
  CustomConversations,
  CustomCron,
  CustomFiles,
  CustomSkills,
  CustomConfig,
  CustomCalendar,
  CustomAnalytics,
  CustomHelp,
} from './common/CustomIcons';

interface Props {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const MAIN_NAV: { view: AppView; icon: any; label: string }[] = [
  { view: 'dashboard', icon: CustomDashboard, label: 'Dashboard' },
  { view: 'conversations', icon: CustomConversations, label: 'Conversations' },
  { view: 'cron', icon: CustomCron, label: 'Cron Jobs' },
  { view: 'files', icon: CustomFiles, label: 'Files' },
  { view: 'skills', icon: CustomSkills, label: 'Skills' },
  { view: 'config', icon: CustomConfig, label: 'Config' },
  { view: 'calendar', icon: CustomCalendar, label: 'Calendar' },
  { view: 'analytics', icon: CustomAnalytics, label: 'Analytics' },
];

/** Reusable fade wrapper — text smoothly appears/disappears with the sidebar */
function FadeText({ expanded, children, className }: { expanded: boolean; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        'whitespace-nowrap overflow-hidden transition-[opacity,max-width,margin] duration-300 ease-out',
        expanded ? 'opacity-100 max-w-[160px] ml-3' : 'opacity-0 max-w-0 ml-0',
        className,
      )}
    >
      {children}
    </span>
  );
}

export default function IconSidebar({ currentView, onNavigate }: Props) {
  const state = useStore(appStore);
  const expanded = state.sidebarOpen;

  const toggle = () => appStore.setState({ sidebarOpen: !expanded });

  return (
    <aside
      className={clsx(
        'flex flex-col h-full flex-shrink-0 overflow-hidden bg-transparent',
        'transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        expanded ? 'w-[240px]' : 'w-[60px]',
      )}
    >
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 h-14 px-4">
        <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 transition-transform duration-500 hover:scale-110">
          <AnimatedLogo className="w-full h-full" />
        </div>
        <FadeText expanded={expanded}>
          <span className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-surface-100 tracking-tight">
              OpenClaw
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20">
              CRM
            </span>
          </span>
        </FadeText>
      </div>

      {/* Toggle button */}
      <div className="flex items-center h-10 flex-shrink-0 mb-1 px-3 transition-all duration-300">
        <button
          onClick={toggle}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className="p-1.5 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-surface-800/50 transition-all duration-200 flex-shrink-0"
          title={expanded ? 'Collapse' : 'Expand'}
        >
          <div className="relative w-[18px] h-[18px] overflow-hidden">
            <PanelLeftClose
              className={clsx(
                'w-[18px] h-[18px] absolute inset-0 transition-all duration-300',
                expanded ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90',
              )}
            />
            <PanelLeftOpen
              className={clsx(
                'w-[18px] h-[18px] absolute inset-0 transition-all duration-300',
                expanded ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0',
              )}
            />
          </div>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-0.5 pt-2 px-2.5 transition-[padding] duration-300">
        {MAIN_NAV.map(({ view, icon: Icon, label }) => {
          const active = currentView === view;
          return (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              title={expanded ? undefined : label}
              className={clsx(
                'relative flex items-center w-full py-2.5 px-3 rounded-xl',
                'transition-all duration-300 group',
                active
                  ? 'bg-white/[0.08] text-surface-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-white/[0.04]',
              )}
            >
              {/* Active Indicator Glow */}
              <div className={clsx(
                "absolute left-0 w-1 h-5 bg-brand-500 rounded-r-full transition-all duration-500 blur-[2px]",
                active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full scale-y-0"
              )} />

              <Icon
                className={clsx(
                  'w-[18px] h-[18px] flex-shrink-0 transition-all duration-300 relative z-10',
                  active ? 'text-brand-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'text-surface-500 group-hover:text-surface-300',
                )}
              />
              <FadeText expanded={expanded} className={active ? 'text-surface-100' : ''}>
                <span className="text-[13px] font-bold tracking-tight">{label}</span>
              </FadeText>

              {/* Sophisticated glass highlights on active */}
              {active && (
                <div className="absolute inset-0 rounded-xl border border-white/[0.08] pointer-events-none" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom — Help */}
      <nav className="flex flex-col gap-0.5 pb-4 px-2.5 transition-[padding] duration-300">
        <button
          onClick={() => window.open('https://docs.openclaw.dev', '_blank')}
          title={expanded ? undefined : 'Help'}
          className="relative flex items-center w-full py-2.5 px-3 rounded-lg transition-all duration-200 text-left text-surface-400 hover:text-surface-200 hover:bg-white/5 group"
        >
          <CustomHelp className="w-[18px] h-[18px] flex-shrink-0 text-surface-500 group-hover:text-surface-300 transition-colors duration-200" />
          <FadeText expanded={expanded}>
            <span className="text-[13px] font-semibold tracking-tight">Help</span>
          </FadeText>
        </button>
      </nav>

      {/* Profile */}
      <div className="flex-shrink-0">
        <div
          className={clsx(
            'flex items-center gap-3 transition-all duration-200 hover:bg-white/5',
            expanded ? 'px-4 py-3' : 'px-0 py-3 justify-center',
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 ring-2 ring-surface-800 shadow-sm">
            <span className="text-[12px] font-bold text-white leading-none">M</span>
          </div>
          <div
            className={clsx(
              'flex-1 min-w-0 text-left overflow-hidden transition-[opacity,max-width] duration-300 ease-out',
              expanded ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0',
            )}
          >
            <p className="text-[13px] font-semibold text-surface-200 truncate leading-tight">Marco</p>
            <p className="text-[10px] text-surface-500 truncate leading-tight mt-0.5">marcobitx@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
