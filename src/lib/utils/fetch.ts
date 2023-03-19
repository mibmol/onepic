import { both, gte, lt, __ } from "ramda"
import { redirectToLogin } from "./clientRouting"

type ReqOptions = {
  redirectToLogin?: boolean
} & RequestInit
const isHttpErrorCode = both(gte(__, 400), lt(__, 600))

export const fetchJson = async (url: RequestInfo | URL, options?: ReqOptions) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      "Content-Type": "application/json",
    },
  })

  const shouldRedirectToLogin = options?.redirectToLogin ?? true
  const body = await response.json()
  if (isHttpErrorCode(response.status)) {
    if (response.status === 401 && shouldRedirectToLogin) {
      return redirectToLogin()
    }
    throw { ...response, body }
  }
  return body
}
