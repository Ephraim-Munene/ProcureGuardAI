import React from 'react';

export default function MetricCard({ label, value, tone = 'default', progress = null, icon = null }) {
  const isError = tone === 'error';

  return (
    <div className={`bg-surface-container-low border border-outline-variant p-4 flex flex-col justify-between ${
      isError ? 'border-t-2 border-t-error' : ''
    }`}>
      <span className={`font-data-label text-data-label text-on-surface-variant uppercase tracking-wider flex justify-between items-center w-full ${
        isError ? 'text-error' : ''
      }`}>
        {label}
        {icon && <span className={isError ? 'text-error' : 'text-on-surface-variant'}>{icon}</span>}
      </span>
      {progress === null ? (
        <span className={`font-data-mono text-data-mono text-xl mt-2 ${isError ? 'text-error' : 'text-on-surface'}`}>
          {value}
        </span>
      ) : (
        <div className="mt-2 flex items-center space-x-2 w-full">
          <span className={`font-data-mono text-data-mono text-xl ${isError ? 'text-error' : 'text-on-surface'}`}>{value}</span>
          <div className="h-1 bg-surface-container-high flex-1 rounded-full overflow-hidden">
            <div className={`h-full ${isError ? 'bg-error' : 'bg-surface-tint'}`} style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );
}