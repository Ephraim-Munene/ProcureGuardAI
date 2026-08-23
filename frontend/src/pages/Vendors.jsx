import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, AlertTriangle, Eye } from 'lucide-react';
import { fetchInvoices } from '../api/client';
import MetricCard from '../components/MetricCard';
import { formatKesCompact, shortText } from '../utils/format';

function computeExcess(inv) {
  return (inv.items || []).reduce((sum, item) => {
    if (item.invoicedUnitPriceKes > item.marketUnitPriceKes) {
      return sum + (item.invoicedUnitPriceKes - item.marketUnitPriceKes) * item.quantity;
    }
    return sum;
  }, 0);
}

export default function Vendors() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices()
      .then(setInvoices)
      .catch((err) => {
        console.error('Failed to load invoices:', err);
        setInvoices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const vendors = {};
  invoices.forEach((inv) => {
    const name = inv.vendorName || 'Unknown Supplier';
    if (!vendors[name]) {
      vendors[name] = { name, invoices: 0, flagged: 0, audited: 0, excess: 0, maxRisk: 0, ids: [] };
    }
    const v = vendors[name];
    v.invoices += 1;
    v.audited += inv.totalAmountKes || 0;
    v.excess += computeExcess(inv);
    v.maxRisk = Math.max(v.maxRisk, inv.overallRiskScore || 0);
    if (inv.status === 'FLAGGED' || (inv.overallRiskScore || 0) > 30) v.flagged += 1;
    v.ids.push(inv.id);
  });

  const vendorList = Object.values(vendors).sort((a, b) => b.maxRisk - a.maxRisk);
  const totalAudited = vendorList.reduce((s, v) => s + v.audited, 0);
  const totalExcess = vendorList.reduce((s, v) => s + v.excess, 0);
  const flaggedVendors = vendorList.filter((v) => v.flagged > 0).length;
  const avgRisk = vendorList.length ? vendorList.reduce((s, v) => s + v.maxRisk, 0) / vendorList.length : 0;

  return (
    <div className="flex-1 flex flex-col p-gutter gap-gutter overflow-hidden min-h-[500px]">
      <div className="flex items-center gap-3">
        <Landmark className="text-[20px] text-primary" />
        <h1 className="font-headline-md text-headline-md text-on-surface">Vendors</h1>
        <span className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider">
          {vendorList.length} vendors under review
        </span>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-unit">
        <MetricCard label="Vendors Tracked" value={String(vendorList.length).padStart(2, '0')} />
        <MetricCard label="Vendors with Flags" value={String(flaggedVendors).padStart(2, '0')} tone="error" icon={<AlertTriangle className="text-[14px]" />} />
        <MetricCard label="Funds Exposed (Audited)" value={formatKesCompact(totalAudited)} />
        <MetricCard label="Avg Peak Risk" value={`${avgRisk.toFixed(1)}%`} progress={avgRisk} />
      </section>

      {loading ? (
        <div className="p-16 text-center space-y-3 text-on-surface-variant">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-data-mono text-data-mono text-sm">Building vendor risk profiles...</p>
        </div>
      ) : vendorList.length === 0 ? (
        <div className="p-16 text-center">
          <p className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider mb-2">No vendor data</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Upload invoices to begin entity profiling.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-surface-container-low border border-outline-variant">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low z-10 font-data-label text-data-label text-on-surface-variant uppercase border-b border-outline-variant">
              <tr>
                <th className="p-2 pl-4">Vendor</th>
                <th className="p-2 text-right">Invoices</th>
                <th className="p-2 text-right">Flags</th>
                <th className="p-2 text-right">Audited Amount</th>
                <th className="p-2 text-right">Recoverable Excess</th>
                <th className="p-2 text-right">Peak Risk</th>
                <th className="p-2 pr-4">View</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono divide-y divide-outline-variant/50">
              {vendorList.map((v) => (
                <tr key={v.name} className="h-table-row-height hover:bg-surface-container-high transition-colors">
                  <td className="p-2 pl-4 text-on-surface truncate max-w-[220px]">{shortText(v.name, 28)}</td>
                  <td className="p-2 text-right text-on-surface-variant">{v.invoices}</td>
                  <td className={`p-2 text-right ${v.flagged > 0 ? 'text-error' : 'text-on-surface-variant'}`}>{v.flagged}</td>
                  <td className="p-2 text-right text-on-surface">{formatKesCompact(v.audited)}</td>
                  <td className={`p-2 text-right ${v.excess > 0 ? 'text-error' : 'text-on-surface-variant'}`}>{formatKesCompact(v.excess)}</td>
                  <td className={`p-2 text-right ${v.maxRisk > 80 ? 'text-error' : 'text-surface-tint'}`}>{v.maxRisk.toFixed(1)}</td>
                  <td className="p-2 pr-4">
                    <button
                      onClick={() => navigate(`/audit/${v.ids[0]}`)}
                      className="flex items-center gap-1 text-primary hover:bg-primary/10 transition-colors rounded px-2 py-0.5 font-data-label text-[9px] uppercase cursor-pointer"
                    >
                      <Eye className="text-[11px]" /> Open
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