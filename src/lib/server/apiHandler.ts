import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { getServerSession, Session } from "next-auth"
import { assoc, isEmpty } from "ramda"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import pino from "pino"
import { isNotNil } from "@/lib/utils"

export type NextApiRequestWithSession = NextApiRequest & { session: Session }

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "CONNECT"
  | "TRACE"

type CustomAuthCheck = (session: Session, req: NextApiRequest) => boolean

type ApiHandlerOptions = {
  methods?: HttpMethod[]
  authenticated?: boolean
  customAuthCheck?: CustomAuthCheck
  handler: (req: NextApiRequestWithSession, res: NextApiResponse) => Promise<void>
}

const logger = pino({ name: "api-handler.handler" })

export function createApiHandler({
  methods,
  authenticated: needsAuthentication,
  handler,
  customAuthCheck,
}: ApiHandlerOptions): NextApiHandler {
  return async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    try {
      if (
        methods &&
        !isEmpty(methods) &&
        !methods.includes(req.method?.toUpperCase() as HttpMethod)
      ) {
        return res.status(404).json({ error: "Not found. Http Method not allowed" })
      }

      if (needsAuthentication) {
        const session = await getServerSession(req, res, authOptions)
        const reqWithSession = assoc("session", session, req) as NextApiRequestWithSession
        return customAuthCheck?.(session, req) || isNotNil(session)
          ? await handler(reqWithSession, res)
          : res.status(401).json({ error: "No Authenticated" })
      }

      return await handler(req, res)
    } catch (error) {
      logger.error(error, `path: ${req.url}`)
      return res.status(500).json({ error })
    }
  }
}
