import { NextApiRequest } from "next"
import Stripe from "stripe"
import getRawBody from "raw-body"
import { always, cond, equals } from "ramda"
import { PlanType } from "../data/entities"
import { getCreditStripePrice, getSubscriptionStripePrice } from "../utils"

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

export async function getSubscriptionNextChargeTime(subscriptionId: string) {
  const { current_period_end } = await stripeClient.subscriptions.retrieve(subscriptionId)
  return new Date(current_period_end * 1000).toISOString()
}

export function cancelSubscription(subscriptionId: string) {
  return stripeClient.subscriptions.cancel(subscriptionId)
}

type SessionMode = "payment" | "setup" | "subscription"

const getSessionMode = cond([
  [equals(PlanType.credits), always<SessionMode>("payment")],
  [equals(PlanType.subscription), always<SessionMode>("subscription")],
])

export const getStripePrice = (plan: string, planType: string) => {
  switch (planType) {
    case PlanType.credits:
      return getCreditStripePrice(plan)
    case PlanType.subscription:
      return getSubscriptionStripePrice(plan)
    default:
      break
  }
}

export function createSession({ plan, planType, user }) {
  const successUrl = new URL(process.env.ENV_URL)
  successUrl.searchParams.set("messageCode", "PaymentSuccessful")
  return stripeClient.checkout.sessions.create({
    mode: getSessionMode(planType),
    line_items: [{ price: getStripePrice(plan, planType), quantity: 1 }],
    metadata: { plan, planType, userId: user.id },
    success_url: successUrl.toString(),
  })
}
