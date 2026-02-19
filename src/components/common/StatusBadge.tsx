// src/components/common/StatusBadge.tsx
// Status pill component (active/disabled/error/warning)

import { clsx } from 'clsx';

type Status = 'active' | 'disabled' | 'error' | 'warning' | 'info';

interface Props {
  status: Status;
  label?: string;
  size?: 'sm' | 'md';
}

const STATUS_STYLES: Record<Status, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  disabled: 'bg-surface-500/10 text-surface-400 border-surface-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  info: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
};

const STATUS_LABELS: Record<Status, string> = {
  active: 'Active',
  disabled: 'Disabled',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

export default function StatusBadge({ status, label, size = 'sm' }: Props) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 border rounded-full font-semibold',
      STATUS_STYLES[status],
      size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-[12px]',
    )}>
      <span className={clsx(
        'rounded-full',
        size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
        status === 'active' && 'bg-emerald-400',
        status === 'disabled' && 'bg-surface-500',
        status === 'error' && 'bg-red-400',
        status === 'warning' && 'bg-amber-400',
        status === 'info' && 'bg-accent-400',
      )} />
      {label || STATUS_LABELS[status]}
    </span>
  );
}
