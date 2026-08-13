# Tamic Group Trading Platform

A full-stack portfolio, wallet, and investment-management application built with React, TypeScript, and Supabase. It combines customer-facing financial workflows with administrative tools for KYC review, withdrawals, account management, and access control.

> **Portfolio project:** This repository demonstrates software-engineering decisions and product workflows. It is not a regulated brokerage, exchange, bank, or production financial service.

## What the application covers

### Customer workflows

- Account registration and Supabase authentication
- TAMG share-purchase flow
- Portfolio holdings, average-price, and asset-value tracking
- Fiat and cryptocurrency wallet views
- Internal transfers between platform balances
- Bank and crypto deposit/withdrawal requests
- Transaction history
- Individual and corporate KYC submission
- Responsive dashboards and forms

### Administrative workflows

- Platform metrics dashboard
- User and profile management
- Role and permission controls
- KYC document review with approve/reject decisions
- Pending and historical withdrawal queues
- Bank and cryptocurrency withdrawal review
- Controlled balance-adjustment interfaces

## Architecture

The frontend is organised around route-level pages, reusable UI components, domain-specific hooks, and a Supabase integration layer.

```text
src/
├── components/      Reusable UI and domain components
├── hooks/           Shared state and data-access hooks
├── integrations/    Supabase client and generated types
├── lib/             Cross-cutting utilities
└── pages/           Route-level application workflows

supabase/
├── functions/       Trusted server-side operations
└── migrations/      Database schema and policy history
```

The browser uses a Supabase publishable key. Authentication alone is not authorisation: Row Level Security policies, storage policies, database functions, and Edge Functions must enforce sensitive operations.

## Technology

- React 18 and TypeScript
- Vite
- Tailwind CSS and shadcn/ui
- Supabase PostgreSQL, Authentication, Storage, and Edge Functions
- TanStack Query
- React Hook Form and Zod
- Recharts

## Local setup

### Prerequisites

- Node.js 18 or later
- npm
- A Supabase project

### Installation

```bash
git clone https://github.com/ICARUSTUDIO/tamic-group-trading.git
cd tamic-group-trading
npm ci
```

Create a local `.env` file from `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Start the development server:

```bash
npm run dev
```

## Engineering checks

Run the complete local validation pipeline:

```bash
npm run check
```

This executes:

```bash
npm run typecheck
npm run lint
npm run build
```

The same checks run automatically in GitHub Actions for pull requests and changes to `main`.

## Security boundaries

- Never expose a Supabase service-role key in frontend code or commit it to the repository.
- Privileged balance changes, approvals, and financial controls must run through trusted server-side logic.
- Database and storage access must be restricted by reviewed Row Level Security and storage policies.
- Production financial systems additionally require immutable audit logs, reconciliation, idempotency, rate limiting, fraud controls, regulatory review, and independent security assessment.

## Current limitations

This project demonstrates authenticated dashboards, role-based workflows, form validation, cloud persistence, and administrative tooling. Before production use, it still requires comprehensive automated tests, hardened server-side enforcement, observability, formal audit trails, and a dedicated security review.

## License

This project is available under the [MIT License](LICENSE).
