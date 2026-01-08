import { NextRequest, NextResponse } from 'next/server';
import { db, users, subscriptions } from '@/lib/db';
import { createApiKeyForUser, revokeApiKey } from '@/lib/auth/api-keys';
import { eq, and, isNull } from 'drizzle-orm';
import { apiKeys } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, keyId } = body;

    if (!email || !keyId) {
      return NextResponse.json(
        { error: 'Email and keyId are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const userId = user[0].id;

    // Check subscription status
    const userSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(subscriptions.createdAt)
      .limit(1);

    const validStatuses = ['active', 'trialing'];
    if (userSubscription.length === 0 || !validStatuses.includes(userSubscription[0].status)) {
      return NextResponse.json(
        { error: 'Active subscription required to regenerate API keys' },
        { status: 403 }
      );
    }

    // Verify the key belongs to this user and exists
    const keyRecord = await db
      .select()
      .from(apiKeys)
      .where(and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId),
        isNull(apiKeys.revokedAt)
      ))
      .limit(1);

    if (keyRecord.length === 0) {
      return NextResponse.json(
        { error: 'API key not found or already revoked' },
        { status: 404 }
      );
    }

    // Revoke the old key
    const revoked = await revokeApiKey(keyId, userId);

    if (!revoked) {
      return NextResponse.json(
        { error: 'Failed to revoke old API key' },
        { status: 500 }
      );
    }

    // Generate new API key
    const apiKey = await createApiKeyForUser(userId);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Failed to generate new API key' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      key: apiKey.key,
      prefix: apiKey.prefix,
      revokedKeyId: keyId,
    });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate API key' },
      { status: 500 }
    );
  }
}
