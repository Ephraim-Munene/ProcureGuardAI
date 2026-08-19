export const DEPARTMENTS = [
  'Finance',
  'Health',
  'Education',
  'Infrastructure',
  'Agriculture',
  'Water & Sanitation',
];

export function deriveDepartment(value) {
  const str = String(value || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 997;
  }
  return DEPARTMENTS[hash % DEPARTMENTS.length];
}

export function severityOf(level) {
  switch ((level || '').toUpperCase()) {
    case 'CRITICAL':
      return 'CRITICAL';
    case 'HIGH':
      return 'ELEVATED';
    case 'MEDIUM':
      return 'ELEVATED';
    default:
      return 'NORMAL';
  }
}

export function formatKes(value) {
  return `KES ${Number(value || 0).toLocaleString()}`;
}

export function formatKesCompact(value) {
  const n = Number(value || 0);
  if (n >= 1e9) return `KES ${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `KES ${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `KES ${(n / 1e3).toFixed(1)}K`;
  return `KES ${Math.round(n).toLocaleString()}`;
}

export function shortText(str, max = 14) {
  const s = String(str || '');
  return s.length > max ? s.slice(0, max) + '…' : s;
}

export function flagLabel(invoice) {
  const flagged = (invoice.items || []).find((item) => item.isFlagged);
  if (!flagged) return 'Standard Pricing';
  const pct = Number(flagged.inflationPercentage || 0);
  return `${shortText(flagged.description, 12)} +${pct.toFixed(0)}%`;
}