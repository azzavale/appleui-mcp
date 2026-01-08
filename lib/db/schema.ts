import { pgTable, text, timestamp, boolean, integer, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table - stores customer information
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Subscriptions table - tracks Stripe subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  stripePriceId: text('stripe_price_id').notNull(),
  status: text('status').notNull(), // active, canceled, past_due, trialing, incomplete
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// API Keys table - stores hashed API keys
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  keyHash: text('key_hash').notNull().unique(), // SHA-256 hash of the key
  keyPrefix: text('key_prefix').notNull(), // "appleui_sk_xxxx..." for display
  name: text('name').default('Default API Key'),
  requestCount: integer('request_count').default(0),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'), // null if active, timestamp if revoked
});

// Usage logs table - tracks API usage for analytics
export const usageLogs = pgTable('usage_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiKeyId: uuid('api_key_id').references(() => apiKeys.id, { onDelete: 'set null' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  tool: text('tool'), // review_design, generate_component, get_style_guide
  endpoint: text('endpoint'),
  responseTimeMs: integer('response_time_ms'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  apiKeys: many(apiKeys),
  usageLogs: many(usageLogs),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
  usageLogs: many(usageLogs),
}));

export const usageLogsRelations = relations(usageLogs, ({ one }) => ({
  apiKey: one(apiKeys, {
    fields: [usageLogs.apiKeyId],
    references: [apiKeys.id],
  }),
  user: one(users, {
    fields: [usageLogs.userId],
    references: [users.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type UsageLog = typeof usageLogs.$inferSelect;
export type NewUsageLog = typeof usageLogs.$inferInsert;
