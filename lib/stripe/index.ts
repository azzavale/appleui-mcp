import Stripe from 'stripe';

// Initialize Stripe client lazily to avoid errors during build
let _stripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!_stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    _stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  return _stripe;
}

// For backwards compatibility, export stripe as a getter
// This will throw at runtime if called without env vars, but won't fail the build
export const stripe = {
  get checkout() { return getStripeClient().checkout; },
  get subscriptions() { return getStripeClient().subscriptions; },
  get billingPortal() { return getStripeClient().billingPortal; },
  get webhooks() { return getStripeClient().webhooks; },
} as unknown as Stripe;

// Price ID for the €19.99/month subscription
export const PRICE_ID = process.env.STRIPE_PRICE_ID || '';

// App URL for redirects
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Create a Stripe Checkout session for new subscriptions
 */
export async function createCheckoutSession(
  email: string,
  successUrl: string = `${APP_URL}/dashboard?success=true`,
  cancelUrl: string = `${APP_URL}/pricing?canceled=true`
): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price: PRICE_ID,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        email,
      },
    },
    allow_promotion_codes: true,
  });
}

/**
 * Create a Stripe Customer Portal session for managing subscriptions
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string = `${APP_URL}/dashboard`
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/**
 * Retrieve a subscription by ID
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Construct webhook event from request
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Map Stripe subscription status to our status
 */
export function mapSubscriptionStatus(stripeStatus: Stripe.Subscription.Status): string {
  switch (stripeStatus) {
    case 'active':
      return 'active';
    case 'trialing':
      return 'trialing';
    case 'canceled':
      return 'canceled';
    case 'past_due':
      return 'past_due';
    case 'incomplete':
      return 'incomplete';
    case 'incomplete_expired':
      return 'canceled';
    case 'unpaid':
      return 'past_due';
    case 'paused':
      return 'paused';
    default:
      return 'unknown';
  }
}
