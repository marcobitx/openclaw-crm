// src/lib/store.ts
// Global reactive store — createStore + useStore pattern
// Based on procurement-analyzer pattern, adapted for OpenClaw CRM

import { useState, useEffect } from 'react';
import type { AppView, WorkspaceFile, Skill, CronJob, Session, DiscordChannel, GatewayConfig, GatewayStatus } from './types';

type Listener = () => void;

function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    getState: () => state,
    setState: (partial: Partial<T> | ((prev: T) => Partial<T>)) => {
      const update = typeof partial === 'function' ? partial(state) : partial;
      state = { ...state, ...update };
      listeners.forEach((l) => l());
    },
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}

/** SSR-safe hook — avoids useSyncExternalStore server snapshot issues */
export function useStore<T>(store: ReturnType<typeof createStore<T>>): T {
  const [snapshot, setSnapshot] = useState(() => store.getState());
  useEffect(() => {
    setSnapshot(store.getState());
    return store.subscribe(() => setSnapshot(store.getState()));
  }, [store]);
  return snapshot;
}

export interface AppState {
  view: AppView;
  sidebarOpen: boolean;
  error: string | null;
  loading: boolean;

  // Files
  files: WorkspaceFile[];
  selectedFile: string | null;
  fileContent: string;
  fileEditing: boolean;
  filesLoading: boolean;

  // Skills
  skills: Skill[];
  selectedSkill: string | null;
  skillsLoading: boolean;
  skillSearch: string;

  // Cron
  cronJobs: CronJob[];
  selectedCronJob: string | null;
  cronLoading: boolean;

  // Sessions
  sessions: Session[];
  selectedSession: string | null;
  sessionsLoading: boolean;

  // Discord channels
  channels: DiscordChannel[];
  selectedChannel: string | null;

  // Config
  config: GatewayConfig | null;
  configLoading: boolean;

  // Status
  status: GatewayStatus | null;

  // Search
  searchQuery: string;

  // Right panel
  rightPanelContent: 'none' | 'skill-detail' | 'cron-detail' | 'channel-info' | 'file-info';
}

export const appStore = createStore<AppState>({
  view: 'dashboard',
  sidebarOpen: true,
  error: null,
  loading: false,

  files: [],
  selectedFile: null,
  fileContent: '',
  fileEditing: false,
  filesLoading: false,

  skills: [],
  selectedSkill: null,
  skillsLoading: false,
  skillSearch: '',

  cronJobs: [],
  selectedCronJob: null,
  cronLoading: false,

  sessions: [],
  selectedSession: null,
  sessionsLoading: false,

  channels: [],
  selectedChannel: null,

  config: null,
  configLoading: false,

  status: null,

  searchQuery: '',

  rightPanelContent: 'none',
});

export type { AppView };
