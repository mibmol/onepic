import pino from "pino"
import type { NextApiRequest, NextApiResponse } from "next"
import * as replicateService from "@/lib/server/replicateService"
import { isString } from "class-validator"
import { createApiHandler } from "@/lib/server/apiHandler"

const logger = pino({ name: "cancel.handler" })

export default createApiHandler({
  methods: ["POST"],
  authenticated: false,
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const { predictionId } = req.body
    if (!predictionId || !isString(predictionId)) {
      return res
        .status(400)
        .json({ error: { validation: [{ property: "predictionId" }] } })
    }
    const result = await replicateService.cancelPrediction({ predictionId })
    return res.status(200).json(result)
  },
})
