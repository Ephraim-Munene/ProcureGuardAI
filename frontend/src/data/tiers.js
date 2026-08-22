export const TIERS = [
  {
    id: 'FREE',
    num: '01',
    name: 'Basic Inspector',
    price: '0',
    priceLabel: 'KES / day',
    badge: null,
    amount: 0,
    description:
      'Limited forensic scan capacity for individual auditors and evaluation use.',
    shortFeatures: ['3 Neural Scans per day', 'Standard OCR processing', 'Public Registry access'],
    features: [
      '3 Neural Scans per day',
      'Standard OCR processing',
      'Public Registry access',
      'Limited to 1 concurrent session',
    ],
  },
  {
    id: 'PRO',
    num: '02',
    name: 'Professional Forensic',
    price: '10',
    priceLabel: 'KES / day',
    badge: 'RECOMMENDED',
    amount: 10,
    description:
      'Full oversight suite with advanced anomaly detection and department escalation pathways.',
    shortFeatures: ['50 Neural Scans per day', 'Advanced Anomaly Detection', 'Priority EACC Escalation'],
    features: [
      '50 Neural Scans per day',
      'Advanced Anomaly Detection',
      'Priority EACC Escalation',
      'Audit Trail Export',
      '5 concurrent sessions',
    ],
  },
  {
    id: 'ENTERPRISE',
    num: '03',
    name: 'Enterprise Oversight',
    price: '20',
    priceLabel: 'KES / day',
    badge: null,
    amount: 20,
    description:
      'Comprehensive procurement surveillance for multi-department organizations and high-volume audits.',
    shortFeatures: ['500 Neural Scans per day', 'Full API Access', 'Multi-department Audit Logs', 'Custom Risk Benchmarks'],
    features: [
      '500 Neural Scans per day',
      'Full API Access',
      'Multi-department Audit Logs',
      'Custom Risk Benchmarks',
      'Unlimited concurrent sessions',
    ],
  },
];

export const getTierById = (id) => TIERS.find((t) => t.id === id);
