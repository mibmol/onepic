import Router from "next/router"
import { isServer } from "./enviroment"

export async function redirectToLogin() {
  const { pathname, search } = window.location
  const params = new URLSearchParams({
    callbackUrl: pathname + (search ?? ""),
  })
  return Router.push(`/auth/signin?${params.toString()}`)
}

export const getURLLastPathname = (href: string): string =>
  new URL(href).pathname.split("/").pop()

export const getQueryParams = () => {
  const params = isServer()
    ? new URLSearchParams({})
    : new URL(window.location.href).searchParams

  return {
    ...params,
    get: (key: string, defaultValue?: string) => {
      return params.get(key) ?? defaultValue
    },
  }
}
