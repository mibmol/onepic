import * as supabaseService from "@/lib/server/supabaseService"
import * as paypalService from "@/lib/server/paypalService"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"
import { PaypalWebhook } from "@/lib/data/entities"
import { startsWith } from "ramda"
import { createApiHandler } from "@/lib/server/apiHandler"

const logger = pino({ name: "paypal-webhook.handler" })

const isSubscriptionId = startsWith("I-")

export default createApiHandler({
  methods: ["POST"],
  async handler(req: NextApiRequest, res: NextApiResponse) {
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

    const { event_type, resource } = req.body
    const billingId = resource.billing_agreement_id
    switch (event_type) {
      case PaypalWebhook.SALE_COMPLETED:
        if (isSubscriptionId(billingId)) {
          await supabaseService.saveSubscriptionPayment({
            subscriptionId: billingId,
            paidAmount: resource.amount.total,
          })
        }
      case PaypalWebhook.SUBSCRIPTION_CANCELLED:
      case PaypalWebhook.SUBSCRIPTION_EXPIRED:
      case PaypalWebhook.SUBSCRIPTION_SUSPENDED:
        await supabaseService.endSubscription({ subscriptionId: billingId })
      default:
        break
    }
    return res.status(200).json({ msg: "done" })
  },
})
