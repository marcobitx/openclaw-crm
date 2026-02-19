// src/components/AnalyticsView.tsx
// Usage stats + charts with recharts

import { useState } from 'react';
import { clsx } from 'clsx';
import {
  BarChart3, TrendingUp, Coins, Clock, Cpu,
  AreaChart as AreaChartIcon,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import GlassCard from './common/GlassCard';

// Mock data — shown when no analytics API is available
const MOCK_TOKEN_USAGE = [
  { date: 'Feb 12', tokens: 45000, cost: 1.35 },
  { date: 'Feb 13', tokens: 62000, cost: 1.86 },
  { date: 'Feb 14', tokens: 38000, cost: 1.14 },
  { date: 'Feb 15', tokens: 0, cost: 0 },
  { date: 'Feb 16', tokens: 0, cost: 0 },
  { date: 'Feb 17', tokens: 78000, cost: 2.34 },
  { date: 'Feb 18', tokens: 95000, cost: 2.85 },
  { date: 'Feb 19', tokens: 120000, cost: 3.60 },
  { date: 'Feb 20', tokens: 85000, cost: 2.55 },
];

const MOCK_SESSIONS = [
  { date: 'Feb 12', count: 8 },
  { date: 'Feb 13', count: 12 },
  { date: 'Feb 14', count: 6 },
  { date: 'Feb 15', count: 0 },
  { date: 'Feb 16', count: 0 },
  { date: 'Feb 17', count: 15 },
  { date: 'Feb 18', count: 22 },
  { date: 'Feb 19', count: 28 },
  { date: 'Feb 20', count: 18 },
];

const MOCK_MODELS = [
  { model: 'claude-sonnet-4-6', tokens: 320000, percentage: 60 },
  { model: 'claude-opus-4-6', tokens: 180000, percentage: 34 },
  { model: 'claude-haiku-4-5', tokens: 23000, percentage: 4 },
  { model: 'minimax-m2.5', tokens: 10000, percentage: 2 },
];

const PIE_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-[12px]">
      <p className="text-surface-300 font-semibold mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsView() {
  const totalTokens = MOCK_TOKEN_USAGE.reduce((sum, d) => sum + d.tokens, 0);
  const totalCost = MOCK_TOKEN_USAGE.reduce((sum, d) => sum + d.cost, 0);
  const totalSessions = MOCK_SESSIONS.reduce((sum, d) => sum + d.count, 0);

  const statCards = [
    { label: 'Total Tokens', value: `${(totalTokens / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-brand-400', bg: 'bg-brand-500/10' },
    { label: 'Total Cost', value: `$${totalCost.toFixed(2)}`, icon: Coins, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Sessions', value: totalSessions, icon: BarChart3, color: 'text-accent-400', bg: 'bg-accent-500/10' },
    { label: 'Avg Duration', value: '4.2m', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <GlassCard padding="p-3" className="border-accent-500/20 bg-accent-500/5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-accent-400 flex-shrink-0" />
          <p className="text-[12px] text-accent-300">
            <strong>Sample data shown.</strong> Connect the analytics API for live usage metrics.
          </p>
        </div>
      </GlassCard>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <GlassCard key={card.label} className={clsx('animate-stagger', `animate-stagger-${i + 1}`)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">{card.label}</p>
                  <p className="text-xl font-bold text-surface-100 mt-1">{card.value}</p>
                </div>
                <div className={clsx('p-2 rounded-xl', card.bg)}>
                  <Icon className={clsx('w-4 h-4', card.color)} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Token Usage Chart */}
        <GlassCard>
          <h3 className="text-[14px] font-bold text-surface-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            Token Usage
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MOCK_TOKEN_USAGE}>
              <defs>
                <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.3)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="tokens" stroke="#6366f1" fill="url(#tokenGrad)" strokeWidth={2} name="Tokens" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Sessions Per Day */}
        <GlassCard>
          <h3 className="text-[14px] font-bold text-surface-100 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent-400" />
            Sessions Per Day
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={MOCK_SESSIONS}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.3)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Model Breakdown */}
        <GlassCard>
          <h3 className="text-[14px] font-bold text-surface-100 mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Model Breakdown
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={MOCK_MODELS}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="percentage"
                  nameKey="model"
                  stroke="none"
                >
                  {MOCK_MODELS.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {MOCK_MODELS.map((m, i) => (
                <div key={m.model} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-[12px] text-surface-300 flex-1 truncate">{m.model}</span>
                  <span className="text-[12px] text-surface-400 font-mono">{m.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Cost Breakdown */}
        <GlassCard>
          <h3 className="text-[14px] font-bold text-surface-100 mb-4 flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            Daily Cost
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_TOKEN_USAGE}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.3)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cost" stroke="#10b981" fill="url(#costGrad)" strokeWidth={2} name="Cost ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </div>
  );
}
