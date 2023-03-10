import { getImageSignedUrl } from "@/lib/data/supabaseService"
import { authenticated } from "@/lib/server/authenticated"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { imagePath, width, height } = req.query
  if (!imagePath) {
    return res.status(400).json({ error: { validation: [{ property: "imagePath" }] } })
  }

  const { data, error } = await getImageSignedUrl(imagePath as string, { width, height })

  if (error) {
    return res.status(500).json({ error: error })
  }

  res.status(200).json(data)
}

export default authenticated(handler)
