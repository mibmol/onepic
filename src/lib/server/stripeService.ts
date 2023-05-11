import { NextApiRequest } from "next"
import Stripe from "stripe"
import getRawBody from "raw-body"

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: null })

export async function validateWebhookEvent(req: NextApiRequest): Promise<Stripe.Event> {
  const body = (await getRawBody(req)).toString("utf-8")
  return stripeClient.webhooks.constructEvent(
    body,
    req.headers["stripe-signature"],
    process.env.STRIPE_WEBHOOK_SIGNING_SECRET,
  )
}

export function getPaymentIntent(intentId: string) {
  return stripeClient.paymentIntents.retrieve(intentId)
}
