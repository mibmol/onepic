import { authenticated } from "@/lib/server/authenticated"
import { NextApiRequest, NextApiResponse } from "next"
import * as paypal from "@/lib/server/paypalService"
import pino from "pino"
import { getSubscriptionPrice } from "@/lib/utils"

const logger = pino({ name: "paypal-subscription.handler" })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }
  const { plan } = req.body
  const price = getSubscriptionPrice(plan)
  if (!price) {
    return res.status(400).json({ error: "provided value not allowed" })
  }

  try {
    const subscription = await paypal.createSubscription(plan)
    return res.status(200).json(subscription)
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error })
  }
}

export default authenticated(handler)
