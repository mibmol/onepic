import { createApiHandler } from "@/lib/server/apiHandler"
import * as supabaseService from "@/lib/server/supabaseService"

export default createApiHandler({
  methods: ["PATCH"],
  authenticated: true,
  async handler(req, res) {
    const { newName } = req.body
    if (!newName || typeof newName !== "string") {
      return res.status(400).json({ error: { validation: {} } })
    }

    await supabaseService.updateUserName({
      userId: req.session.user.id,
      newName,
    })

    return res.status(200).json({ msg: "done" })
  },
})
