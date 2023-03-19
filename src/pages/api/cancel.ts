import { cancelPrediction } from "@/lib/server/replicateService"
import { isString } from "class-validator"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"

const logger = pino({ name: "cancel.handler" })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }

  const { predictionId } = req.body
  if (!predictionId || !isString(predictionId)) {
    return res.status(400).json({ error: { validation: [{ property: "predictionId" }] } })
  }

  try {
    const result = await cancelPrediction({ predictionId })
    return res.status(200).json(result)
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}
