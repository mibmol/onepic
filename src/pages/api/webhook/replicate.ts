import { updatePrediction } from "@/lib/server/supabaseService"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"

const logger = pino({ name: "replicate-webhook.handler" })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(404).json({ error: "method not allowed" })
  }

  const { output, status, id, metrics, ...rest } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body

  if (rest.error) {
    logger.error(rest.error)
  }

  try {
    const { error } = await updatePrediction({ output, status, id, metrics })
    if (error) {
      logger.error(error)
      return res.status(500).json({ error })
    }
    return res.status(200).json({ msg: "updated" })
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error: error.toString() })
  }
}
