import { authenticated } from "@/lib/server/authenticated"
import * as paypal from "@/lib/server/paypalService"
import pino from "pino"
import { compose, find, path, propEq } from "ramda"
import { getCreditPrice } from "@/lib/utils"

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

export default authenticated(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }

  try {
    const { orderId, selectedPlan, planType, subscriptionId } = req.body
    const order = await paypal.getOrder(orderId)
    if (!isOrderCompleted(order, selectedPlan)) {
      return res.status(422).json({ msg: "inconsistent data" })
    }
    return res.status(200).json({})
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: error.toString() })
  }
})
