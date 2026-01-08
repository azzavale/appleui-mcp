import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { constructWebhookEvent, mapSubscriptionStatus } from '@/lib/stripe';
import { db, users, subscriptions } from '@/lib/db';
import { createApiKeyForUser, revokeAllUserApiKeys } from '@/lib/auth/api-keys';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_email;
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!email || !customerId || !subscriptionId) {
    console.error('Missing required data in checkout session');
    return;
  }

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  let userId: string;

  if (existingUser.length > 0) {
    // Update existing user with Stripe customer ID
    userId = existingUser[0].id;
    await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  } else {
    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        email,
        stripeCustomerId: customerId,
      })
      .returning({ id: users.id });

    userId = newUser[0].id;
  }

  // Create subscription record
  // Note: subscription details will be filled in by the subscription.created/updated event

  // Generate API key for the user
  const apiKey = await createApiKeyForUser(userId, 'Default API Key');

  if (apiKey) {
    console.log(`API key created for user ${email}: ${apiKey.prefix}`);
    // In production, you'd send this via email
    // For now, it will be visible in the dashboard
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = mapSubscriptionStatus(subscription.status);
  const priceId = subscription.items.data[0]?.price.id || '';
  const currentPeriodStart = new Date(subscription.current_period_start * 1000);
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  // Find user by Stripe customer ID
  const user = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (user.length === 0) {
    console.error(`User not found for customer ${customerId}`);
    return;
  }

  const userId = user[0].id;

  // Check if subscription exists
  const existingSubscription = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
    .limit(1);

  if (existingSubscription.length > 0) {
    // Update existing subscription
    await db
      .update(subscriptions)
      .set({
        status,
        stripePriceId: priceId,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));
  } else {
    // Create new subscription
    await db
      .insert(subscriptions)
      .values({
        userId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: priceId,
        status,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd,
      });
  }

  console.log(`Subscription ${subscriptionId} updated: ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;

  // Update subscription status to canceled
  await db
    .update(subscriptions)
    .set({
      status: 'canceled',
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  // Find user and revoke all API keys
  const user = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (user.length > 0) {
    await revokeAllUserApiKeys(user[0].id);
    console.log(`API keys revoked for user ${user[0].email}`);
  }

  console.log(`Subscription ${subscriptionId} deleted`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  // Update subscription status to past_due
  await db
    .update(subscriptions)
    .set({
      status: 'past_due',
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  console.log(`Payment failed for subscription ${subscriptionId}`);
}
