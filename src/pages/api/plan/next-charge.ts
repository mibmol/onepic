import { createApiHandler } from "@/lib/server/apiHandler"
import * as paypalService from "@/lib/server/paypalService"
import * as supabaseService from "@/lib/server/supabaseService"
import * as stripeService from "@/lib/server/stripeService"
import { PaymentProvider } from "@/lib/data/entities"

export default createApiHandler({
  methods: ["GET"],
  authenticated: true,
  async handler(req, res) {
    const subscription = await supabaseService.getUserActiveSubscription(
      req.session.user.id,
    )
    if (!subscription) {
      return res.status(404).json({ error: "no subscription" })
    }
    if (subscription.provider === PaymentProvider.paypal) {
      const nextChargeTime = await paypalService.getSubscriptionNextChargeTime(
        subscription.subscriptionId,
      )
      return res.status(200).json({ nextChargeTime })
    }
    if (subscription.provider === PaymentProvider.stripe) {
      const nextChargeTime = await stripeService.getSubscriptionNextChargeTime(
        subscription.subscriptionId,
      )
      return res.status(200).json({ nextChargeTime })
    }

    return res.status(200).json({})
  },
})
