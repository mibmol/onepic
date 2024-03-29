import * as paypal from "@/lib/server/paypalService"
import * as supabaseService from "@/lib/server/supabaseService"
import { compose, either, equals, find, path, propEq } from "ramda"
import { getCreditPrice, getSubscriptionPrice } from "@/lib/utils"
import { PaymentProvider, PaypalSubscriptionStatus, PlanType } from "@/lib/data/entities"
import { createApiHandler } from "@/lib/server/apiHandler"
import { pino } from "pino"

const logger = pino({ name: "api/save-order.handler" })

const getLastCapture = compose(
  find<any>(propEq("final_capture", true)),
  path<any>(["purchase_units", 0, "payments", "captures"]),
)

const isOrderCompleted = (order: any, selectedPlan: string): boolean => {
  const { value: actualPrice } = getCreditPrice(selectedPlan)
  const { amount, status } = getLastCapture(order)

  logger.info({ actualPrice, amount, status }, "isOrderCompleted")

  return (
    status === "COMPLETED" &&
    parseFloat(amount.value).toFixed(2) === actualPrice.toFixed(2)
  )
}

const isSubscriptionCompleted = either(
  equals(PaypalSubscriptionStatus.active),
  equals(PaypalSubscriptionStatus.approved),
)

export default createApiHandler({
  methods: ["POST"],
  authenticated: true,
  async handler(req, res) {
    const userId = req.session.user.id
    const { orderId, selectedPlan, planType, subscriptionId } = req.body
    if (!selectedPlan || !planType || !(orderId || subscriptionId)) {
      logger.error({ selectedPlan, planType, orderId, subscriptionId }, "validation")
      return res.status(422).json({ msg: "inconsistent data" })
    }

    if (planType === PlanType.credits) {
      const order = await paypal.getOrder(orderId)
      if (isOrderCompleted(order, selectedPlan)) {
        const { totalCredits, value } = getCreditPrice(selectedPlan)
        await supabaseService.saveCreditsOrder({
          orderId,
          selectedPlan,
          userId,
          credits: totalCredits,
          paidAmount: value,
          provider: PaymentProvider.paypal,
        })
        return res.status(200).json({})
      }
      return res.status(422).json({ msg: "Process credits: inconsistent data", order })
    }

    if (planType === PlanType.subscription) {
      const [{ status }, activeSubscription] = await Promise.all([
        paypal.getSubscription(subscriptionId),
        supabaseService.getUserActiveSubscription(userId),
      ])
      if (isSubscriptionCompleted(status)) {
        if (activeSubscription) {
          await paypal.cancelSubscription(activeSubscription.subscriptionId)
        }
        const { totalCredits, value } = getSubscriptionPrice(selectedPlan)
        await supabaseService.saveSubscriptionOrder({
          subscriptionId,
          selectedPlan,
          userId,
          credits: totalCredits,
          paidAmount: value,
          provider: PaymentProvider.paypal,
        })
        return res.status(200).json({})
      }
      return res.status(422).json({ msg: "process subscription: Not approved" })
    }

    return res.status(422).json({ msg: "inconsistent data" })
  },
})
