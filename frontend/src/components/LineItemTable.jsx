import React from 'react';
import SeverityBadge from './SeverityBadge';
import { formatKes } from '../utils/format';

export default function LineItemTable({ items }) {
  const list = items || [];

  return (
    <div className="border border-outline-variant bg-surface-container rounded-DEFAULT overflow-hidden">
      <div className="bg-surface-container-high px-4 py-2 border-b border-outline-variant flex justify-between items-center">
        <span className="font-data-label text-data-label text-on-surface uppercase font-bold">Item-by-Item Price Check</span>
        <span className="font-data-label text-data-label text-on-surface-variant">{list.length} Records</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead>
            <tr className="bg-surface border-b border-outline-variant text-on-surface-variant font-data-label text-data-label uppercase">
              <th className="py-2 px-3 font-normal">#</th>
              <th className="py-2 px-3 font-normal">Item Description</th>
              <th className="py-2 px-3 text-right font-normal">Inv. Price</th>
              <th className="py-2 px-3 text-right font-normal">Mkt. Baseline</th>
              <th className="py-2 px-3 text-right font-normal">Variance</th>
              <th className="py-2 px-3 text-center font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="font-data-mono text-[12px] text-on-surface">
            {list.map((item, idx) => {
              const critical = item.riskLevel === 'CRITICAL';
              const pct = item.inflationPercentage || 0;
              return (
                <tr
                  key={idx}
                  className={`border-b border-outline-variant transition-colors ${
                    critical ? 'bg-error/5 hover:bg-error/10' : 'hover:bg-surface-container-high'
                  }`}
                >
                  <td className="py-2 px-3 text-on-surface-variant">
                    {critical ? (
                      <div className="w-5 h-5 bg-error text-on-error rounded-full flex items-center justify-center font-data-label text-[9px] mx-auto shadow-sm">
                        {idx + 1}
                      </div>
                    ) : (
                      <span className="block text-center text-[10px]">{idx + 1}</span>
                    )}
                  </td>
                  <td className="py-2 px-3">{item.description}</td>
                  <td className="py-2 px-3 text-right">{formatKes(item.invoicedUnitPriceKes)}</td>
                  <td className="py-2 px-3 text-right text-on-surface-variant">{formatKes(item.marketUnitPriceKes)}</td>
                  <td className={`py-2 px-3 text-right ${pct > 30 ? 'text-error font-bold' : 'text-on-surface-variant'}`}>
                    +{Number(pct).toFixed(0)}%
                  </td>
                  <td className="py-2 px-3 text-center">
                    <SeverityBadge level={item.riskLevel} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}