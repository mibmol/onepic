import { Prediction } from "@/lib/data/entities/prediction"
import { generatePrediction } from "@/lib/data/replicateService"
import { insertPrediction } from "@/lib/data/supabaseService"
import { authenticated } from "@/lib/server/authenticated"
import { validate } from "class-validator"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"

const logger = pino({ name: "process-image.handler" })

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }

  const predictionOptions = new Prediction().setValues(req.body)
  const errors = await validate(predictionOptions)
  if (errors.length > 0) {
    return res.status(400).json({ error: { validation: errors } })
  }

  try {
    const result = await generatePrediction(predictionOptions)
    const { error } = await insertPrediction(predictionOptions, result)

    if (error) {
      throw error
    }
    return res.status(200).json(result)
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}

export default authenticated(handler)
