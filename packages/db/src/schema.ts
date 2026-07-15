import { pgTable, text, decimal, timestamp, integer, boolean, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  discordId: text('discord_id').unique().notNull(),
  username: text('username').notNull(),
  balance: decimal('balance', { precision: 18, scale: 8 }).default('0').notNull(),
  totalWagered: decimal('total_wagered', { precision: 18, scale: 8 }).default('0').notNull(),
  ltcAddress: text('ltc_address'),
  solAddress: text('sol_address'),
  affiliateCode: text('affiliate_code').unique(),
  affiliatedBy: text('affiliated_by'),
  forceLoser: boolean('force_loser').default(false),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

export const bets = pgTable('bets', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  discordId: text('discord_id').notNull(),
  game: text('game').notNull(),
  betAmount: decimal('bet_amount', { precision: 18, scale: 8 }).notNull(),
  winAmount: decimal('win_amount', { precision: 18, scale: 8 }).notNull(),
  outcome: text('outcome').notNull(),
  multiplier: decimal('multiplier', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

export const deposits = pgTable('deposits', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  discordId: text('discord_id').notNull(),
  txHash: text('tx_hash').unique().notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  ltcAmount: decimal('ltc_amount', { precision: 18, scale: 8 }),
  solAmount: decimal('sol_amount', { precision: 18, scale: 8 }),
  coin: text('coin').notNull(),
  status: text('status').default('pending').notNull(),
  confirmedAt: timestamp('confirmed_at'),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

export const withdrawals = pgTable('withdrawals', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  discordId: text('discord_id').notNull(),
  ltcAddress: text('ltc_address').notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  txHash: text('tx_hash'),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

export const redeemCodes = pgTable('redeem_codes', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').unique().notNull(),
  amount: decimal('amount', { precision: 18, scale: 8 }).notNull(),
  maxUses: integer('max_uses').notNull(),
  usedCount: integer('used_count').default(0).notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').default(sql`now()`).notNull(),
});

export const house = pgTable('house', {
  id: integer('id').primaryKey().default(1),
  balance: decimal('balance', { precision: 18, scale: 8 }).default('0').notNull(),
  totalPaidOut: decimal('total_paid_out', { precision: 18, scale: 8 }).default('0').notNull(),
  totalCollected: decimal('total_collected', { precision: 18, scale: 8 }).default('0').notNull(),
});

export const commandCooldowns = pgTable('command_cooldowns', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  discordId: text('discord_id').notNull(),
  command: text('command').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
}, (table) => ({
  uniq: unique('unique_cooldown').on(table.discordId, table.command),
}));
