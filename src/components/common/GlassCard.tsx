// src/components/common/GlassCard.tsx
// Reusable glass card component with Arctic Indigo styling

import { clsx } from 'clsx';

interface Props {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className, hover = false, padding = 'p-5', onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'glass-card',
        hover && 'glass-card-hover cursor-pointer',
        padding,
        'transition-all duration-200',
        className,
      )}
    >
      {children}
    </div>
  );
}
