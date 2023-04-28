import { NextApiRequest, NextApiResponse } from "next"
import * as paypal from "@/lib/server/paypalService"
import { getCreditPrice } from "@/lib/utils"
import { createApiHandler } from "@/lib/server/apiHandler"

export default createApiHandler({
  methods: ["POST"],
  authenticated: true,
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const { plan } = req.body
    const price = getCreditPrice(plan)
    if (!price) {
      return res.status(400).json({ error: "provided value not allowed" })
    }

    const order = await paypal.createOrder(price)
    return res.status(200).json(order)
  },
})
