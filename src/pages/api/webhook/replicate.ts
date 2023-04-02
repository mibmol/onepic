import { ReplicateStatus } from "@/lib/data/entities"
import { createApiHandler } from "@/lib/server/apiHandler"
import * as supabaseService from "@/lib/server/supabaseService"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"

const logger = pino({ name: "replicate-webhook.handler" })

export default createApiHandler({
  methods: ["POST"],
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const { output, status, id, metrics, ...rest } = req.body
    if (rest.error) {
      logger.error(rest.error)
    }
    const { error } = await supabaseService.updatePrediction({
      output,
      status,
      id,
      metrics,
    })
    if (error) {
      logger.error(error)
      return res.status(500).json({ error })
    }
    if (status === ReplicateStatus.succeeded) {
      await supabaseService.updateUserCredits({ predictionId: id })
    }
    return res.status(200).json({ msg: "updated" })
  },
})
