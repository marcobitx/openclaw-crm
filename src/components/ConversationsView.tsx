// src/components/ConversationsView.tsx
// Full chat interface — channel list + message history + send

import { useEffect, useState, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import GlassCard from './common/GlassCard';

// Inline icons to avoid import issues
const HashIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);
const TerminalIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
  </svg>
);
const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const PaperclipIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);

interface ChannelInfo {
  id: string;
  name: string;
  type: string;
  emoji?: string;
  active: boolean;
  model: string | null;
  totalTokens?: number;
  contextTokens?: number;
  updatedAt?: string | null;
  lastMessage?: string;
  lastTime?: string;
}

interface Message {
  id: string;
  author?: { id?: string; username?: string; bot?: boolean; displayName?: string };
  content?: string;
  timestamp?: string;
  attachments?: any[];
  embeds?: any[];
}

function formatTime(ts: string | undefined): string {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatTokens(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

// Simple color from username
function userColor(name: string): string {
  const colors = ['text-blue-400', 'text-green-400', 'text-purple-400', 'text-pink-400', 'text-yellow-400', 'text-cyan-400', 'text-orange-400', 'text-red-400'];
  let hash = 0;
  for (const ch of name) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  return colors[Math.abs(hash) % colors.length];
}

export default function ConversationsView() {
  const [channels, setChannels] = useState<ChannelInfo[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelInfo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [slashSuggestions, setSlashSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const lastBotMsgIdRef = useRef<string | null>(null);

  const SLASH_COMMANDS = ['/status', '/help', '/cron', '/skills', '/model', '/clear'];

  // Load channels
  useEffect(() => {
    setLoadingChannels(true);
    fetch('/api/channels')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setChannels(data);
          // Auto-select first active channel, or first channel
          const firstActive = data.find((c: ChannelInfo) => c.active);
          setSelectedChannel(firstActive || data[0] || null);
        }
      })
      .catch(e => console.error('Channels load error:', e))
      .finally(() => setLoadingChannels(false));
  }, []);

  // Load messages when channel changes
  const loadMessages = useCallback(async (channelId: string) => {
    if (channelId === 'main') return; // TUI doesn't support message reading
    setLoadingMessages(true);
    setError(null);
    try {
      const res = await fetch(`/api/channels/messages?channelId=${channelId}&limit=50`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setMessages([]);
      } else {
        const msgs = Array.isArray(data) ? data : [];
        // Reverse to show oldest first (Discord returns newest first)
        setMessages(msgs.reverse());
      }
    } catch (e: any) {
      setError(e.message);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      setLocalMessages([]);
      setThinking(false);
      setError(null);
      if (pollRef.current) clearInterval(pollRef.current);
      loadMessages(selectedChannel.id);
    }
  }, [selectedChannel, loadMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track last bot message for detecting new responses
  useEffect(() => {
    const lastBot = [...messages].reverse().find(m => m.author?.bot);
    if (lastBot) lastBotMsgIdRef.current = lastBot.id;
  }, [messages]);

  // Poll for new messages (AI responses)
  const startPolling = useCallback((channelId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    let attempts = 0;
    const maxAttempts = 90; // 3 minutes max
    const initialMsgCount = messages.length;

    pollRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        setThinking(false);
        if (pollRef.current) clearInterval(pollRef.current);
        return;
      }

      try {
        const res = await fetch(`/api/channels/messages?channelId=${channelId}&limit=5`);
        const msgs = await res.json();
        if (Array.isArray(msgs)) {
          // Check if there's a new bot message we haven't seen
          const latestBot = msgs.find((m: Message) => m.author?.bot);
          if (latestBot && latestBot.id !== lastBotMsgIdRef.current) {
            setThinking(false);
            if (pollRef.current) clearInterval(pollRef.current);
            loadMessages(channelId);
            setLocalMessages([]);
          }
        }
      } catch { /* ignore poll errors */ }
    }, 2500);
  }, [loadMessages, messages.length]);

  // Cleanup polling on unmount or channel change
  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedChannel]);

  // Send message
  const handleSend = async () => {
    if (!inputText.trim() || !selectedChannel || sending) return;
    const text = inputText.trim();
    setInputText('');
    setSlashSuggestions([]);
    setSending(true);

    // Add local "you" message immediately
    const localMsg: Message = {
      id: `local-${Date.now()}`,
      author: { id: 'you', username: 'marcobit', displayName: 'marcobit', bot: false },
      content: text,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/channels/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId: selectedChannel.id, message: text }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.type === 'clear') {
        setMessages([]);
        setLocalMessages([]);
      } else if (data.type === 'local') {
        // Slash command result — show as local system message
        setLocalMessages(prev => [...prev, localMsg, {
          id: `sys-${Date.now()}`,
          author: { id: 'system', username: 'System', displayName: '⚡ System', bot: true },
          content: data.content,
          timestamp: new Date().toISOString(),
        }]);
      } else if (data.type === 'sent') {
        // Message sent to Discord — reload messages after brief delay
        // Show thinking indicator while waiting for AI response
        setThinking(true);
        setTimeout(() => {
          loadMessages(selectedChannel.id);
          setLocalMessages([]);
        }, 1000);
        startPolling(selectedChannel.id);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // Input change with slash command autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (val.startsWith('/') && !val.includes(' ')) {
      const matches = SLASH_COMMANDS.filter(c => c.startsWith(val.toLowerCase()));
      setSlashSuggestions(matches);
    } else {
      setSlashSuggestions([]);
    }
  };

  // Keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Tab' && slashSuggestions.length > 0) {
      e.preventDefault();
      setInputText(slashSuggestions[0] + ' ');
      setSlashSuggestions([]);
    }
  };

  const filteredChannels = channels.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group channels
  const discordChannels = filteredChannels.filter(c => c.type === 'discord');
  const otherChannels = filteredChannels.filter(c => c.type !== 'discord');

  return (
    <div className="flex gap-0 h-[calc(100vh-10rem)] rounded-2xl overflow-hidden border border-surface-700/20">
      {/* Left — Channel List */}
      <div className="w-60 flex-shrink-0 flex flex-col bg-surface-900/80 border-r border-surface-700/20">
        {/* Search */}
        <div className="p-3 border-b border-surface-700/20">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a channel..."
              className="w-full pl-8 pr-2 py-1.5 rounded-md bg-surface-800/50 border border-surface-700/30 text-[12px] text-surface-200 placeholder-surface-500 focus:outline-none focus:border-brand-500/30"
            />
          </div>
        </div>

        {/* Channel groups */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {loadingChannels ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-8 rounded-lg" />)}
            </div>
          ) : (
            <>
              {/* Other channels (TUI) */}
              {otherChannels.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider px-2 mb-1.5">System</p>
                  {otherChannels.map(ch => (
                    <ChannelButton key={ch.id} channel={ch} selected={selectedChannel?.id === ch.id} onClick={() => setSelectedChannel(ch)} />
                  ))}
                </div>
              )}

              {/* Discord channels */}
              <div>
                <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider px-2 mb-1.5">Discord</p>
                {discordChannels.map(ch => (
                  <ChannelButton key={ch.id} channel={ch} selected={selectedChannel?.id === ch.id} onClick={() => setSelectedChannel(ch)} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main — Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d0f14]">
        {selectedChannel ? (
          <>
            {/* Channel Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-surface-700/20 bg-surface-900/50">
              <span className={selectedChannel.type === 'discord' ? 'text-[#5865F2]' : 'text-accent-400'}>
                {selectedChannel.type === 'discord' ? <HashIcon className="w-5 h-5" /> : <TerminalIcon className="w-5 h-5" />}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-surface-100">{selectedChannel.name}</h3>
                {selectedChannel.model && (
                  <p className="text-[11px] text-surface-500 font-mono">{selectedChannel.model}</p>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                {selectedChannel.totalTokens > 0 && (
                  <span className="text-surface-500 font-mono">{formatTokens(selectedChannel.totalTokens)} tokens</span>
                )}
                {selectedChannel.active && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </span>
                )}
                <button
                  onClick={() => loadMessages(selectedChannel.id)}
                  className="p-1.5 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-surface-200 transition-colors"
                  title="Refresh messages"
                >
                  <RefreshIcon className={clsx('w-4 h-4', loadingMessages && 'animate-spin')} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
              {loadingMessages ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex gap-3">
                      <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-3 rounded w-32" />
                        <div className="skeleton h-4 rounded w-full" />
                        {i % 2 === 0 && <div className="skeleton h-4 rounded w-3/4" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-sm">
                    <p className="text-[13px] text-red-400 mb-2">Failed to load messages</p>
                    <p className="text-[11px] text-surface-500 break-words">{error}</p>
                    <button onClick={() => loadMessages(selectedChannel.id)} className="btn-ghost text-[12px] mt-3">
                      Try Again
                    </button>
                  </div>
                </div>
              ) : selectedChannel.id === 'main' ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <TerminalIcon className="w-12 h-12 text-surface-700 mx-auto mb-3" />
                    <p className="text-[14px] text-surface-400">TUI Session</p>
                    <p className="text-[12px] text-surface-500 mt-1">Terminal sessions don't support message reading</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <HashIcon className="w-12 h-12 text-surface-700 mx-auto mb-3" />
                    <p className="text-[14px] text-surface-400">No messages in #{selectedChannel.name}</p>
                    <p className="text-[12px] text-surface-500 mt-1">Start a conversation below</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {[...messages, ...localMessages].map((msg, idx, all) => {
                    const prev = all[idx - 1];
                    const sameAuthor = prev?.author?.id === msg.author?.id;
                    const authorName = msg.author?.displayName || msg.author?.username || 'Unknown';
                    const isBot = msg.author?.bot;

                    return (
                      <div key={msg.id} className={clsx('group', !sameAuthor && idx > 0 && 'mt-4')}>
                        {!sameAuthor ? (
                          <div className="flex gap-3 hover:bg-surface-800/20 rounded-lg px-2 py-1.5 -mx-2">
                            {/* Avatar */}
                            <div className={clsx(
                              'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[13px] font-bold',
                              isBot ? 'bg-brand-500/20 text-brand-400' : 'bg-surface-700/50 text-surface-300'
                            )}>
                              {isBot ? '🤖' : authorName[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-0.5">
                                <span className={clsx('text-[13px] font-semibold', isBot ? 'text-brand-300' : userColor(authorName))}>
                                  {authorName}
                                </span>
                                {isBot && <span className="text-[9px] px-1 py-0.5 rounded bg-brand-500/15 text-brand-400 font-bold uppercase">Bot</span>}
                                <span className="text-[10px] text-surface-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {formatTime(msg.timestamp)}
                                </span>
                              </div>
                              <MessageContent content={msg.content} attachments={msg.attachments} />
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-3 hover:bg-surface-800/20 rounded-lg px-2 py-0.5 -mx-2">
                            <div className="w-9 flex-shrink-0 flex items-center justify-center">
                              <span className="text-[10px] text-surface-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {new Date(msg.timestamp || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <MessageContent content={msg.content} attachments={msg.attachments} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Typing indicator */}
                  {thinking && (
                    <div className="flex gap-3 mt-4 px-2 py-2 animate-fade-in">
                      <div className="w-9 h-9 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[13px]">🤖</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-[13px] font-semibold text-brand-300">OpenMarco</span>
                          <span className="text-[9px] px-1 py-0.5 rounded bg-brand-500/15 text-brand-400 font-bold uppercase">Bot</span>
                        </div>
                        <div className="flex items-center gap-1.5 py-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-brand-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 rounded-full bg-brand-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 rounded-full bg-brand-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-[12px] text-surface-500 ml-2 italic">thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            {selectedChannel.type === 'discord' && (
              <div className="px-4 pb-4 pt-1">
                {/* Slash command suggestions */}
                {slashSuggestions.length > 0 && (
                  <div className="mb-2 rounded-lg bg-surface-800/80 border border-surface-700/30 p-1.5 animate-fade-in">
                    {slashSuggestions.map(cmd => (
                      <button
                        key={cmd}
                        onClick={() => { setInputText(cmd + ' '); setSlashSuggestions([]); inputRef.current?.focus(); }}
                        className="w-full text-left px-3 py-1.5 rounded-md hover:bg-surface-700/40 text-[13px] text-surface-300 flex items-center gap-2 transition-colors"
                      >
                        <span className="text-brand-400 font-mono">{cmd}</span>
                        <span className="text-[11px] text-surface-500">
                          {cmd === '/status' && '— Session status'}
                          {cmd === '/help' && '— List commands'}
                          {cmd === '/cron' && '— Cron jobs'}
                          {cmd === '/clear' && '— Clear display'}
                          {cmd === '/skills' && '— List skills'}
                          {cmd === '/model' && '— Current model'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="relative rounded-xl bg-surface-800/60 border border-surface-700/30 focus-within:border-brand-500/30 transition-colors">
                  <div className="flex items-end gap-2 p-2">
                    <button className="p-2 text-surface-400 hover:text-surface-200 transition-colors flex-shrink-0" title="Attach file (coming soon)">
                      <PaperclipIcon className="w-5 h-5" />
                    </button>
                    <textarea
                      ref={inputRef}
                      value={inputText}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder={`Message #${selectedChannel.name}... (type / for commands)`}
                      rows={1}
                      className="flex-1 bg-transparent text-[14px] text-surface-200 placeholder-surface-500 resize-none focus:outline-none py-2 max-h-32"
                      style={{ minHeight: '24px' }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim() || sending}
                      className={clsx(
                        'p-2 rounded-lg transition-all flex-shrink-0',
                        inputText.trim() && !sending
                          ? 'bg-brand-500 text-white hover:bg-brand-600'
                          : 'text-surface-600 cursor-not-allowed'
                      )}
                    >
                      <SendIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-surface-600 mt-1.5 px-2">
                  Enter to send • Shift+Enter for new line • Type <span className="text-brand-400/60">/</span> for commands • Sent as OpenMarco
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <HashIcon className="w-12 h-12 text-surface-700 mx-auto mb-3" />
              <p className="text-[14px] text-surface-400">Select a channel</p>
            </div>
          </div>
        )}
      </div>

      {/* Right — Channel Info */}
      {selectedChannel && (
        <div className="w-56 flex-shrink-0 bg-surface-900/60 border-l border-surface-700/20 p-4 overflow-y-auto scrollbar-thin hidden xl:block">
          <h4 className="text-[11px] font-bold text-surface-500 uppercase tracking-wider mb-3">Channel Info</h4>
          <div className="space-y-2.5">
            <InfoRow label="Name" value={`#${selectedChannel.name}`} />
            <InfoRow label="Type" value={selectedChannel.type} />
            <InfoRow label="ID" value={selectedChannel.id} mono small />
            {selectedChannel.model && <InfoRow label="Model" value={selectedChannel.model} accent />}
            {selectedChannel.lastTime && (
              <InfoRow label="Last message" value={new Date(selectedChannel.lastTime).toLocaleString()} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-components

function ChannelButton({ channel, selected, onClick }: { channel: ChannelInfo; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-left transition-all',
        selected
          ? 'bg-surface-700/40 text-surface-100'
          : 'text-surface-300 hover:bg-surface-800/40 hover:text-surface-100'
      )}
    >
      {channel.emoji ? (
        <span className="text-[14px] flex-shrink-0 w-5 text-center">{channel.emoji}</span>
      ) : channel.type === 'discord' ? (
        <HashIcon className="w-4 h-4 flex-shrink-0 text-surface-500" />
      ) : (
        <TerminalIcon className="w-4 h-4 flex-shrink-0 text-accent-500" />
      )}
      <div className="flex-1 min-w-0">
        <span className="text-[13px] truncate block">{channel.name}</span>
        {channel.lastMessage && !selected && (
          <span className="text-[10px] text-surface-500 truncate block">{channel.lastMessage}</span>
        )}
      </div>
    </button>
  );
}

function MessageContent({ content, attachments }: { content?: string; attachments?: any[] }) {
  return (
    <div>
      {content && (
        <p className="text-[14px] text-surface-200 whitespace-pre-wrap break-words leading-relaxed">{content}</p>
      )}
      {attachments && attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {attachments.map((att: any, i: number) => (
            <a
              key={i}
              href={att.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-800/50 border border-surface-700/20 text-[12px] text-brand-400 hover:text-brand-300 hover:border-brand-500/20 transition-colors"
            >
              <PaperclipIcon className="w-3 h-3" />
              {att.filename || `Attachment ${i + 1}`}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, mono, small, accent, className }: {
  label: string;
  value: string;
  mono?: boolean;
  small?: boolean;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-surface-500 uppercase tracking-wider">{label}</span>
      <span className={clsx(
        'text-[12px] break-all',
        mono && 'font-mono',
        small && 'text-[10px]',
        accent ? 'text-brand-300' : 'text-surface-300',
        className,
      )}>
        {value}
      </span>
    </div>
  );
}
