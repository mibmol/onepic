import { createApiHandler } from "@/lib/server/apiHandler"
import * as paypalService from "@/lib/server/paypalService"
import * as supabaseService from "@/lib/server/supabaseService"

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
    const nextChargeTime = await paypalService.getSubscriptionNextChargeTime(
      subscription.subscriptionId,
    )
    return res.status(200).json({ nextChargeTime })
  },
})
