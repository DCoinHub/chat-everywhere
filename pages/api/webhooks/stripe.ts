import { NextApiRequest, NextApiResponse } from 'next';

import { sendReportForStripeWebhookError } from '@/utils/server/resend';
import handleCheckoutSessionCompleted from '@/utils/server/stripe/handleCheckoutSessionCompleted';
import handleCustomerSubscriptionDeleted from '@/utils/server/stripe/handleCustomerSubscriptionDeleted';
import handleCustomerSubscriptionUpdated from '@/utils/server/stripe/handleCustomerSubscriptionUpdated';

import { UserProfile } from './../../../types/user';

import getRawBody from 'raw-body';
import Stripe from 'stripe';
import { trackError } from '@/utils/app/azureTelemetry';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  // Read the raw body
  const rawBody = await getRawBody(req);

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error(
      `Webhook signature verification failed.`,
      (err as any).message,
    );
    //Log error to Azure App Insights
    trackError(err as string);
    return res.status(400).send(`Webhook signature verification failed.`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // One time payment / Initial Monthly Pro Plan Subscription
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case 'customer.subscription.updated':
        // Monthly Pro Plan Subscription recurring payment
        await handleCustomerSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;
      case 'customer.subscription.deleted':
        // Monthly Pro Plan Subscription removal
        await handleCustomerSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (error) {
    //Log error to Azure App Insights
    trackError(error as string);
    if (error instanceof Error) {
      const user =
        error.cause && typeof error.cause === 'object' && 'user' in error.cause
          ? (error.cause.user as UserProfile)
          : undefined;

      try {
        await sendReportForStripeWebhookError(error.message, event, user);
      } catch (error) {
        console.error(error);
        throw error;
      }
      return res.json({ received: true, error: error.message });
    }
    throw error;
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
