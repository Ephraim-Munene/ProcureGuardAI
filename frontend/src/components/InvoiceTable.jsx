import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import SeverityBadge from './SeverityBadge';
import { deriveDepartment, severityOf, flagLabel, formatKesCompact } from '../utils/format';

const SEVERITY_OPTIONS = [
  { value: 'ALL', label: 'All Severities' },
  { value: 'CRITICAL', label: 'Critical' },
  { value: 'ELEVATED', label: 'Elevated' },
  { value: 'NORMAL', label: 'Normal' },
];

const DOT_COLOR = {
  CRITICAL: 'bg-error',
  ELEVATED: 'bg-surface-tint',
  NORMAL: 'bg-outline-variant',
};

export default function InvoiceTable({ invoices, loading, onNavigate }) {
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('ALL');

  const filtered = invoices.filter((inv) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      (inv.vendorName || '').toLowerCase().includes(q) ||
      (inv.invoiceNumber || '').toLowerCase().includes(q);
    const matchesSeverity = severity === 'ALL' || severityOf(inv.riskLevel) === severity;
    return matchesQuery && matchesSeverity;
  });

  return (
    <div className="flex-[0.65] bg-surface-container-low border border-outline-variant flex flex-col overflow-hidden relative min-w-0">
      <div className="p-3 border-b border-outline-variant flex justify-between items-center bg-surface-container-low z-10 sticky top-0">
        <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
          <SlidersHorizontal className="text-[18px]" />
          Live Audit Registry
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter records..."
            className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 w-44 focus:border-primary focus:ring-0 focus:outline-none placeholder:text-on-surface-variant"
          />
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 focus:border-primary focus:ring-0 focus:outline-none cursor-pointer"
          >
            {SEVERITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button className="bg-surface-container-high text-on-surface font-body-sm text-body-sm px-3 py-1 hover:bg-surface-container-highest transition-colors flex items-center gap-1">
            <Search className="text-[16px]" />
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-3 text-on-surface-variant">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-data-mono text-data-mono text-sm">Querying secure forensic ledger...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center">
          <p className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider mb-2">No records found</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No audited invoices match the current filter.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low z-10 font-data-label text-data-label text-on-surface-variant uppercase border-b border-outline-variant">
              <tr>
                <th className="p-2 pl-4 w-8">Status</th>
                <th className="p-2">Invoice #</th>
                <th className="p-2">Vendor</th>
                <th className="p-2">Dept</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2">Flag</th>
                <th className="p-2 pr-4">Severity</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono divide-y divide-outline-variant/50">
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => onNavigate(inv.id)}
                  className="h-table-row-height hover:bg-surface-container-high cursor-pointer transition-colors group"
                >
                  <td className="p-2 pl-4">
                    <div className={`w-2 h-2 rounded-full ${DOT_COLOR[severityOf(inv.riskLevel)]}`}></div>
                  </td>
                  <td className="p-2 text-on-surface">{inv.invoiceNumber}</td>
                  <td className="p-2 text-on-surface-variant group-hover:text-on-surface transition-colors truncate max-w-[140px]">
                    {inv.vendorName}
                  </td>
                  <td className="p-2 text-on-surface-variant">{deriveDepartment(inv.vendorName)}</td>
                  <td className="p-2 text-right text-on-surface">{formatKesCompact(inv.totalAmountKes)}</td>
                  <td className={`p-2 text-[11px] ${severityOf(inv.riskLevel) === 'CRITICAL' ? 'text-error' : 'text-on-surface-variant'}`}>
                    {flagLabel(inv)}
                  </td>
                  <td className="p-2 pr-4">
                    <SeverityBadge level={inv.riskLevel} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}