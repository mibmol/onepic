import { createApiHandler } from "@/lib/server/apiHandler"
import * as supabaseService from "@/lib/server/supabaseService"

export default createApiHandler({
  methods: ["POST"],
  async handler(req, res) {
    const { feedback, score } = req.body
    if (
      !feedback ||
      !["amazing", "good", "whatever", "sad", "none"].includes(score ?? "none")
    ) {
      return res.status(400).json({ error: { validation: {} } })
    }

    await supabaseService.insertFeedback({
      feedback,
      score,
      userId: req.session?.user?.id,
    })

    return res.status(200).json({ msg: "done" })
  },
})
