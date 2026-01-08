import { NextRequest, NextResponse } from 'next/server';
import { db, users, subscriptions } from '@/lib/db';
import { getStripeClient, mapSubscriptionStatus } from '@/lib/stripe';
import { eq } from 'drizzle-orm';

// This endpoint repairs subscription records by syncing with Stripe
// It fetches the subscription from Stripe and creates/updates the DB record

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user[0].id;
    const stripeCustomerId = user[0].stripeCustomerId;

    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'User has no Stripe customer ID' }, { status: 400 });
    }

    // Fetch subscriptions from Stripe (source of truth)
    const stripe = getStripeClient();
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 1,
    });

    if (stripeSubscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No Stripe subscription found' }, { status: 404 });
    }

    const stripeSubscription = stripeSubscriptions.data[0];
    const status = mapSubscriptionStatus(stripeSubscription.status);
    const subscriptionItem = stripeSubscription.items.data[0];
    const priceId = subscriptionItem?.price.id || '';
    const currentPeriodStart = new Date((subscriptionItem?.current_period_start || 0) * 1000);
    const currentPeriodEnd = new Date((subscriptionItem?.current_period_end || 0) * 1000);
    const cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

    // Check if subscription already exists
    const existingSubscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existingSubscription.length > 0) {
      // Update existing subscription with Stripe data
      const updatedSubscription = await db
        .update(subscriptions)
        .set({
          stripeSubscriptionId: stripeSubscription.id,
          stripePriceId: priceId,
          status,
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, userId))
        .returning();

      return NextResponse.json({
        message: 'Subscription synced from Stripe',
        previousStatus: existingSubscription[0].status,
        newStatus: status,
        subscription: updatedSubscription[0],
      });
    }

    // Create new subscription record
    const newSubscription = await db
      .insert(subscriptions)
      .values({
        userId,
        stripeSubscriptionId: stripeSubscription.id,
        stripePriceId: priceId,
        status,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd,
      })
      .returning();

    return NextResponse.json({
      message: 'Subscription created from Stripe',
      subscription: newSubscription[0],
    });
  } catch (error) {
    console.error('Error repairing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to repair subscription' },
      { status: 500 }
    );
  }
}
