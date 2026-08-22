import React, { useEffect, useState } from 'react';
import { Gavel, RefreshCw } from 'lucide-react';
import { fetchBenchmarks, fetchSettings } from '../api/client';
import { formatKes } from '../utils/format';

const CATEGORY_TONES = {
  Stationery: 'border-surface-tint text-surface-tint bg-surface-tint/10',
  Furniture: 'border-primary text-primary bg-primary/10',
  Electronics: 'border-outline text-on-surface-variant bg-surface-container-high',
  Supplies: 'border-error text-error bg-error/10',
};

function parseThresholds(settings) {
  return {
    critical: Number(settings?.riskCriticalThreshold ?? 75),
    high: Number(settings?.riskHighThreshold ?? 50),
    flag: Number(settings?.riskFlagThreshold ?? 30),
  };
}

export default function RiskMatrix() {
  const [benchmarks, setBenchmarks] = useState([]);
  const [thresholds, setThresholds] = useState({ critical: 75, high: 50, flag: 30 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const [bench, settings] = await Promise.all([fetchBenchmarks(), fetchSettings()]);
      setBenchmarks(bench || []);
      setThresholds(parseThresholds(settings));
    } catch (err) {
      console.error('Failed to load risk matrix:', err);
      setBenchmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(benchmarks.map((b) => b.category))];

  return (
    <div className="flex-1 flex flex-col p-gutter gap-gutter overflow-hidden min-h-[500px]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Gavel className="text-[20px] text-primary" />
          <h1 className="font-headline-md text-headline-md text-on-surface">Risk Matrix</h1>
          <span className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider">
            PPRA benchmark index · {benchmarks.length} reference items
          </span>
        </div>
        <button
          onClick={load}
          className="bg-surface-container-high text-on-surface font-body-sm text-body-sm px-3 py-1 hover:bg-surface-container-highest transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="text-[16px]" />
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-unit">
        <div className="bg-surface-container-low border border-outline-variant p-4">
          <span className="font-data-label text-data-label text-on-surface-variant uppercase block">Critical Threshold</span>
          <span className="font-data-mono text-data-mono text-xl mt-2 block text-error">Risk &gt; {thresholds.critical}</span>
        </div>
        <div className="bg-surface-container-low border border-outline-variant p-4">
          <span className="font-data-label text-data-label text-on-surface-variant uppercase block">Elevated Threshold</span>
          <span className="font-data-mono text-data-mono text-xl mt-2 block text-surface-tint">Risk &gt; {thresholds.high}</span>
        </div>
        <div className="bg-surface-container-low border border-outline-variant p-4">
          <span className="font-data-label text-data-label text-on-surface-variant uppercase block">Flag Threshold</span>
          <span className="font-data-mono text-data-mono text-xl mt-2 block text-on-surface">Risk &gt; {thresholds.flag}</span>
        </div>
      </section>

      {loading ? (
        <div className="p-16 text-center space-y-3 text-on-surface-variant">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-data-mono text-data-mono text-sm">Loading benchmark index...</p>
        </div>
      ) : benchmarks.length === 0 ? (
        <div className="p-16 text-center">
          <p className="font-data-label text-data-label text-on-surface-variant uppercase tracking-wider mb-2">No benchmark data</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Seed or add benchmarks in Settings to populate the matrix.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-surface-container-low border border-outline-variant">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead className="sticky top-0 bg-surface-container-low z-10 font-data-label text-data-label text-on-surface-variant uppercase border-b border-outline-variant">
              <tr>
                <th className="p-2 pl-4">Category</th>
                <th className="p-2">Item</th>
                <th className="p-2 text-right">Average Market (KES)</th>
                <th className="p-2 text-right">Max Allowed (KES)</th>
                <th className="p-2 text-right">Max Markup</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-data-mono divide-y divide-outline-variant/50">
              {benchmarks.map((b) => {
                const tone = CATEGORY_TONES[b.category] || 'border-outline text-on-surface-variant bg-surface-container-high';
                const markup = b.averageMarketPriceKes
                  ? (((b.maxAllowedPriceKes - b.averageMarketPriceKes) / b.averageMarketPriceKes) * 100).toFixed(0)
                  : '0';
                return (
                  <tr key={b.id} className="h-table-row-height hover:bg-surface-container-high transition-colors">
                    <td className="p-2 pl-4">
                      <span className={`px-1.5 py-0.5 rounded-sm font-data-label text-[9px] uppercase tracking-wider border ${tone}`}>
                        {b.category}
                      </span>
                    </td>
                    <td className="p-2 text-on-surface">{b.itemName}</td>
                    <td className="p-2 text-right text-on-surface-variant">{formatKes(b.averageMarketPriceKes)}</td>
                    <td className="p-2 text-right text-on-surface">{formatKes(b.maxAllowedPriceKes)}</td>
                    <td className="p-2 text-right text-on-surface-variant">+{markup}%</td>
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