import { createApiHandler } from "@/lib/server/apiHandler"
import * as supabaseService from "@/lib/server/supabaseService"

export default createApiHandler({
  methods: ["GET"],
  authenticated: true,
  async handler(req, res) {
    const data = await supabaseService.getUserPlan({ userId: req.session.user.id })
    return res.status(200).json(data)
  },
})
