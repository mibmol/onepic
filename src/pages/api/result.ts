import { getPrediction } from "@/lib/data/replicateClient"
import { isString } from "class-validator"
import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "method not allowed" })
  }

  const { predictionId } = req.query
  if (!predictionId || !isString(predictionId)) {
    return res.status(400).json({ error: "predictionId wrong or missing" })
  }

  try {
    const { error, output, status } = await getPrediction({ predictionId })
    if (error) {
      console.error(error)
      return res.status(500).json({ error })
    }

    return res.status(200).json({ output, status })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}
