import { both, gte, lt, __ } from "ramda"
import { redirectToLogin } from "./clientRouting"

const isHttpErrorCode = both(gte(__, 400), lt(__, 600))

export const fetchJson = async (url: RequestInfo | URL, init?: RequestInit) => {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      "Content-Type": "application/json",
    },
  })

  const body = await response.json()
  if (isHttpErrorCode(response.status)) {
    if (response.status === 401) {
      return redirectToLogin()
    }
    throw { ...response, body }
  }
  return body
}
