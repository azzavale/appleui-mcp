import { randomBytes, createHash } from 'crypto';
import { db, apiKeys, users, subscriptions } from '../db';
import { eq, and, isNull, sql } from 'drizzle-orm';

const API_KEY_PREFIX = 'appleui_sk_';

/**
 * Generate a new API key
 * Returns the raw key (to show once), hash (to store), and prefix (for display)
 */
export function generateApiKey(): { key: string; hash: string; prefix: string } {
  // Generate 32 random bytes = 64 hex characters
  const bytes = randomBytes(32);
  const keyBody = bytes.toString('hex');
  const key = `${API_KEY_PREFIX}${keyBody}`;

  // Hash for storage (never store raw key)
  const hash = createHash('sha256').update(key).digest('hex');

  // Prefix for display (first 8 chars + ...)
  const prefix = `${API_KEY_PREFIX}${keyBody.slice(0, 8)}...`;

  return { key, hash, prefix };
}

/**
 * Hash an API key for comparison
 */
export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

/**
 * Validate an API key and return user info if valid
 */
export interface ApiKeyValidationResult {
  valid: boolean;
  userId?: string;
  apiKeyId?: string;
  subscriptionStatus?: string;
  error?: string;
}

export async function validateApiKey(key: string): Promise<ApiKeyValidationResult> {
  // Basic format check
  if (!key || !key.startsWith(API_KEY_PREFIX)) {
    return { valid: false, error: 'Invalid API key format' };
  }

  try {
    const keyHash = hashApiKey(key);

    // Find the API key in database
    const apiKeyRecord = await db
      .select({
        id: apiKeys.id,
        userId: apiKeys.userId,
        revokedAt: apiKeys.revokedAt,
      })
      .from(apiKeys)
      .where(and(
        eq(apiKeys.keyHash, keyHash),
        isNull(apiKeys.revokedAt) // Not revoked
      ))
      .limit(1);

    if (apiKeyRecord.length === 0) {
      return { valid: false, error: 'API key not found or revoked' };
    }

    const { id: apiKeyId, userId } = apiKeyRecord[0];

    // Check subscription status
    const userSubscription = await db
      .select({
        status: subscriptions.status,
        currentPeriodEnd: subscriptions.currentPeriodEnd,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(subscriptions.createdAt)
      .limit(1);

    // Allow if subscription is active or trialing
    const validStatuses = ['active', 'trialing'];
    if (userSubscription.length === 0) {
      return { valid: false, error: 'No active subscription' };
    }

    const { status, currentPeriodEnd } = userSubscription[0];

    if (!validStatuses.includes(status)) {
      return { valid: false, error: `Subscription ${status}` };
    }

    // Check if subscription has expired
    if (currentPeriodEnd && new Date(currentPeriodEnd) < new Date()) {
      return { valid: false, error: 'Subscription expired' };
    }

    return {
      valid: true,
      userId,
      apiKeyId,
      subscriptionStatus: status,
    };
  } catch (error) {
    console.error('API key validation error:', error);
    return { valid: false, error: 'Validation error' };
  }
}

/**
 * Record API key usage and update last used timestamp
 */
export async function recordApiKeyUsage(apiKeyId: string): Promise<void> {
  try {
    await db
      .update(apiKeys)
      .set({
        lastUsedAt: new Date(),
        requestCount: sql`${apiKeys.requestCount} + 1`,
      })
      .where(eq(apiKeys.id, apiKeyId));
  } catch (error) {
    console.error('Failed to record API key usage:', error);
    // Don't throw - usage tracking shouldn't break requests
  }
}

/**
 * Create a new API key for a user
 */
export async function createApiKeyForUser(
  userId: string,
  name: string = 'Default API Key'
): Promise<{ key: string; prefix: string } | null> {
  try {
    const { key, hash, prefix } = generateApiKey();

    await db.insert(apiKeys).values({
      userId,
      keyHash: hash,
      keyPrefix: prefix,
      name,
    });

    // Return the raw key (only time it's available)
    return { key, prefix };
  } catch (error) {
    console.error('Failed to create API key:', error);
    return null;
  }
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(apiKeyId: string, userId: string): Promise<boolean> {
  try {
    const result = await db
      .update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(and(
        eq(apiKeys.id, apiKeyId),
        eq(apiKeys.userId, userId),
        isNull(apiKeys.revokedAt)
      ));

    return true;
  } catch (error) {
    console.error('Failed to revoke API key:', error);
    return false;
  }
}

/**
 * Revoke all API keys for a user (e.g., when subscription is canceled)
 */
export async function revokeAllUserApiKeys(userId: string): Promise<void> {
  try {
    await db
      .update(apiKeys)
      .set({ revokedAt: new Date() })
      .where(and(
        eq(apiKeys.userId, userId),
        isNull(apiKeys.revokedAt)
      ));
  } catch (error) {
    console.error('Failed to revoke user API keys:', error);
  }
}

/**
 * Get all active API keys for a user (for dashboard display)
 */
export async function getUserApiKeys(userId: string) {
  return db
    .select({
      id: apiKeys.id,
      prefix: apiKeys.keyPrefix,
      name: apiKeys.name,
      requestCount: apiKeys.requestCount,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(and(
      eq(apiKeys.userId, userId),
      isNull(apiKeys.revokedAt)
    ))
    .orderBy(apiKeys.createdAt);
}
