import { createApiHandler } from "@/lib/server/apiHandler"
import * as stripe from "@/lib/server/stripeService"

export default createApiHandler({
  methods: ["GET"],
  authenticated: true,
  async handler(req, res) {
    const session = await stripe.createSession({
      plan: req.query.plan as string,
      planType: req.query.planType as string,
      user: req.session.user,
    })
    return res.status(200).json({ sessionUrl: session.url })
  },
})
