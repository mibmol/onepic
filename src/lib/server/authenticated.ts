import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession, Session } from "next-auth"
import { assoc } from "ramda"

type EvaluatorFn = (session: Session, req: NextApiRequest) => boolean

export type NextApiRequestWithSession = NextApiRequest & { session: Session }

type AuthenticatedDecorator = (
  handler: (req: NextApiRequestWithSession, res: NextApiResponse) => any,
  customAuth?: EvaluatorFn,
) => NextApiHandler

export const authenticated: AuthenticatedDecorator = (handler, customAuth) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions)
    const reqWithSession = assoc("session", session, req) as NextApiRequestWithSession
    if (customAuth) {
      return customAuth(session, req)
        ? await handler(reqWithSession, res)
        : res.status(401).json({ error: "unauthenticated" })
    }
    if (!session) {
      return res.status(401).json({ error: "unauthenticated" })
    }
    return await handler(reqWithSession, res)
  }
}
