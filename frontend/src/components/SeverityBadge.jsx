import React from 'react';
import { severityOf } from '../utils/format';

export default function SeverityBadge({ level }) {
  const severity = severityOf(level);
  const base = 'px-1.5 py-0.5 rounded-sm font-data-label text-[9px] uppercase tracking-wider inline-block';

  if (severity === 'CRITICAL') {
    return <span className={`${base} border border-error text-error bg-error/10`}>Critical</span>;
  }
  if (severity === 'ELEVATED') {
    return <span className={`${base} border border-surface-tint text-surface-tint bg-surface-tint/10`}>Elevated</span>;
  }
  return <span className={`${base} border border-outline text-on-surface-variant`}>Normal</span>;
}