# Tamic Group Trading Platform

A full-stack portfolio, wallet, and investment-management platform built for Tamic Group. The application combines a customer trading experience with administrative tools for KYC review, withdrawals, account management, and financial controls.

## Highlights

### Customer experience

- Account registration and Supabase authentication
- TAMG share-purchase workflow
- Portfolio holdings, average price, and asset-value tracking
- Fiat and cryptocurrency wallet views
- Internal transfers between platform balances
- Bank and crypto deposit/withdrawal workflows
- Transaction history
- Individual and corporate KYC submission
- Responsive dashboards and forms

### Administrative experience

- Platform metrics dashboard
- User and profile management
- Role and permission controls
- Manual balance adjustments
- KYC document review with approve/reject decisions
- Pending and historical withdrawal queues
- Bank and cryptocurrency withdrawal review

## Technology

- React 18 and TypeScript
- Vite
- Tailwind CSS and shadcn/ui
- Supabase PostgreSQL, Authentication, Storage, and Edge Functions
- TanStack Query
- React Hook Form and Zod
- Recharts
- Node.js or Bun

## Local setup

### Prerequisites

- Node.js 18+ or Bun
- A Supabase project

### Installation

```bash
git clone https://github.com/ICARUSTUDIO/tamic-group-trading.git
cd tamic-group-trading
npm install
```

Create a local `.env` file using `.env.example` as a reference:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Start the development server:

```bash
npm run dev
```

Build and preview the production bundle:

```bash
npm run build
npm run preview
```

## Core data areas

The project uses Supabase tables and storage for areas such as:

- User profiles and roles
- Portfolio holdings
- Wallet and balance information
- Transactions and internal transfers
- Withdrawal requests
- KYC submissions and supporting documents

## Security model

The browser uses a Supabase publishable key. That key is designed for client applications and is not a substitute for authorisation. Row Level Security policies, storage policies, database functions, and Edge Functions must enforce every sensitive operation.

Never expose a Supabase service-role key in frontend code or commit it to the repository. Administrative balance changes, approvals, and other privileged financial actions should be performed only through trusted server-side logic with audited authorisation.

## Project status

This is a portfolio and product-development project demonstrating authenticated dashboards, financial workflows, role-based interfaces, form validation, cloud persistence, and administrative tooling. It is not a regulated brokerage, exchange, bank, or production financial service.

Before production use, add independent security review, comprehensive automated testing, immutable audit logs, formal reconciliation, idempotent transaction processing, rate limiting, fraud controls, regulatory review, and hardened server-side enforcement.

## License

This project is available under the [MIT License](LICENSE).
