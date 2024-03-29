import { Prediction } from "@/lib/data/entities/prediction"
import { isFreeModel } from "@/lib/data/models"
import * as replicateService from "@/lib/server/replicateService"
import * as supabaseService from "@/lib/server/supabaseService"
import { isNotNil } from "@/lib/utils"
import { validate } from "class-validator"
import type { NextApiResponse } from "next"
import pino from "pino"
import { createApiHandler, NextApiRequestWithSession } from "@/lib/server/apiHandler"
import { AppErrorCode } from "@/lib/data/entities"

const logger = pino({ name: "image-to-image.handler" })

const handler = async (req: NextApiRequestWithSession, res: NextApiResponse) => {
  const { body, session } = req

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
    return res
      .status(400)
      .json({ msg: "no credits", errorCode: AppErrorCode.USER_OUT_OF_CREDITS })
  }

  const prediction = await replicateService.generatePrediction(predictionOptions)
  const result = await supabaseService.insertPrediction(
    predictionOptions,
    prediction,
    session.user,
  )

  if (result.error) {
    return res.status(500).json({ error })
  }
  return res.status(200).json(prediction)
}

export default createApiHandler({
  methods: ["POST"],
  authenticated: true,
  customAuthCheck: (session, req) => isFreeModel(req.body.modelName) || isNotNil(session),
  handler,
})
