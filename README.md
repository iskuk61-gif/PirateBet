# PirateBet Discord Gambling Bot

A fully-featured Discord gambling bot built with TypeScript, Express, Discord.js v14, and PostgreSQL.

## Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express + Discord.js v14
- **Database**: PostgreSQL + Drizzle ORM
- **Canvas**: @napi-rs/canvas
- **Crypto**: bitcoinjs-lib, @solana/web3.js, bip32, bip39
- **Monorepo**: pnpm workspace

## Setup

```bash
pnpm install
pnpm build
```

## Environment Variables

See `.env.example` for all required variables.

## Deployment

```bash
pnpm start
```

Runs on PORT defined in .env (default 3000).
