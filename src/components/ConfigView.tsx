// src/components/ConfigView.tsx
// JSON tree viewer with syntax highlighting — read-only

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Settings, Copy, Check, ChevronRight, ChevronDown, AlertTriangle, Lock } from 'lucide-react';
import GlassCard from './common/GlassCard';

export default function ConfigView() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['root']));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(data => setConfig(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleKey = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard may not be available */ }
  };

  const renderValue = (value: any, path: string, depth: number): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-surface-500 italic">null</span>;
    }

    if (typeof value === 'string') {
      if (value.includes('REDACTED')) {
        return <span className="text-red-400/60 font-mono text-[12px]">{value}</span>;
      }
      return <span className="text-emerald-400 font-mono text-[12px]">"{value}"</span>;
    }

    if (typeof value === 'number') {
      return <span className="text-amber-400 font-mono text-[12px]">{value}</span>;
    }

    if (typeof value === 'boolean') {
      return <span className={clsx('font-mono text-[12px]', value ? 'text-emerald-400' : 'text-red-400')}>{String(value)}</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedKeys.has(path);
      if (value.length === 0) return <span className="text-surface-500 font-mono text-[12px]">[]</span>;

      return (
        <div>
          <button onClick={() => toggleKey(path)} className="inline-flex items-center gap-1 text-surface-400 hover:text-surface-200">
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <span className="text-[11px] text-surface-500">[{value.length} items]</span>
          </button>
          {isExpanded && (
            <div className="ml-4 border-l border-surface-700/20 pl-3 mt-1 space-y-1">
              {value.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-surface-600 font-mono text-[11px] flex-shrink-0">{i}:</span>
                  {renderValue(item, `${path}.${i}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === 'object') {
      const keys = Object.keys(value);
      const isExpanded = expandedKeys.has(path);
      if (keys.length === 0) return <span className="text-surface-500 font-mono text-[12px]">{'{}'}</span>;

      return (
        <div>
          <button onClick={() => toggleKey(path)} className="inline-flex items-center gap-1 text-surface-400 hover:text-surface-200">
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            <span className="text-[11px] text-surface-500">{'{'}...{'}'} {keys.length} keys</span>
          </button>
          {isExpanded && (
            <div className="ml-4 border-l border-surface-700/20 pl-3 mt-1 space-y-1">
              {keys.map(key => (
                <div key={key} className="flex items-start gap-2">
                  <span className="text-brand-300 font-mono text-[12px] flex-shrink-0">"{key}":</span>
                  {renderValue(value[key], `${path}.${key}`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span className="text-surface-300 font-mono text-[12px]">{String(value)}</span>;
  };

  if (loading) {
    return <div className="skeleton h-96 rounded-xl" />;
  }

  return (
    <div className="space-y-4">
      {/* Safety Banner */}
      <GlassCard padding="p-3" className="border-amber-500/20 bg-amber-500/5">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-[12px] text-amber-300">
            <strong>Read-only view.</strong> Config changes should be made via the OpenClaw CLI or gateway tools.
          </p>
        </div>
      </GlassCard>

      {/* Config Tree */}
      <GlassCard padding="p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/20">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-400" />
            <h3 className="text-[14px] font-bold text-surface-100">Gateway Configuration</h3>
          </div>
          <button onClick={copyToClipboard} className="btn-ghost flex items-center gap-1.5">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
        </div>
        <div className="p-4 overflow-x-auto scrollbar-thin max-h-[calc(100vh-16rem)]">
          {config ? renderValue(config, 'root', 0) : (
            <div className="flex items-center gap-2 text-[13px] text-surface-400">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Failed to load configuration
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
