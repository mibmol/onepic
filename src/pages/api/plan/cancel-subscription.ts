import { createApiHandler } from "@/lib/server/apiHandler"
import * as paypalService from "@/lib/server/paypalService"
import * as supabaseService from "@/lib/server/supabaseService"
import { pino } from "pino"

const logger = pino({ name: "api/cancel-subscription.handler" })

export default createApiHandler({
  methods: ["PATCH"],
  authenticated: true,
  async handler(req, res) {
    const subscription = await supabaseService.getUserActiveSubscription(req.session.user.id)
    if (!subscription) {
      logger.info({ ...req.session }, "Tried cancel subscription")
      return res.status(200).json({ msg: "no subscription" })
    }
    await paypalService.cancelSubscription(subscription.subscriptionId)

    return res.status(200).json({ msg: "done" })
  },
})
