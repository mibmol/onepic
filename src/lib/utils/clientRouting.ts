import Router, { NextRouter } from "next/router"
import { isServer } from "./enviroment"
import { forEachObjIndexed } from "ramda"

export async function redirectToLogin(router?: NextRouter) {
  const { pathname, search } = window.location
  const params = new URLSearchParams({
    callbackUrl: pathname + (search ?? ""),
  })
  return (router ?? Router).push(`/auth/signin?${params.toString()}`)
}

export function getURLLastPathname(href: string): string {
  return new URL(href).pathname.split("/").pop()
}

export function getQueryParams(): URLSearchParams {
  const params = isServer()
    ? new URLSearchParams({})
    : new URL(window.location.href).searchParams

  return params
}

export function getPathWithQueryParams(): string {
  if (isServer()) return ""
  const { pathname, search } = window.location
  return `${pathname}${search}`
}

export function getQueryParamsWith(values: Record<string, string>) {
  const params = getQueryParams()
  forEachObjIndexed((value, key) => params.set(key, value), values)
  return params
}
