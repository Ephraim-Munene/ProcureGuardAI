import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Eye, MoreHorizontal } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchInvoices } from '../api/client';
import MetricCard from '../components/MetricCard';
import InvoiceTable from '../components/InvoiceTable';
import { formatKesCompact, shortText } from '../utils/format';

export default function Dashboard() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await fetchInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const totalAudited = invoices.reduce((sum, inv) => sum + (inv.totalAmountKes || 0), 0);
  const estimatedLoss = invoices.reduce((sum, inv) => {
    return sum + (inv.items || []).reduce((iSum, item) => {
      if (item.invoicedUnitPriceKes > item.marketUnitPriceKes) {
        return iSum + (item.invoicedUnitPriceKes - item.marketUnitPriceKes) * item.quantity;
      }
      return iSum;
    }, 0);
  }, 0);
  const flagged = invoices.filter(
    (inv) => inv.status === 'FLAGGED' || (inv.overallRiskScore || 0) > 30
  ).length;
  const fraudRate = invoices.length ? (flagged / invoices.length) * 100 : 0;
  const pendingAudits = invoices.filter((inv) => inv.status === 'FLAGGED').length;

  const chartData = invoices.map((inv) => {
    const billed = inv.totalAmountKes || 0;
    const market = (inv.items || []).reduce(
      (sum, item) => sum + (item.marketUnitPriceKes || 0) * (item.quantity || 0),
      0
    );
    return {
      name: shortText(inv.invoiceNumber || 'INV', 8),
      Billed: Math.round(billed),
      Excess: Math.round(Math.max(0, billed - market)),
    };
  });

  const watchlist = [...invoices]
    .sort((a, b) => (b.overallRiskScore || 0) - (a.overallRiskScore || 0))
    .slice(0, 3);

  return (
    <div className="flex-1 flex flex-col p-gutter gap-gutter overflow-hidden min-h-[500px]">
      {/* KPI Strip */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-unit">
        <MetricCard
          label="Total Amount Checked"
          value={formatKesCompact(totalAudited)}
        />
        <MetricCard
          label="Possible Overcharging Found"
          value={formatKesCompact(estimatedLoss)}
          tone="error"
        />
        <MetricCard
          label="Flagged Invoices"
          value={`${fraudRate.toFixed(1)}%`}
          progress={fraudRate}
          icon={<AlertTriangle className="text-[14px]" />}
        />
        <MetricCard
          label="Needs Your Review"
          value={String(pendingAudits).padStart(2, '0')}
        />
      </section>

      {/* Main Content Area (65/35 Split) */}
      <section className="flex-1 flex flex-col lg:flex-row gap-gutter overflow-hidden min-h-[400px]">
        <InvoiceTable invoices={invoices} loading={loading} onNavigate={(id) => navigate(`/audit/${id}`)} />

        {/* Right: Risk Analytics (35%) */}
        <div className="flex-[0.35] flex flex-col gap-gutter min-w-0">
          <div className="bg-surface-container-low border border-outline-variant flex-1 flex flex-col p-4 relative min-h-[200px]">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center justify-between">
              <span>Billed vs Market Price</span>
              <MoreHorizontal className="text-[16px] text-on-surface-variant cursor-pointer hover:text-on-surface" />
            </h3>
            {chartData.length === 0 ? (
              <div className="flex-1 flex items-center justify-center font-data-label text-data-label text-on-surface-variant uppercase tracking-wider">
                No data yet
              </div>
            ) : (
              <>
                <div className="flex-1 relative w-full h-full min-h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                      <CartesianGrid stroke="#444749" vertical={false} strokeDasharray="0" />
                      <XAxis dataKey="name" stroke="#8e9193" fontSize={9} tickLine={false} axisLine={{ stroke: '#444749' }} />
                      <YAxis stroke="#8e9193" fontSize={9} tickLine={false} axisLine={false} width={34} />
                      <Tooltip
                        cursor={{ fill: '#1c1b1b' }}
                        contentStyle={{
                          backgroundColor: '#201f1f',
                          border: '1px solid #444749',
                          color: '#e5e2e1',
                          borderRadius: '4px',
                          fontSize: 12,
                        }}
                        formatter={(value) => [`KES ${Number(value).toLocaleString()}`, '']}
                      />
                      <Bar dataKey="Billed" stackId="a" fill="#444749" />
                      <Bar dataKey="Excess" stackId="a" fill="#ffb4ab" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex gap-4 justify-center font-data-label text-data-label">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-outline-variant"></span>
                    <span className="text-on-surface-variant">Billed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-error"></span>
                    <span className="text-on-surface-variant">Excess (Fraud)</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-surface-container-low border border-outline-variant flex-1 flex flex-col p-4">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3 flex items-center gap-2">
              <Eye className="text-[16px] text-error" />
              Watchlist: Top High-Risk
            </h3>
            <div className="flex-1 flex flex-col gap-2">
              {watchlist.length === 0 ? (
                <div className="flex-1 flex items-center justify-center font-data-label text-data-label text-on-surface-variant uppercase tracking-wider">
                  No flagged vendors
                </div>
              ) : (
                watchlist.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => navigate(`/audit/${inv.id}`)}
                    className="flex items-center justify-between p-2 border border-outline-variant bg-surface-container-lowest cursor-pointer hover:bg-surface-container-high transition-colors"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="font-body-sm text-body-sm text-on-surface truncate">{inv.vendorName}</span>
                      <span className="font-data-label text-[10px] text-on-surface-variant">ID: {inv.invoiceNumber}</span>
                    </div>
                    <span className={`font-data-mono text-data-mono ${(inv.overallRiskScore || 0) > 80 ? 'text-error' : 'text-surface-tint'}`}>
                      {(inv.overallRiskScore || 0).toFixed(1)} Risk Score
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}