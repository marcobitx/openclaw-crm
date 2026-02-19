// src/components/ConversationsView.tsx
// Discord channel browser with session/message history

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { MessageSquare, Hash, User, Bot, Search } from 'lucide-react';
import GlassCard from './common/GlassCard';
import MarkdownRenderer from './common/MarkdownRenderer';

// Discord channels from config
const CHANNELS = [
  { id: 'general', name: 'general' },
  { id: 'coding', name: 'coding' },
  { id: 'research', name: 'research' },
  { id: 'power_bi', name: 'power_bi' },
  { id: 'investment', name: 'investment' },
  { id: 'pinigai', name: 'pinigai' },
  { id: 'x_com', name: 'x_com' },
  { id: 'moltbook', name: 'moltbook' },
  { id: 'manutd', name: 'manutd' },
  { id: 'zalgiris', name: 'zalgiris' },
];

interface SessionItem {
  key: string;
  channelName: string;
  lastMessage: string;
  lastTimestamp: string;
  messageCount: number;
}

export default function ConversationsView() {
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/sessions')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setSessions(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const channelSessions = sessions.filter(s =>
    s.channelName?.toLowerCase().includes(selectedChannel.toLowerCase())
  );

  const filteredChannels = CHANNELS.filter(c =>
    search === '' || c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)]">
      {/* Left — Channel List */}
      <div className="w-56 flex-shrink-0 overflow-y-auto scrollbar-thin">
        <GlassCard padding="p-3" className="h-full">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-surface-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter channels..."
              className="w-full pl-7 pr-2 py-1.5 rounded-md bg-surface-800/50 border border-surface-700/20 text-[12px] text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500/30"
            />
          </div>

          <h3 className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider px-2 mb-2">
            Discord Channels
          </h3>

          <div className="space-y-0.5">
            {filteredChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={clsx(
                  'flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-left transition-colors',
                  selectedChannel === channel.id
                    ? 'bg-brand-500/10 text-brand-300'
                    : 'text-surface-300 hover:bg-surface-800/50 hover:text-surface-100',
                )}
              >
                <Hash className="w-3.5 h-3.5 flex-shrink-0 text-surface-500" />
                <span className="text-[13px] truncate">{channel.name}</span>
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Main — Messages */}
      <div className="flex-1 flex flex-col min-w-0">
        <GlassCard padding="p-0" className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-surface-700/20">
            <Hash className="w-4 h-4 text-brand-400" />
            <h3 className="text-[14px] font-bold text-surface-100">{selectedChannel}</h3>
            <span className="text-[11px] text-surface-500 ml-auto">{channelSessions.length} sessions</span>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3">
                    <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-3 rounded w-24" />
                      <div className="skeleton h-4 rounded w-full" />
                      <div className="skeleton h-4 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : channelSessions.length > 0 ? (
              <div className="space-y-4">
                {channelSessions.map(session => (
                  <div key={session.key} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-semibold text-surface-200">{session.channelName || 'Session'}</span>
                        <span className="text-[11px] text-surface-500">
                          {session.lastTimestamp ? new Date(session.lastTimestamp).toLocaleString() : ''}
                        </span>
                      </div>
                      <div className="bg-surface-800/40 rounded-lg px-3 py-2">
                        <p className="text-[13px] text-surface-300">{session.lastMessage || 'No messages'}</p>
                      </div>
                      <span className="text-[11px] text-surface-500 mt-1">{session.messageCount || 0} messages</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-surface-700 mx-auto mb-3" />
                  <p className="text-[14px] text-surface-400">No sessions in #{selectedChannel}</p>
                  <p className="text-[12px] text-surface-500 mt-1">Sessions will appear when the gateway is active</p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Right Panel — Channel Info */}
      <div className="w-64 flex-shrink-0 overflow-y-auto scrollbar-thin hidden xl:block">
        <GlassCard padding="p-4" className="h-full">
          <h3 className="text-[12px] font-bold text-surface-400 uppercase tracking-wider mb-3">Channel Info</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
              <span className="text-[12px] text-surface-400">Channel</span>
              <span className="text-[12px] text-surface-200">#{selectedChannel}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
              <span className="text-[12px] text-surface-400">Sessions</span>
              <span className="text-[12px] text-surface-200">{channelSessions.length}</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
              <span className="text-[12px] text-surface-400">Bot</span>
              <span className="text-[12px] text-brand-300">@OpenMarco</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
              <span className="text-[12px] text-surface-400">Model</span>
              <span className="text-[12px] text-accent-300 font-mono text-[11px]">
                {['coding', 'research', 'investment'].includes(selectedChannel) ? 'opus' : 'sonnet'}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
