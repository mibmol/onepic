import { NextApiRequest, NextApiResponse } from "next"
import * as paypal from "@/lib/server/paypalService"
import { createApiHandler } from "@/lib/server/apiHandler"

export default createApiHandler({
  methods: ["POST"],
  authenticated: true,
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const clientToken = await paypal.getClientToken()
    return res.status(200).json({ clientToken })
  },
})
