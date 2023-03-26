import { authenticated } from "@/lib/server/authenticated"
import { NextApiRequest, NextApiResponse } from "next"
import * as paypal from "@/lib/server/paypalService"
import pino from "pino"

const logger = pino({ name: "paypal-order-capture.handler" })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }
  const { orderID } = req.body
  if (!orderID) {
    return res.status(400).json({ error: "missing orderID" })
  }

  try {
    const orderCaptureData = await paypal.capturePayment(orderID)
    return res.status(200).json({ orderCaptureData })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}

export default authenticated(handler)
