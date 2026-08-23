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
      'Perfect for trying things out or checking a few invoices now and then.',
    shortFeatures: ['3 invoice scans per day', 'Reads scanned PDFs & photos', 'Standard price checks'],
    features: [
      '3 invoice scans per day',
      'Reads scanned PDFs & photos',
      'Standard price checks',
      'Limited to 1 concurrent session',
    ],
  },
  {
    id: 'PRO',
    num: '02',
    name: 'Professional',
    price: '10',
    priceLabel: 'KES / day',
    badge: 'RECOMMENDED',
    amount: 10,
    description:
      'For busy teams that need to check lots of invoices with smarter flagging.',
    shortFeatures: ['50 invoice scans per day', 'Smarter overcharging detection', 'Priority support'],
    features: [
      '50 invoice scans per day',
      'Smarter overcharging detection',
      'Priority support',
      'Export reports',
      '5 concurrent sessions',
    ],
  },
  {
    id: 'ENTERPRISE',
    num: '03',
    name: 'Enterprise',
    price: '20',
    priceLabel: 'KES / day',
    badge: null,
    amount: 20,
    description:
      'Built for organizations checking invoices across many departments at scale.',
    shortFeatures: ['500 invoice scans per day', 'API access', 'Department-level reports', 'Custom price benchmarks'],
    features: [
      '500 invoice scans per day',
      'API access',
      'Department-level reports',
      'Custom price benchmarks',
      'Unlimited concurrent sessions',
    ],
  },
];

export const getTierById = (id) => TIERS.find((t) => t.id === id);
