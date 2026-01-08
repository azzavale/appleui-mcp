import { NextRequest, NextResponse } from 'next/server';
import { db, users, subscriptions } from '@/lib/db';
import { getUserApiKeys } from '@/lib/auth/api-keys';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { error: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json(
        { error: 'User not found. Please check your email or complete payment first.' },
        { status: 404 }
      );
    }

    const userId = user[0].id;

    // Get subscription - get most recent subscription
    const userSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt))
      .limit(1);

    // Get API keys
    const apiKeys = await getUserApiKeys(userId);

    return NextResponse.json({
      email: user[0].email,
      subscriptionStatus: userSubscription.length > 0 ? userSubscription[0].status : 'none',
      currentPeriodEnd: userSubscription.length > 0 ? userSubscription[0].currentPeriodEnd : null,
      apiKeys,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
