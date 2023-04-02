import { authenticated } from "@/lib/server/authenticated"
import * as paypal from "@/lib/server/paypalService"
import * as supabaseService from "@/lib/server/supabaseService"
import pino from "pino"
import { compose, either, equals, find, path, propEq } from "ramda"
import { getCreditPrice, getSubscriptionPrice } from "@/lib/utils"
import { PaypalSubscriptionStatus, PlanType } from "@/lib/data/entities"

const logger = pino({ name: "plan/credits.handler" })

const getLastCapture = compose<any, any, any>(
  find(propEq("final_capture", true)),
  path(["purchase_units", 0, "payments", "captures"]),
)

const isOrderCompleted = (order: any, selectedPlan: string): boolean => {
  const { value: actualPrice } = getCreditPrice(selectedPlan)
  const { amount, status } = getLastCapture(order)

  return (
    status === "COMPLETED" &&
    parseFloat(amount.value).toFixed(2) === actualPrice.toFixed(2)
  )
}

const isSubscriptionCompleted = either(
  equals(PaypalSubscriptionStatus.active),
  equals(PaypalSubscriptionStatus.approved),
)

export default authenticated(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }

  try {
    const { orderId, selectedPlan, planType, subscriptionId } = req.body
    if (!selectedPlan || !planType || (!orderId && !subscriptionId)) {
      return res.status(422).json({ msg: "inconsistent data" })
    }

    if (planType === PlanType.credits) {
      const order = await paypal.getOrder(orderId)
      if (isOrderCompleted(order, selectedPlan)) {
        const { totalCredits, value } = getCreditPrice(selectedPlan)
        await supabaseService.saveOrder({
          orderId,
          selectedPlan,
          planType,
          userId: req.session.user.id,
          credits: totalCredits,
          paidAmount: value,
        })
        return res.status(200).json({})
      }
      return res.status(422).json({ msg: "inconsistent data" })
    }

    if (planType === PlanType.subscription) {
      const { status } = await paypal.getSubscription(subscriptionId)
      if (isSubscriptionCompleted(status)) {
        const { totalCredits, value } = getSubscriptionPrice(selectedPlan)
        await supabaseService.saveOrder({
          subscriptionId,
          selectedPlan,
          planType,
          userId: req.session.user.id,
          credits: totalCredits,
          paidAmount: value,
        })
        return res.status(200).json({})
      }
      return res.status(422).json({ msg: "Not approved" })
    }

    return res.status(422).json({ msg: "inconsistent data" })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error })
  }
})
