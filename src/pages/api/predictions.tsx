import { createApiHandler } from "@/lib/server/apiHandler"
import * as supabaseService from "@/lib/server/supabaseService"
import { selectFields, toInt } from "@/lib/utils"

const selectPredictionFields = selectFields([
  "id",
  "input",
  "output",
  "status",
  { field: "model_name", renameTo: "modelName" },
  { field: "created_at", renameTo: "createdAt" },
])

export default createApiHandler({
  methods: ["GET"],
  authenticated: true,
  async handler(req, res) {
    const limit = toInt(req.query.limit as string) ?? 30
    const lastId = toInt(req.query.lastId as string) ?? 0
    const predictions = await supabaseService.getUserPredictions({
      userId: req.session.user.id,
      lastId,
      limit,
    })
    return res.status(200).json({ predictions: selectPredictionFields(predictions) })
  },
})

export const config = {
  runtime: "edge",
}
