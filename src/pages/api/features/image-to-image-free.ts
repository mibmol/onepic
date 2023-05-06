import { Prediction } from "@/lib/data/entities/prediction"
import { isFreeModel } from "@/lib/data/models"
import * as replicateService from "@/lib/server/replicateService"
import * as supabaseService from "@/lib/server/supabaseService"
import { validate } from "class-validator"
import type { NextApiResponse } from "next"
import pino from "pino"
import { createApiHandler, NextApiRequestWithSession } from "@/lib/server/apiHandler"

const logger = pino({ name: "image-to-image-free.handler" })

const handler = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
  const { body, session } = req

  const predictionOptions = new Prediction().setValues(body)
  const errors = await validate(predictionOptions)
  if (errors.length > 0) {
    return res.status(400).json({ error: { validation: errors } })
  }

  if (!isFreeModel(predictionOptions.modelName)) {
    return res.status(402).json({ error: "No allowed" })
  }

  const prediction = await replicateService.generatePrediction(predictionOptions)
  const result = await supabaseService.insertPrediction(
    predictionOptions,
    prediction,
    session?.user,
  )

  if (result.error) {
    logger.error(result.error)
    return res.status(500).json({ error: result.error })
  }
  return res.status(200).json(prediction)
}

export default createApiHandler({
  methods: ["POST"],
  handler,
})
