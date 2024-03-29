import { both, cond, gte, lt, T, __ } from "ramda"
import { redirectToLogin } from "./clientRouting"
import { isClient } from "./enviroment"

type ReqOptions = {
  redirectToLogin?: boolean
} & RequestInit

const isHttpErrorCode = both(gte(__, 400), lt(__, 600))

const getBody = cond([
  [
    ({ headers }: Response) => headers.get("content-type")?.includes("application/json"),
    (response: Response) => response.json(),
  ],
  [
    ({ headers }: Response) => headers.get("content-type")?.includes("text"),
    (response: Response) => response.text(),
  ],
  [
    T,
    async (response: Response) => {
      try {
        return await response.json()
      } catch (error) {
        return {}
      }
    },
  ],
])

export type FetchJsonError<T = any> = Response & { body: T }

export async function fetchRaw(url: RequestInfo | URL, options?: ReqOptions) {
  const response = await fetch(url, options)
  const body = await getBody(response)
  if (isHttpErrorCode(response.status)) {
    throw { ...response, body } as FetchJsonError
  }
  return body
}

export async function fetchJson(url: RequestInfo | URL, options?: ReqOptions) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
    },
  })
  const body = await getBody(response)

  if (isHttpErrorCode(response.status)) {
    const shouldRedirectToLogin = isClient() && (options?.redirectToLogin ?? true)
    if (response.status === 401 && shouldRedirectToLogin) {
      return redirectToLogin()
    }
    throw { ...response, body } as FetchJsonError
  }
  return body
}

type RetryReqOptions = ReqOptions & { retries: number }

export const fetchJsonRetry = async (
  url: RequestInfo | URL,
  options: RetryReqOptions,
) => {
  try {
    return await fetchJson(url, options)
  } catch (err) {
    if (options.retries <= 1) {
      throw err
    }
    options.retries--
    return await fetchJsonRetry(url, options)
  }
}
