import { Prediction } from "@/lib/data/entities/prediction"
import { getModelByName } from "@/lib/data/models"
import * as replicateService from "@/lib/server/replicateService"
import * as supabaseService from "@/lib/server/supabaseService"
import { authenticated, NextApiRequestWithSession } from "@/lib/server/authenticated"
import { isNotNil } from "@/lib/utils"
import { validate } from "class-validator"
import type { NextApiResponse } from "next"
import pino from "pino"

const logger = pino({ name: "process-image.handler" })

const handler = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }

  const predictionOptions = new Prediction().setValues(req.body)
  const errors = await validate(predictionOptions)
  if (errors.length > 0) {
    return res.status(400).json({ error: { validation: errors } })
  }

  try {
    const result = await replicateService.generatePrediction(predictionOptions)
    const { error } = await supabaseService.insertPrediction(
      predictionOptions,
      result,
      req.session,
    )

    if (error) {
      throw error
    }
    return res.status(200).json(result)
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}

export default authenticated(handler, (session, req) => {
  const { credits } = getModelByName(req.body.modelName) ?? {}
  return credits === 0 || isNotNil(session)
})
