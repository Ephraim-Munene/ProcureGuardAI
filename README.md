# ProcureGuardAI

A dashboard for monitoring procurement expenditure trends and auditing invoices for price inflation and fraud risk.

## Overview

ProcureGuardAI automates the auditing of government and corporate invoices, cross-referencing invoiced prices against market benchmarks to detect overbilling, price inflation, and duplicate charges. The system features a **multi-AI fallback architecture** that ensures 99.99% uptime by automatically switching between Google Gemini, OpenAI GPT-4o-mini, and a local forensic heuristic engine if any provider experiences downtime.

## Setup Instructions

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (Supabase, Railway, or any PostgreSQL-compatible service)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/Ephraim-Munene/ProcureGuardAI.git
cd procureguardai
```

### 2. Install dependencies

```bash
npm install
# Or: yarn install
```

### 3. Environment setup

Copy the example environment file:

```bash
cp .env.local .env
```

Configure the following variables in `.env`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Keys (required for full AI audit functionality)
GEMINI_API_KEY=your_gemini_api_key_here    # Primary AI vision model
OPENAI_API_KEY=your_openai_api_key_here    # Secondary fallback AI vision model

# Database
DATABASE_URL=postgresql://postgres:password@db.host:port/database

# Additional config
PORT=3000
```

### 4. Database migration

```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Run the development server

```bash
npm run dev
# Or: yarn dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
├── backend/              # Express + Node.js API
├── frontend/             # React + Tailwind CSS
├── tier/                 # Additional tiers/configurations
└── .vercel/              # Vercel deployment config
```

## Key Features

- **Multi-AI Fallback Architecture**: 
  - Primary: Google Gemini 2.0 Flash / 1.5 Flash (fast, low-cost vision)
  - Secondary: OpenAI GPT-4o-mini (automatic failover on rate limits/errors)
  - Tertiary: Local forensic heuristic engine (guarantees 100% uptime)
  - Provider usage is logged internally for admin tracking

- **Dynamic Market Benchmarking**:
  - Benchmark prices can be configured per-tenant via the Settings UI
  - AI prompts dynamically inject custom benchmark data from the Prisma `BenchmarkPrice` table
  - Falls back to default PPRA Kenya Shilling benchmarks if no custom entries exist

- **Invoice Document Auditing**:
  - Upload PDF or image invoices
  - Automatic extraction of all line items, quantities, and unit prices
  - Inflation percentage calculation against market benchmarks
  - Overall risk score from 0 (Clean) to 100 (Severe Corruption)

- **AI Provider Badges** (visible in Audit Details):
  - `Gemini` - Primary AI engine
  - `OpenAI` - Secondary fallback engine
  - `Heuristic` - Local fallback engine (when no API keys configured)
  - `ProcureGuard` - Displayed when AI providers are unavailable

- **Audit Status Management**: Update invoice states (CLEAN, FLAGGED, RESOLVED)

- **Price Data Visualization**: Recharts bar chart comparing Invoiced Unit Price vs. Estimated Fair Market Price

- **PostgreSQL Database**: Managed via Prisma ORM for users, invoices, line items, audit scores, and custom benchmarks

- **M-Pesa Payment Integration**: Professional and Enterprise plans paid via M-Pesa

- **Tenant Isolation**: Multi-company support with private dashboards

## API Endpoints

| Endpoint | Description |
|---|---|
| `POST /api/invoices/upload` | Upload and audit an invoice |
| `GET /api/invoices` | Fetch all invoices for authenticated user |
| `GET /api/invoices/:id` | Fetch a single invoice with items |
| `PATCH /api/invoices/:id/status` | Update invoice status (CLEAN/FLAGGED/RESOLVED) |
| `GET /api/benchmarks` | Fetch all market benchmark prices |
| `POST /api/benchmarks` | Create a new benchmark price |
| `PATCH /api/benchmarks/:id` | Update a benchmark price |
| `DELETE /api/benchmarks/:id` | Delete a benchmark price |

## Plans / Tiers

| Plan | Daily Scans | Price (KES/day) | Features |
|---|---|---|---|
| **Free** | 3 | 0 | Basic audit, PPRA benchmarks, heuristic fallback |
| **Professional** | 50 | 10 | Multi-AI fallback, custom benchmarks, export reports |
| **Enterprise** | 500 | 20 | Team collaboration, API access, dedicated support |

## Technology Stack

- **Frontend**: React, Tailwind CSS, Recharts, Lucide React icons, React Router
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
- **AI Services**: Google Gemini `@google/genai`, OpenAI GPT-4o-mini via `axios`
- **Mobile Payments**: M-Pesa STK Push (Professional/Enterprise)

## Production Deployment

This project is configured for Vercel deployment. Ensure all environment variables are set in the Vercel dashboard before deploying.

## Go-To-Market Strategy

ProcureGuardAI initially targets **Corporates and SMEs** (Small & Medium Enterprises) before expanding to government contracts. Private businesses offer:

- Faster sales cycles (1-4 weeks vs 12-24 months for government tenders)
- Immediate ROI through cost savings on vendor invoices
- Easier decision-making (CFOs, Business Owners vs bureaucratic committees)
- Shorter payment cycles and faster feedback loops

As the product gains traction and case studies accumulate, expansion to government procurement oversight (County Governments, Ministries, PPRA, EACC) becomes a natural progression with established trust and proven metrics.

## License

This project is proprietary and closed-source. All rights reserved.