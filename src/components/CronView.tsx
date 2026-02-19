// src/components/CronView.tsx
// Cron jobs management — table view with detail panel

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Clock, Play, Power, PowerOff, ChevronRight, X, RefreshCw, AlertCircle } from 'lucide-react';
import GlassCard from './common/GlassCard';
import StatusBadge from './common/StatusBadge';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  scheduleHuman: string;
  enabled: boolean;
  lastRun: string | null;
  nextRun: string | null;
  payload?: any;
  status: string;
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
      .then(data => { if (Array.isArray(data)) setJobs(data); })
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
      loadJobs();
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
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-surface-100">Cron Jobs</h2>
          <button onClick={loadJobs} className="btn-ghost flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {jobs.length === 0 ? (
          <GlassCard className="flex items-center justify-center py-12">
            <div className="text-center">
              <Clock className="w-12 h-12 text-surface-700 mx-auto mb-3" />
              <p className="text-[14px] text-surface-400">No cron jobs found</p>
              <p className="text-[12px] text-surface-500 mt-1">Gateway may be offline</p>
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
                  <th className="text-left py-3 px-4 text-[11px] font-semibold text-surface-400 uppercase tracking-wider">Next Run</th>
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
                        <Clock className="w-3.5 h-3.5 text-surface-500" />
                        <span className="text-[13px] font-medium text-surface-200">{job.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[12px] font-mono text-surface-400">{job.scheduleHuman || job.schedule}</span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge
                        status={job.enabled ? (job.status === 'failed' ? 'error' : 'active') : 'disabled'}
                      />
                    </td>
                    <td className="py-3 px-4 text-[12px] text-surface-400">{formatDate(job.lastRun)}</td>
                    <td className="py-3 px-4 text-[12px] text-surface-400">{formatDate(job.nextRun)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleTrigger(job.id); }}
                          disabled={actionLoading === job.id}
                          className="p-1.5 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-emerald-400 transition-colors"
                          title="Trigger now"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleToggle(job.id); }}
                          disabled={actionLoading === job.id}
                          className="p-1.5 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-amber-400 transition-colors"
                          title={job.enabled ? 'Disable' : 'Enable'}
                        >
                          {job.enabled ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
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
              <h3 className="text-[14px] font-bold text-surface-100">{selectedJob.name}</h3>
              <button onClick={() => setSelectedJob(null)} className="p-1 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-surface-200">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Schedule</span>
                <span className="text-[12px] font-mono text-surface-200">{selectedJob.schedule}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Status</span>
                <StatusBadge status={selectedJob.enabled ? 'active' : 'disabled'} />
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Last Run</span>
                <span className="text-[12px] text-surface-200">{formatDate(selectedJob.lastRun)}</span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-800/30">
                <span className="text-[12px] text-surface-400">Next Run</span>
                <span className="text-[12px] text-surface-200">{formatDate(selectedJob.nextRun)}</span>
              </div>
              {selectedJob.payload && (
                <div>
                  <p className="text-[12px] text-surface-400 mb-2">Payload</p>
                  <pre className="text-[11px] font-mono text-surface-300 bg-surface-800/50 rounded-lg p-3 overflow-x-auto">
                    {typeof selectedJob.payload === 'string' ? selectedJob.payload : JSON.stringify(selectedJob.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
