import { authenticated } from "@/lib/server/authenticated"
import { NextApiRequest, NextApiResponse } from "next"
import * as paypal from "@/lib/server/paypalService"
import pino from "pino"

const logger = pino({ name: "paypal-client-token.handler" })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "method not allowed" })
  }

  try {
    const clientToken = await paypal.getClientToken()
    return res.status(200).json({ clientToken })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}

export default authenticated(handler)
