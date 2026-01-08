import { NextRequest, NextResponse } from 'next/server';
import { db, users, subscriptions } from '@/lib/db';
import { createApiKeyForUser } from '@/lib/auth/api-keys';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Check subscription status - get most recent subscription
    const userSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    if (userSubscription.length === 0) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 403 }
      );
    }

    const { status, currentPeriodEnd } = userSubscription[0];
    const periodExpired = currentPeriodEnd && new Date(currentPeriodEnd) < new Date();
    const activeStatuses = ['active', 'trialing'];
    const isActive = activeStatuses.includes(status) && !periodExpired;
    const isCanceledButPaid = status === 'canceled' && !periodExpired;

    if (!isActive && !isCanceledButPaid) {
      return NextResponse.json(
        { error: periodExpired ? 'Subscription expired' : 'Active subscription required to generate API keys' },
        { status: 403 }
      );
    }

    // Generate new API key
    const apiKey = await createApiKeyForUser(userId);

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Failed to generate API key' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      key: apiKey.key,
      prefix: apiKey.prefix,
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    );
  }
}
