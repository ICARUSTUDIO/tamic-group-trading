Tamic Group (TAMG) Trading Platform

A comprehensive stock trading and portfolio management platform for Tamic Group (TAMG), built with React, TypeScript, and Supabase. This application enables users to purchase shares, manage crypto and fiat wallets, perform automated internal transfers, and undergo KYC verification, while providing administrators with a robust dashboard for financial controls.

🚀 Features

User Features

Stock Trading: Real-time interface to buy and manage TAMG shares with automatic portfolio updates.

Wallet System:

Integrated Fiat and Crypto wallet management.

Instant Internal Transfers: Seamlessly transfer funds to the Tamic Wallet ecosystem.

Deposit and Withdrawal workflows (Bank Transfer & Crypto).

Portfolio Management: Visual dashboard to track asset performance, total value, and transaction history.

KYC Verification: Secure identity verification system supporting both Individual and Corporate accounts with document upload.

Security: Protected routes and secure authentication via Supabase.

Admin Features

Dashboard: High-level overview of system metrics.

User Management: View user profiles, manage permissions, and manually adjust user balances (Add/Remove funds).

KYC Review: Interface to review, approve, or reject KYC submissions with document preview.

Withdrawal Management:

Separate views for "Pending" requests (requiring manual approval) and "History".

One-click approval/rejection for bank and crypto withdrawals.

🛠️ Tech Stack

Frontend: React, TypeScript, Vite

Styling: Tailwind CSS, Shadcn UI, Lucide React (Icons)

Backend & Database: Supabase (PostgreSQL, Auth, Storage, Edge Functions)

State Management: TanStack Query (React Query)

Forms: React Hook Form, Zod

Runtime: Node.js / Bun

⚙️ Prerequisites

Before you begin, ensure you have the following installed:

Node.js (v18+) or Bun

npm or yarn

📦 Installation

Clone the repository

git clone [https://github.com/ICARUSTUDIO/tamic-group-trading/tree/main](https://github.com/ICARUSTUDIO/tamic-group-trading/tree/main)
cd tamg-trading-platform



Install dependencies
Using npm:

npm install



Or using Bun:

bun install



Environment Configuration
Create a .env file in the root directory based on the example below:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key



Start the Development Server

npm run dev



The app will be available at http://localhost:8080 (or the port shown in your terminal).

🗄️ Database Schema (Supabase)

This project relies on the following key tables in Supabase:

profiles: Extends auth.users with balance, tamic_balance, and personal details.

portfolios: Tracks user stock holdings (symbol, shares, average_price).

transactions: Logs of all buy/sell/transfer actions.

withdrawal_requests: Queues withdrawal requests for admin review.

kyc_requests: Stores verification data and status.

🛡️ Admin Access

To access the admin panel at /admin, the logged-in user must have the appropriate role set in the user_roles table or via the is_admin flag in profiles (depending on your specific implementation).

🤝 Contributing

Contributions are welcome! Please follow these steps:

Fork the project.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

📄 License

Distributed under the MIT License. See LICENSE for more information.
