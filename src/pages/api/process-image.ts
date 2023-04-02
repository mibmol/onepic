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
  const { method, body, session } = req
  if (method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }

  const predictionOptions = new Prediction().setValues(body)
  const errors = await validate(predictionOptions)
  if (errors.length > 0) {
    return res.status(400).json({ error: { validation: errors } })
  }

  const { error, user } = await supabaseService.getUser(session.user.id)

  if (error) {
    logger.error(error)
    return res.status(500).json({ error })
  }

  if (user.credits <= 0) {
    return res.status(400).json({ msg: "no credits" })
  }

  try {
    const result = await replicateService.generatePrediction(predictionOptions)
    const { error } = await supabaseService.insertPrediction(
      predictionOptions,
      result,
      session.user,
    )

    if (error) {
      throw error
    }
    return res.status(200).json(result)
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
