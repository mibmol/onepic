import { createApiHandler } from "@/lib/server/apiHandler"
import * as supabaseService from "@/lib/server/supabaseService"

export default createApiHandler({
  methods: ["DELETE"],
  authenticated: true,
  async handler(req, res) {
    await supabaseService.deleteUserAccount(req.session.user.id)
    return res.status(200).json({ msg: "done" })
  },
})
