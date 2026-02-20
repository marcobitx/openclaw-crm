// src/components/CronView.tsx
// Cron jobs management — table view with detail panel

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import {
  CustomClock,
  CustomPlay,
  CustomPower,
  CustomPowerOff,
  CustomX,
  CustomRefresh
} from './common/CustomIcons';
import GlassCard from './common/GlassCard';
import StatusBadge from './common/StatusBadge';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  scheduleRaw: any;
  enabled: boolean;
  status: string;
  lastRun: string | null;
  nextRun: string | null;
  lastStatus: string | null;
  lastDurationMs: number | null;
  lastError: string | null;
  consecutiveErrors: number;
  payload: any;
  delivery: any;
  sessionTarget: string | null;
  model: string | null;
  agentId: string | null;
}

function formatDuration(ms: number | null): string {
  if (!ms) return '—';
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}min`;
}

function timeAgo(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function timeUntil(iso: string | null): string {
  if (!iso) return '—';
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return 'overdue';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '< 1 min';
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `in ${hours}h`;
  const days = Math.floor(hours / 24);
  return `in ${days}d`;
}

export default function CronView() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<CronJob | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadJobs = () => {
    setLoading(true);
    fetch('/api/cron')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data);
          // Update selected if it still exists
          if (selectedJob) {
            const updated = data.find((j: CronJob) => j.id === selectedJob.id);
            if (updated) setSelectedJob(updated);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadJobs(); }, []);

  const handleToggle = async (id: string) => {
    setActionLoading(id);
    try {
      await fetch('/api/cron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', id }),
      });
      loadJobs();
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTrigger = async (id: string) => {
    setActionLoading(id);
    try {
      await fetch('/api/cron', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger', id }),
      });
      setTimeout(loadJobs, 2000); // Reload after a brief delay
    } catch (err) {
      console.error('Trigger failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return '—';
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)]">
      {/* Main — Table */}
      <div className={clsx('overflow-y-auto scrollbar-thin', selectedJob ? 'flex-1' : 'w-full')}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-surface-100">Cron Jobs</h2>
            <p className="text-[12px] text-surface-500 mt-0.5">{jobs.length} jobs ({jobs.filter(j => j.enabled).length} active)</p>
          </div>
          <button onClick={loadJobs} className="btn-ghost flex items-center gap-1.5">
            <CustomRefresh className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {jobs.length === 0 ? (
          <GlassCard className="flex items-center justify-center py-12">
            <div className="text-center">
              <CustomClock className="w-12 h-12 text-surface-700 mx-auto mb-3" />
              <p className="text-[14px] text-surface-400">No cron jobs found</p>
              <p className="text-[12px] text-surface-500 mt-1">Gateway may be offline or no jobs configured</p>
            </div>
          </GlassCard>
        ) : (
          <GlassCard padding="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700/20">
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Name</th>
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Schedule</th>
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Last Run</th>
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Next</th>
                  <th className="text-right py-3 px-4 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={clsx(
                      'border-b border-surface-800/30 cursor-pointer transition-colors',
                      selectedJob?.id === job.id ? 'bg-brand-500/5' : 'hover:bg-surface-800/30',
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <CustomClock className={clsx('w-3.5 h-3.5', job.enabled ? 'text-brand-400' : 'text-surface-600')} />
                        <div>
                          <span className={clsx('text-[13px] font-medium', job.enabled ? 'text-surface-200' : 'text-surface-500')}>
                            {job.name}
                          </span>
                          {job.model && (
                            <p className="text-[10px] font-mono text-surface-500">{job.model.split('/').pop()}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[12px] font-mono text-surface-400">{job.schedule}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge
                          status={!job.enabled ? 'disabled' : job.consecutiveErrors > 0 ? 'error' : 'active'}
                          label={!job.enabled ? 'Off' : job.consecutiveErrors > 0 ? `${job.consecutiveErrors} errors` : 'OK'}
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="text-[12px] text-surface-400">{timeAgo(job.lastRun)}</span>
                        {job.lastDurationMs && (
                          <p className="text-[10px] text-surface-500">{formatDuration(job.lastDurationMs)}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={clsx('text-[12px]', job.enabled ? 'text-surface-300' : 'text-surface-600')}>
                        {job.enabled ? timeUntil(job.nextRun) : '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleTrigger(job.id); }}
                          disabled={actionLoading === job.id}
                          className="p-1.5 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-emerald-400 transition-colors disabled:opacity-50"
                          title="Trigger now"
                        >
                          <CustomPlay className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggle(job.id); }}
                          disabled={actionLoading === job.id}
                          className="p-1.5 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-amber-400 transition-colors disabled:opacity-50"
                          title={job.enabled ? 'Disable' : 'Enable'}
                        >
                          {job.enabled ? <CustomPowerOff className="w-3.5 h-3.5" /> : <CustomPower className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        )}
      </div>

      {/* Right Panel — Detail */}
      {selectedJob && (
        <div className="w-80 flex-shrink-0 overflow-y-auto scrollbar-thin">
          <GlassCard padding="p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/20">
              <h3 className="text-[14px] font-bold text-surface-100 truncate pr-2">{selectedJob.name}</h3>
              <button onClick={() => setSelectedJob(null)} className="p-1 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-surface-200 flex-shrink-0">
                <CustomX className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">ID</span>
                <span className="text-[10px] font-mono text-surface-500 truncate max-w-[140px]">{selectedJob.id}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Schedule</span>
                <span className="text-[11px] font-mono text-surface-200">{selectedJob.schedule}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Status</span>
                <StatusBadge status={selectedJob.enabled ? (selectedJob.consecutiveErrors > 0 ? 'error' : 'active') : 'disabled'} />
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Model</span>
                <span className="text-[11px] font-mono text-brand-300">{selectedJob.model || 'default'}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Session</span>
                <span className="text-[11px] text-surface-300">{selectedJob.sessionTarget || 'main'}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Last Run</span>
                <span className="text-[11px] text-surface-200">{formatDate(selectedJob.lastRun)}</span>
              </div>
              {selectedJob.lastDurationMs && (
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                  <span className="text-[12px] text-surface-400">Duration</span>
                  <span className="text-[11px] text-surface-200">{formatDuration(selectedJob.lastDurationMs)}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Next Run</span>
                <span className="text-[11px] text-surface-200">{formatDate(selectedJob.nextRun)}</span>
              </div>

              {/* Error display */}
              {selectedJob.lastError && (
                <div className="mt-2">
                  <p className="text-[11px] text-red-400 font-semibold mb-1">
                    Last Error ({selectedJob.consecutiveErrors}x consecutive)
                  </p>
                  <pre className="text-[10px] font-mono text-red-300/70 bg-red-500/5 border border-red-500/10 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                    {selectedJob.lastError}
                  </pre>
                </div>
              )}

              {/* Payload */}
              {selectedJob.payload && (
                <div className="mt-2">
                  <p className="text-[11px] text-surface-400 mb-1">Payload</p>
                  <pre className="text-[10px] font-mono text-surface-300 bg-surface-800/50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                    {selectedJob.payload?.message || JSON.stringify(selectedJob.payload, null, 2)}
                  </pre>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleTrigger(selectedJob.id)}
                  disabled={actionLoading === selectedJob.id}
                  className="flex-1 btn-primary text-[12px] py-2 disabled:opacity-50"
                >
                  Run Now
                </button>
                <button
                  onClick={() => handleToggle(selectedJob.id)}
                  disabled={actionLoading === selectedJob.id}
                  className="flex-1 btn-secondary text-[12px] py-2 disabled:opacity-50"
                >
                  {selectedJob.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
