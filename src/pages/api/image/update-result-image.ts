import { isFreeModel } from "@/lib/data/models"
import * as supabaseService from "@/lib/server/supabaseService"
import { isNotNil } from "@/lib/utils"
import { isURL } from "class-validator"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"
import { createApiHandler } from "@/lib/server/apiHandler"

const logger = pino({ name: "result-replicate-webhook.handler" })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { signedUrl, predictionId: id } = req.body
  if (!isURL(signedUrl)) {
    return res.status(400).json({ error: { validation: [{ property: "signedUrl" }] } })
  }

  const { error } = await supabaseService.updatePrediction({ output: signedUrl, id })
  if (error) {
    logger.error(error)
    return res.status(500).json({ error })
  }
  return res.status(200).json({ msg: "updated" })
}

export default createApiHandler({
  methods: ["PUT"],
  authenticated: true,
  customAuthCheck: (session, req) => isFreeModel(req.body.modelName) || isNotNil(session),
  handler,
})
