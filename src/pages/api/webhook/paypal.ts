import * as supabaseService from "@/lib/server/supabaseService"
import * as paypalService from "@/lib/server/paypalService"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"
import { PaypalWebhook } from "@/lib/data/entities"
import { startsWith } from "ramda"

const logger = pino({ name: "paypal-webhook.handler" })

const isSubscriptionId = startsWith("I-")

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }

  try {
    const valid = await paypalService.validateWebhook({
      authAlgo: req.headers["paypal-auth-algo"],
      certUrl: req.headers["paypal-cert-url"],
      transmissionId: req.headers["paypal-transmission-id"],
      transmissionSig: req.headers["paypal-transmission-sig"],
      transmissionTime: req.headers["paypal-transmission-time"],
      webhookEvent: req.body,
      webhookId: process.env.PAYPAL_WEBHOOK_ID,
    })
    if (!valid) {
      logger.error({}, "invalid hook sender")
      return res.status(400).json({})
    }
  } catch (error) {
    logger.error(error, "from try-catch")
    return res.status(500).json({ error })
  }

  try {
    const { event_type, resource } = req.body
    const subscriptionId = resource.billing_agreement_id
    if (isSubscriptionId(subscriptionId)) {
      switch (event_type) {
        case PaypalWebhook.SALE_COMPLETED:
          await supabaseService.saveSubscriptionPayment({
            subscriptionId,
            paidAmount: resource.amount.total,
          })
        case PaypalWebhook.SUBSCRIPTION_CANCELLED:
        case PaypalWebhook.SUBSCRIPTION_EXPIRED:
        case PaypalWebhook.SUBSCRIPTION_SUSPENDED:
          await supabaseService.endSubscription({ subscriptionId })
        default:
          break
      }
    }
    return res.status(200).json({ msg: "done" })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error })
  }
}

