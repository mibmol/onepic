import { createApiHandler } from "@/lib/server/apiHandler"
import * as supabaseService from "@/lib/server/supabaseService"
import type { NextApiRequest, NextApiResponse } from "next"

export default createApiHandler({
  methods: ["GET"],
  authenticated: true,
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const { imagePath, width, height } = req.query
    if (!imagePath) {
      return res.status(400).json({ error: { validation: [{ property: "imagePath" }] } })
    }
    const { data, error } = await supabaseService.getImageSignedUrl(imagePath as string, {
      width,
      height,
    })
    if (error) {
      return res.status(500).json({ error: error })
    }
    return res.status(200).json(data)
  },
})
