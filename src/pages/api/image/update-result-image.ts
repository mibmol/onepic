import { getModelByName } from "@/lib/data/models"
import * as supabaseService from "@/lib/server/supabaseService"
import { authenticated } from "@/lib/server/authenticated"
import { isNotNil } from "@/lib/utils"
import { isURL } from "class-validator"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"

const logger = pino({ name: "result-replicate-webhook.handler" })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    return res.status(404).json({ error: "method not allowed" })
  }
  const { signedUrl, predictionId: id } = req.body
  if (!isURL(signedUrl)) {
    return res.status(400).json({ error: { validation: [{ property: "signedUrl" }] } })
  }

  try {
    const { error } = await supabaseService.updatePrediction({ output: signedUrl, id })
    if (error) {
      logger.error(error)
      return res.status(500).json({ error })
    }
    return res.status(200).json({ msg: "updated" })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error})
  }
}

export default authenticated(handler, {
  customAuth: (session, req) => {
    const { credits } = getModelByName(req.body.modelName) ?? {}
    return credits === 0 || isNotNil(session)
  },
})
