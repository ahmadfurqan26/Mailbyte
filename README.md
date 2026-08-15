# Built-in SMTP Web App

A self-hosted transactional email module for a web application.

## Included

- SMTP account management
- AES-256-GCM encryption for stored SMTP passwords
- SMTP connection verification
- HTML + text email sending
- PostgreSQL persistence
- Email status tracking
- Template data model/API
- Dashboard statistics
- Responsive UI
- Next.js API routes

## Setup

1. Install Node.js 20+ and PostgreSQL.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL`.
4. Set a strong `SMTP_ENCRYPTION_KEY`.
5. Install packages:

   npm install

6. Create the database:

   npx prisma migrate dev --name init

7. Start:

   npm run dev

Open http://localhost:3000

## Production notes

For a production SaaS, add authentication/authorization before exposing these routes, tenant/user ownership on every record, Redis/BullMQ for background delivery and retries, domain verification, SPF/DKIM/DMARC configuration, rate limits, audit logs, bounce/webhook processing, secret rotation, and provider-specific OAuth where supported.

Do not expose SMTP passwords to the browser or logs.
