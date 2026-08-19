import React from 'react';
import { formatKesCompact } from '../utils/format';

export default function AuditSummaryCard({ invoice, totalInflationAmount }) {
  const critical = (invoice.overallRiskScore || 0) > 75;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="md:col-span-2 bg-surface-container-low border border-outline-variant p-4 rounded-DEFAULT">
        <span className="font-data-label text-data-label text-on-surface-variant uppercase block mb-2">Executive Summary</span>
        <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
          Forensic model detects{' '}
          {critical ? <strong className="text-error">catastrophic price inflation</strong> : <strong>pricing variance</strong>}{' '}
          across supplied items for {invoice.vendorName}. {invoice.summaryNotes}
        </p>
      </div>
      <div className="bg-surface-container-low border border-outline-variant p-4 rounded-DEFAULT flex flex-col justify-between">
        <span className="font-data-label text-data-label text-on-surface-variant uppercase block">Total Variance</span>
        <div className="text-error font-data-mono text-[24px] font-bold mt-2">
          +{formatKesCompact(totalInflationAmount)}
        </div>
        <div className="flex items-center gap-1 mt-auto">
          <span className="w-2 h-2 rounded-full bg-error"></span>
          <span className="font-data-label text-data-label text-on-surface">
            {critical ? 'Immediate Action Required' : 'Review Recommended'}
          </span>
        </div>
      </div>
    </div>
  );
}