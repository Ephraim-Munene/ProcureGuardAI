import React from 'react';
import { shortText } from '../utils/format';

export default function PriceComparisonChart({ items }) {
  const list = items || [];
  const maxInv = Math.max(1, ...list.map((i) => i.invoicedUnitPriceKes || 0));

  return (
    <div className="mb-8 border border-outline-variant rounded-DEFAULT bg-surface-container-lowest p-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-data-label text-data-label text-on-surface-variant uppercase">Market vs. Invoice Comparison</span>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-error border border-error"></span>
            <span className="font-data-label text-data-label">Invoiced</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-secondary-container border border-outline"></span>
            <span className="font-data-label text-data-label">Market Baseline</span>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">No line items to compare.</p>
      ) : (
        <div className="flex flex-col gap-4 py-2">
          {list.map((item, idx) => {
            const inv = item.invoicedUnitPriceKes || 0;
            const mkt = item.marketUnitPriceKes || 0;
            const invPct = Math.max(2, (inv / maxInv) * 100);
            const mktPct = Math.max(2, (mkt / maxInv) * 100);
            return (
              <div className="flex items-center gap-4" key={idx}>
                <div className="w-24 text-right font-data-label text-data-label text-on-surface truncate" title={item.description}>
                  {shortText(item.description, 12)}
                </div>
                <div className="flex-1 relative h-6">
                  <div className="absolute left-0 top-1 h-2 bg-secondary-container border border-outline" style={{ width: `${mktPct}%` }}></div>
                  <div className="absolute left-0 bottom-1 h-2 bg-error border border-error/50" style={{ width: `${invPct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}