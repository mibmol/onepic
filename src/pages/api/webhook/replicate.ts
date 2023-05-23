import { AssetInfo, ReplicateStatus } from "@/lib/data/entities"
import { createApiHandler } from "@/lib/server/apiHandler"
import * as supabaseService from "@/lib/server/supabaseService"
import * as cloudinaryService from "@/lib/server/cloudinaryService"
import type { NextApiRequest, NextApiResponse } from "next"
import pino from "pino"

const logger = pino({ name: "replicate-webhook.handler" })

export default createApiHandler({
  methods: ["POST"],
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const { output, status, id, metrics, ...rest } = req.body

    let assetInfo = {} as AssetInfo
    if (rest.error) {
      logger.error(rest.error, "Webhook body error")
    }

    if (status === ReplicateStatus.succeeded) {
      try {
        assetInfo = await cloudinaryService.uploadFromUrl(output)
      } catch (e) {
        logger.error(e, "cloudinary error: input:" + output)
      }
    }
    const { error } = await supabaseService.updatePrediction({
      output: (assetInfo.imageUrl ?? output) as any,
      status,
      id,
      metrics,
      assets: assetInfo,
    })
    if (error) {
      logger.error(error, "supabase error")
      return res.status(500).json({ error })
    }
    if (status === ReplicateStatus.succeeded) {
      await supabaseService.updateUserCredits({ predictionId: id })
    }
    return res.status(200).json({ msg: "updated" })
  },
})
