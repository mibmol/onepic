import { NextApiRequest, NextApiResponse } from "next"
import * as paypal from "@/lib/server/paypalService"
import { getSubscriptionPrice } from "@/lib/utils"
import { createApiHandler } from "@/lib/server/apiHandler"

export default createApiHandler({
  methods: ["POST"],
  authenticated: true,
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const { plan } = req.body
    const price = getSubscriptionPrice(plan)
    if (!price) {
      return res.status(400).json({ error: "provided value not allowed" })
    }

    const subscription = await paypal.createSubscription(plan)
    return res.status(200).json(subscription)
  },
})
