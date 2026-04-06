# Happy Paws Store

A full-stack e-commerce app for dog accessories — built as a portfolio project.

## Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Frontend + API | SvelteKit 2 + Svelte 5      |
| Styling        | Tailwind CSS v4             |
| Database       | PostgreSQL + Prisma         |
| Payments       | Stripe Checkout (test mode) |
| Monorepo       | pnpm workspaces             |

## Features

- Product list & product detail pages
- Cart with localStorage persistence
- Stripe Checkout (hosted, test mode)
- Order saved to DB after successful payment via Stripe webhook

## Project Structure

```
apps/
  web/          # SvelteKit app
packages/
  db/           # Prisma schema, migrations, seed
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL running locally
- Stripe account (free, test mode)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

The project needs `.env` files in two places:

**`apps/web/.env`** — used by SvelteKit/Vite at runtime:

```bash
cp apps/web/.env.example apps/web/.env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/happypaws"
STRIPE_SECRET_KEY="sk_test_..."        # from https://dashboard.stripe.com/test/apikeys
STRIPE_WEBHOOK_SECRET="whsec_..."      # from Stripe CLI (see below)
PUBLIC_BASE_URL="http://localhost:5173"
```

**`packages/db/.env`** — used by Prisma CLI (`migrate`, `seed`, `studio`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/happypaws"
```

> Only `DATABASE_URL` is needed in `packages/db/.env`.

### 3. Set up the database

```bash
# Run migrations
cd packages/db
npx prisma migrate deploy

# Seed products
npx prisma db seed
```

### 4. Start the dev server

```bash
pnpm --filter web dev
```

App runs at **http://localhost:5173**

### 5. Set up Stripe webhook (local testing)

Install [Stripe CLI](https://stripe.com/docs/stripe-cli), then:

```bash
stripe login
stripe listen --forward-to localhost:5173/api/webhooks/stripe
```

Copy the printed `whsec_...` secret into `apps/web/.env` as `STRIPE_WEBHOOK_SECRET`, then restart the dev server.

## Testing Payments

Use Stripe test card:

| Field       | Value                 |
| ----------- | --------------------- |
| Card number | `4242 4242 4242 4242` |
| Expiry      | Any future date       |
| CVC         | Any 3 digits          |
| ZIP         | Any 5 digits          |

After a successful payment, check the `orders` table:

```bash
cd packages/db && npx prisma studio
```

## Scripts

| Command                                | Description      |
| -------------------------------------- | ---------------- |
| `pnpm --filter web dev`                | Start dev server |
| `pnpm --filter web build`              | Production build |
| `pnpm --filter web check`              | TypeScript check |
| `cd packages/db && npx prisma studio`  | Browse database  |
| `cd packages/db && npx prisma db seed` | Re-seed products |
