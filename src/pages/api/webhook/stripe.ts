import { PaymentProvider } from "@/lib/data/entities"
import { createApiHandler } from "@/lib/server/apiHandler"
import * as stripeService from "@/lib/server/stripeService"
import * as supabaseService from "@/lib/server/supabaseService"
import { getCreditPrice } from "@/lib/utils"
import { pino } from "pino"

const logger = pino({ name: "stripe-webhook.handler" })

export const config = {
  api: {
    bodyParser: false,
  },
}

function checkPaidCreditsValue(checkoutCompletedData: any, plan: string) {
  if (checkoutCompletedData["payment_status"] !== "paid") {
    return false
  }
  const actualPlanValue = getCreditPrice(plan).value * 100
  const total = Number.parseFloat(checkoutCompletedData["amount_total"])
  return actualPlanValue.toFixed(2) === total.toFixed(2)
}

export default createApiHandler({
  methods: ["POST"],
  async handler(req, res) {
    const event = await stripeService.validateWebhookEvent(req)

    switch (event.type) {
      case "checkout.session.async_payment_succeeded":
      case "checkout.session.completed":
        const checkoutCompletedData = event.data.object
        const [userId, selectedPlan, planType] =
          checkoutCompletedData["client_reference_id"].split("_")

        if (!checkPaidCreditsValue(checkoutCompletedData, selectedPlan)) {
          return res.status(422).json({
            msg: "processing credits stripe: inconsistent data or invalid payment",
            checkoutCompletedData,
          })
        }
        const { totalCredits, value } = getCreditPrice(selectedPlan)
        await supabaseService.saveOrder({
          userId,
          planType,
          selectedPlan,
          credits: totalCredits,
          paymentIntentId: checkoutCompletedData["payment_intent"],
          provider: PaymentProvider.stripe,
          paidAmount: value,
        })

        break

      case "subscription_schedule.completed":
        const subscriptionScheduleCompleted = event.data.object
        break
      case "subscription_schedule.aborted":
        const subscriptionScheduleAborted = event.data.object
        break
      case "subscription_schedule.canceled":
        const subscriptionScheduleCanceled = event.data.object
        break

      case "subscription_schedule.created":
        const subscriptionScheduleCreated = event.data.object
        break
      case "subscription_schedule.updated":
        const subscriptionScheduleUpdated = event.data.object
        break
      default:
        logger.error(event, `Unhandled event type ${event.type}`)
    }
    return res.status(200).json({})
  },
})
