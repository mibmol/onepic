import { PaymentProvider, PlanType } from "@/lib/data/entities"
import { createApiHandler } from "@/lib/server/apiHandler"
import * as stripeService from "@/lib/server/stripeService"
import * as supabaseService from "@/lib/server/supabaseService"
import { getCreditPrice, getSubscriptionPrice } from "@/lib/utils"
import { pino } from "pino"

const logger = pino({ name: "stripe-webhook.handler" })

export const config = {
  api: {
    bodyParser: false,
  },
}

function getPlanInfo(planType: string, plan: string) {
  switch (planType) {
    case PlanType.credits:
      return getCreditPrice(plan)
    case PlanType.subscription:
      return getSubscriptionPrice(plan)
    default:
      break
  }
}

const SubscriptionBillingReason = {
  create: "subscription_create",
  cycle: "subscription_cycle",
  update: "subscription_update",
}

function checkPaidValue(checkoutCompletedData: any, planType: string, plan: string) {
  if (checkoutCompletedData["payment_status"] !== "paid") {
    return false
  }
  const actualPlanValue = getPlanInfo(planType, plan)?.value * 100

  const total = Number.parseFloat(checkoutCompletedData["amount_total"])
  return actualPlanValue.toFixed(2) === total.toFixed(2)
}

export default createApiHandler({
  methods: ["POST"],
  async handler(req, res) {
    const event = await stripeService.validateWebhookEvent(req)
    switch (event.type) {
      case "checkout.session.completed":
        const checkoutCompleted = event.data.object
        const { userId, plan, planType } = checkoutCompleted["metadata"]
        if (!checkPaidValue(checkoutCompleted, planType, plan)) {
          return res.status(422).json({
            msg: "processing credits stripe: inconsistent data or invalid payment",
            checkoutCompleted,
          })
        }
        const { totalCredits, value } = getPlanInfo(planType, plan)
        if (planType === PlanType.credits) {
          await supabaseService.saveCreditsOrder({
            userId,
            selectedPlan: plan,
            credits: totalCredits,
            paymentIntentId: checkoutCompleted["payment_intent"],
            provider: PaymentProvider.stripe,
            paidAmount: value,
          })
        }
        if (planType === PlanType.subscription) {
          const subscription = await supabaseService.getUserActiveSubscription(userId)
          if (subscription) {
            await stripeService.cancelSubscription(subscription.subscriptionId)
          }
          await supabaseService.saveSubscriptionOrder({
            userId,
            selectedPlan: plan,
            credits: totalCredits,
            provider: PaymentProvider.stripe,
            paidAmount: value,
            subscriptionId: checkoutCompleted["subscription"],
          })
        }
        break

      case "invoice.paid":
        const subscriptionInvoice = event.data.object
        if (subscriptionInvoice["billing_reason"] === SubscriptionBillingReason.cycle) {
          await supabaseService.saveSubscriptionCyclePayment({
            subscriptionId: subscriptionInvoice["subscription"],
            paidAmount: subscriptionInvoice["amount_paid"] / 100,
            provider: PaymentProvider.stripe,
          })
        }
        break

      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object
        await supabaseService.endSubscription({
          subscriptionId: subscriptionDeleted["id"],
        })
        break

      default:
        logger.error(event, `Unhandled event type ${event.type}`)
    }
    return res.status(200).json({})
  },
})
