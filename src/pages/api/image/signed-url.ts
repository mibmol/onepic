import { createApiHandler } from "@/lib/server/apiHandler"
import * as supabaseService from "@/lib/server/supabaseService"
import type { NextApiRequest, NextApiResponse } from "next"

export default createApiHandler({
  methods: ["GET"],
  async handler(req: NextApiRequest, res: NextApiResponse) {
    const { imagePath, width, height } = req.query
    if (!imagePath) {
      return res.status(400).json({ error: { validation: [{ property: "imagePath" }] } })
    }
    const data = await supabaseService.getImageSignedUrl(imagePath as string, {
      width,
      height,
    })
    return res.status(200).json(data)
  },
})
