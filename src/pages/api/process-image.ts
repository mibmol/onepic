import { Prediction } from "@/lib/data/entities/prediction"
import { generatePrediction } from "@/lib/data/replicateClient"
import { validate } from "class-validator"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    return res.status(200).json(result)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}
