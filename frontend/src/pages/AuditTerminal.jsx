import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, CheckCircle2, Gavel, Search, RefreshCw } from 'lucide-react';
import { fetchInvoices, updateInvoiceStatus } from '../api/client';
import SeverityBadge from '../components/SeverityBadge';
import { formatKesCompact, deriveDepartment } from '../utils/format';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'FLAGGED', label: 'Flagged' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLEAN', label: 'Clean' },
];

export default function AuditTerminal() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [actingId, setActingId] = useState(null);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await fetchInvoices();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to load invoices:', err);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleStatus = async (id, newStatus) => {
    setActingId(id);
    try {
      const res = await updateInvoiceStatus(id, newStatus);
      if (res && res.invoice) {
        setInvoices((prev) => prev.map((inv) => (inv.id === id ? res.invoice : inv)));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActingId(null);
    }
  };

  const filtered = invoices.filter((inv) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      (inv.vendorName || '').toLowerCase().includes(q) ||
      (inv.invoiceNumber || '').toLowerCase().includes(q);
    const matchesStatus = status === 'ALL' || inv.status === status;
    return matchesQuery && matchesStatus;
  });

  const counts = {
    FLAGGED: invoices.filter((i) => i.status === 'FLAGGED').length,
    RESOLVED: invoices.filter((i) => i.status === 'RESOLVED').length,
    CLEAN: invoices.filter((i) => i.status === 'CLEAN').length,
  };

  return (
    <div className="flex-1 flex flex-col p-gutter gap-gutter overflow-hidden min-h-[500px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Terminal className="text-[20px] text-primary" />
          <h1 className="font-headline-md text-headline-md text-on-surface">Audit Terminal</h1>
          <span className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider">
            {invoices.length} records · {counts.FLAGGED} flagged · {counts.RESOLVED} resolved
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vendor or invoice..."
            className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 w-56 focus:border-primary focus:ring-0 focus:outline-none placeholder:text-on-surface-variant"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 focus:border-primary focus:ring-0 focus:outline-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={loadInvoices}
            className="bg-surface-container-high text-on-surface font-body-sm text-body-sm px-3 py-1 hover:bg-surface-container-highest transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="text-[16px]" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center space-y-3 text-on-surface-variant">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-data-mono text-data-mono text-sm">Querying audit ledger...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center">
          <p className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider mb-2">No records found</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            No audited invoices match the current filter.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-surface-container-low border border-outline-variant">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low z-10 font-data-label text-data-label text-on-surface-variant uppercase border-b border-outline-variant">
              <tr>
                <th className="p-2 pl-4">Status</th>
                <th className="p-2">Invoice #</th>
                <th className="p-2">Vendor</th>
                <th className="p-2">Dept</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2 text-right">Risk</th>
                <th className="p-2">Severity</th>
                <th className="p-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono divide-y divide-outline-variant/50">
              {filtered.map((inv) => {
                const acting = actingId === inv.id;
                return (
                  <tr key={inv.id} className="h-table-row-height hover:bg-surface-container-high transition-colors group">
                    <td className="p-2 pl-4">
                      <span
                        className={`px-1.5 py-0.5 rounded-sm font-data-label text-[9px] uppercase tracking-wider ${
                          inv.status === 'FLAGGED'
                            ? 'border border-error text-error bg-error/10'
                            : inv.status === 'RESOLVED'
                              ? 'border border-primary text-primary bg-primary/10'
                              : 'border border-outline text-on-surface-variant'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-2 text-on-surface">
                      <button
                        onClick={() => navigate(`/audit/${inv.id}`)}
                        className="hover:text-primary cursor-pointer"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="p-2 text-on-surface-variant truncate max-w-[160px]">{inv.vendorName}</td>
                    <td className="p-2 text-on-surface-variant">{deriveDepartment(inv.vendorName)}</td>
                    <td className="p-2 text-right text-on-surface">{formatKesCompact(inv.totalAmountKes)}</td>
                    <td className={`p-2 text-right ${(inv.overallRiskScore || 0) > 80 ? 'text-error' : 'text-on-surface'}`}>
                      {(inv.overallRiskScore || 0).toFixed(1)}
                    </td>
                    <td className="p-2">
                      <SeverityBadge level={inv.riskLevel} />
                    </td>
                    <td className="p-2 pr-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {inv.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleStatus(inv.id, 'RESOLVED')}
                            disabled={acting}
                            className="flex items-center gap-1 border border-primary/40 text-primary hover:bg-primary/10 transition-colors rounded px-2 py-0.5 font-data-label text-[9px] uppercase cursor-pointer disabled:opacity-60"
                          >
                            {acting ? <RefreshCw className="text-[11px] animate-spin" /> : <CheckCircle2 className="text-[11px]" />}
                            Justify
                          </button>
                        )}
                        {inv.status !== 'FLAGGED' && (
                          <button
                            onClick={() => handleStatus(inv.id, 'FLAGGED')}
                            disabled={acting}
                            className="flex items-center gap-1 border border-error/60 text-error hover:bg-error/10 transition-colors rounded px-2 py-0.5 font-data-label text-[9px] uppercase cursor-pointer disabled:opacity-60"
                          >
                            <Gavel className="text-[11px]" />
                            Flag
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}