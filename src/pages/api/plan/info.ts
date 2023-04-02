import { authenticated } from "@/lib/server/authenticated"
import * as supabaseService from "@/lib/server/supabaseService"
import pino from "pino"

const logger = pino({ name: "plan/info.handler" })

export default authenticated(async (req, res) => {
  if (req.method !== "GET") {
    return res.status(404).json({ error: "method not allowed" })
  }

  try {
    const data = await supabaseService.getUserPlan({ userId: req.session.user.id })
    return res.status(200).json(data)
  } catch (error) {
    logger.error(error)
    return res.status(500).json({ error })
  }
})
