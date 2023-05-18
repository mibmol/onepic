import { NextApiRequest, NextApiResponse } from "next"
import * as paypal from "@/lib/server/paypalService"
import { createApiHandler } from "@/lib/server/apiHandler"

export default createApiHandler({
  methods: ["POST"],
  authenticated: true,
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const { orderID } = req.body
    if (!orderID) {
      return res.status(400).json({ error: "missing orderID" })
    }
    const orderCaptureData = await paypal.capturePayment(orderID)
    return res.status(200).json({ orderCaptureData })
  },
})
