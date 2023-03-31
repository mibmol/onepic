import { authenticated } from "@/lib/server/authenticated"
import { NextApiRequest, NextApiResponse } from "next"
import * as paypal from "@/lib/server/paypalService"
import pino from "pino"
import { getCreditPrice } from "@/lib/utils"

const logger = pino({ name: "paypal-order.handler" })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }
  const { plan } = req.body
  const price = getCreditPrice(plan)
  if (!price) {
    return res.status(400).json({ error: "provided value not allowed" })
  }

  try {
    const order = await paypal.createOrder(price)
    return res.status(200).json(order)
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}

export default authenticated(handler)
