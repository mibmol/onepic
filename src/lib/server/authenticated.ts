import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession, Session } from "next-auth"

type EvaluatorFn = (session: Session, req: NextApiRequest) => boolean

type AuthenticatedDecorator = (
  handler: NextApiHandler,
  customAuth?: EvaluatorFn,
) => NextApiHandler

export const authenticated: AuthenticatedDecorator = (handler, customAuth) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    if (customAuth) {
      return customAuth(session, req)
        ? await handler(req, res)
        : res.status(401).json({ error: "unauthenticated" })
    }
    if (!session) {
      return res.status(401).json({ error: "unauthenticated" })
    }
    return await handler(req, res)
  }
}
