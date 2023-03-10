import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"

type AuthenticatedDecorator = (handler: NextApiHandler) => NextApiHandler

export const authenticated: AuthenticatedDecorator = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ error: "unauthenticated" })
    }
    return await handler(req, res)
  }
}
