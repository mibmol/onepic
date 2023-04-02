import * as supabaseService from "@/lib/server/supabaseService"
import { isString } from "class-validator"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"

const logger = pino({ name: "result.handler" })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "method not allowed" })
  }

  const { predictionId } = req.query
  if (!predictionId || !isString(predictionId)) {
    return res.status(400).json({ error: "predictionId wrong or missing" })
  }

  try {
    const { error, prediction } = await supabaseService.getPrediction(predictionId)
    if (error) {
      logger.error(error)
      return res.status(500).json({ error })
    }
    if (!prediction) {
      return res.status(404).json({ error: "not found" })
    }
    return res.status(200).json(prediction)
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error })
  }
}
