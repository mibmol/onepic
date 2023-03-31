import * as supabaseService from "@/lib/server/supabaseService"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"

const logger = pino({ name: "paypal-webhook.handler" })

// PAYMENT.SALE.COMPLETED
// PAYMENT.SALE.REFUNDED
// BILLING.SUBSCRIPTION.CANCELLED
// BILLING.SUBSCRIPTION.EXPIRED
// BILLING.SUBSCRIPTION.SUSPENDED
// BILLING.SUBSCRIPTION.PAYMENT.FAILED

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }

  console.log("header", req.headers)

  console.log("----header", req.headers["PAYPAL-AUTH-ALGO"], req.headers["paypal-auth-algo"])
  console.log("body", typeof req.body)
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body
  console.log(body)

  try {
    return res.status(200).json({ msg: "updated" })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}
