import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderLock, Download, RefreshCw, CheckCircle2, Gavel } from 'lucide-react';
import { fetchInvoices } from '../api/client';
import SeverityBadge from '../components/SeverityBadge';
import { formatKes, deriveDepartment } from '../utils/format';

export default function LegalArchive() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = async () => {
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
    load();
  }, []);

  const archived = invoices.filter((inv) => inv.status === 'RESOLVED' || inv.status === 'FLAGGED');
  const filtered = filter === 'ALL' ? archived : archived.filter((inv) => inv.status === filter);

  return (
    <div className="flex-1 flex flex-col p-gutter gap-gutter overflow-hidden min-h-[500px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FolderLock className="text-[20px] text-primary" />
          <h1 className="font-headline-md text-headline-md text-on-surface">Legal Archive</h1>
          <span className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider">
            {archived.length} docketed records
          </span>
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant text-on-surface font-body-sm text-body-sm px-2 py-1 focus:border-primary focus:ring-0 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Dockets</option>
            <option value="FLAGGED">Flagged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <button
            onClick={load}
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
          <p className="font-data-mono text-data-mono text-sm">Opening legal archive...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center">
          <p className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider mb-2">Archive empty</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Flagged or resolved audits will be docketed here.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-surface-container-low border border-outline-variant">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low z-10 font-data-label text-data-label text-on-surface-variant uppercase border-b border-outline-variant">
              <tr>
                <th className="p-2 pl-4">Docket</th>
                <th className="p-2">Invoice #</th>
                <th className="p-2">Vendor</th>
                <th className="p-2">Dept</th>
                <th className="p-2 text-right">Amount</th>
                <th className="p-2">Severity</th>
                <th className="p-2 pr-4">Export</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono divide-y divide-outline-variant/50">
              {filtered.map((inv, idx) => (
                <tr key={inv.id} className="h-table-row-height hover:bg-surface-container-high transition-colors">
                  <td className="p-2 pl-4">
                    <span
                      className={`px-1.5 py-0.5 rounded-sm font-data-label text-[9px] uppercase tracking-wider flex items-center gap-1 w-fit ${
                        inv.status === 'FLAGGED'
                          ? 'border border-error text-error bg-error/10'
                          : 'border border-primary text-primary bg-primary/10'
                      }`}
                    >
                      {inv.status === 'FLAGGED' ? <Gavel className="text-[10px]" /> : <CheckCircle2 className="text-[10px]" />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-2 text-on-surface">
                    <button onClick={() => navigate(`/audit/${inv.id}`)} className="hover:text-primary cursor-pointer">
                      {inv.invoiceNumber}
                    </button>
                  </td>
                  <td className="p-2 text-on-surface-variant truncate max-w-[180px]">{inv.vendorName}</td>
                  <td className="p-2 text-on-surface-variant">{deriveDepartment(inv.vendorName)}</td>
                  <td className="p-2 text-right text-on-surface">{formatKes(inv.totalAmountKes)}</td>
                  <td className="p-2">
                    <SeverityBadge level={inv.riskLevel} />
                  </td>
                  <td className="p-2 pr-4">
                    <button
                      onClick={() => navigate(`/audit/${inv.id}`)}
                      className="flex items-center gap-1 text-primary hover:bg-primary/10 transition-colors rounded px-2 py-0.5 font-data-label text-[9px] uppercase cursor-pointer"
                    >
                      <Download className="text-[11px]" /> Print
                    </button>
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