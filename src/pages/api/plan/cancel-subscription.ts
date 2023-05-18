import { PaymentProvider } from "@/lib/data/entities"
import { createApiHandler } from "@/lib/server/apiHandler"
import * as paypalService from "@/lib/server/paypalService"
import * as supabaseService from "@/lib/server/supabaseService"
import * as stripeService from "@/lib/server/stripeService"
import { pino } from "pino"

const logger = pino({ name: "api/cancel-subscription.handler" })

export default createApiHandler({
  methods: ["PATCH"],
  authenticated: true,
  async handler(req, res) {
    const subscription = await supabaseService.getUserActiveSubscription(
      req.session.user.id,
    )
    if (!subscription) {
      logger.info({ ...req.session }, "Tried cancel subscription")
      return res.status(200).json({ msg: "no subscription" })
    }

    const { subscriptionId, provider } = subscription
    if (provider === PaymentProvider.paypal) {
      await paypalService.cancelSubscription(subscriptionId)
    }
    if (provider === PaymentProvider.stripe) {
      await stripeService.cancelSubscription(subscriptionId)
    }

    await supabaseService.endSubscription({ subscriptionId })

    return res.status(200).json({ msg: "done" })
  },
})
