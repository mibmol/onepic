import Router from "next/router"

export const redirectToLogin = async () => {
  const { pathname, search } = window.location
  const params = new URLSearchParams({
    callbackUrl: pathname + (search ?? ""),
  })
  return Router.push(`/auth/signin?${params.toString()}`)
}

export const getURLLastPathname = (href: string): string =>
  new URL(href).pathname.split("/").pop()
