import { updatePrediction } from "@/lib/data/supabaseService"
import { authenticated } from "@/lib/server/authenticated"
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
    const { error } = await updatePrediction({ output: signedUrl, id })
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

export default authenticated(handler)
