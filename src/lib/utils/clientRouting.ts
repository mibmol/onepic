import Router from "next/router"

export const redirectToLogin = async () => {
  const params = new URLSearchParams({ callbackUrl: window.location.href })
  return Router.push(`/api/auth/signin?${params.toString()}`)
}

export const getURLLastPathname = (href: string): string =>
  new URL(href).pathname.split("/").pop()
