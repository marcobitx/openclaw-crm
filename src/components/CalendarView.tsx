// src/components/CalendarView.tsx
// Calendar visualization — month grid with cron jobs plotted

import { useEffect, useState, useMemo } from 'react';
import { clsx } from 'clsx';
import {
  CustomChevronLeft,
  CustomChevronRight,
  CustomCalendar,
  CustomClock
} from './common/CustomIcons';
import GlassCard from './common/GlassCard';

interface CronJob {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const CRON_COLORS = [
  'bg-brand-400', 'bg-accent-400', 'bg-emerald-400',
  'bg-amber-400', 'bg-pink-400', 'bg-violet-400',
];

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  useEffect(() => {
    fetch('/api/cron')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setJobs(data); })
      .catch(console.error);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const today = () => setCurrentDate(new Date());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [firstDayOfWeek, daysInMonth]);

  const isToday = (day: number) => {
    const now = new Date();
    return day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
  };

  // Simple cron schedule → day matching (for display purposes)
  const getJobsForDay = (day: number): CronJob[] => {
    return jobs.filter(job => {
      if (!job.enabled) return false;
      const parts = job.schedule.split(' ');
      if (parts.length < 5) return true; // show all if can't parse
      const dayOfMonth = parts[2];
      const dayOfWeek = parts[4];
      // Every day
      if (dayOfMonth === '*' && dayOfWeek === '*') return true;
      // Specific day of month
      if (dayOfMonth !== '*' && parseInt(dayOfMonth) === day) return true;
      // Specific day of week
      if (dayOfWeek !== '*') {
        const d = new Date(year, month, day).getDay();
        return parseInt(dayOfWeek) === d;
      }
      return false;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-surface-100">{MONTHS[month]} {year}</h2>
          <button onClick={today} className="btn-ghost text-[11px]">Today</button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-surface-800/50 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('month')}
              className={clsx('px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all',
                viewMode === 'month' ? 'bg-brand-500/15 text-brand-300' : 'text-surface-400 hover:text-surface-200')}
            >Month</button>
            <button
              onClick={() => setViewMode('week')}
              className={clsx('px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all',
                viewMode === 'week' ? 'bg-brand-500/15 text-brand-300' : 'text-surface-400 hover:text-surface-200')}
            >Week</button>
          </div>
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-surface-200">
            <CustomChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-surface-800/50 text-surface-400 hover:text-surface-200">
            <CustomChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Calendar Grid */}
        <GlassCard padding="p-4" className="flex-1">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-[11px] font-semibold text-surface-500 uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={i} className="h-20" />;
              const dayJobs = getJobsForDay(day);
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={clsx(
                    'h-20 rounded-lg p-2 text-left transition-all',
                    isToday(day) && 'ring-1 ring-brand-500/40',
                    selectedDay === day ? 'bg-brand-500/10 border border-brand-500/20' : 'hover:bg-surface-800/40 border border-transparent',
                  )}
                >
                  <span className={clsx(
                    'text-[13px] font-semibold',
                    isToday(day) ? 'text-brand-400' : 'text-surface-300',
                  )}>
                    {day}
                  </span>
                  {dayJobs.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mt-1">
                      {dayJobs.slice(0, 3).map((job, j) => (
                        <div
                          key={job.id}
                          className={clsx('w-1.5 h-1.5 rounded-full', CRON_COLORS[j % CRON_COLORS.length])}
                          title={job.name}
                        />
                      ))}
                      {dayJobs.length > 3 && (
                        <span className="text-[9px] text-surface-500">+{dayJobs.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Selected Day Detail */}
        <div className="w-72 flex-shrink-0">
          <GlassCard padding="p-4" className="h-full">
            <h3 className="text-[12px] font-bold text-surface-400 uppercase tracking-wider mb-3">
              {selectedDay ? `${MONTHS[month]} ${selectedDay}` : 'Select a day'}
            </h3>
            {selectedDay ? (
              <div className="space-y-2">
                {getJobsForDay(selectedDay).length > 0 ? (
                  getJobsForDay(selectedDay).map((job, j) => (
                    <div key={job.id} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-surface-800/30">
                      <div className={clsx('w-2 h-2 rounded-full', CRON_COLORS[j % CRON_COLORS.length])} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-surface-200 truncate">{job.name}</p>
                        <p className="text-[10px] font-mono text-surface-500">{job.schedule}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-surface-500">No cron jobs scheduled</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <CustomCalendar className="w-8 h-8 text-surface-700" />
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Cron Legend */}
      {jobs.length > 0 && (
        <GlassCard padding="p-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[11px] font-semibold text-surface-500 uppercase tracking-wider">Active Crons:</span>
            {jobs.filter(j => j.enabled).map((job, i) => (
              <div key={job.id} className="flex items-center gap-1.5">
                <div className={clsx('w-2 h-2 rounded-full', CRON_COLORS[i % CRON_COLORS.length])} />
                <span className="text-[11px] text-surface-300">{job.name}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
