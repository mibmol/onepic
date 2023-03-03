import { complement, isNil } from "ramda"

export const isServer = () =>
  typeof window === "undefined" && typeof document === "undefined"
export const isClient = complement(isServer)
export const isDev = () => process.env.NODE_ENV === "development"
export const isProd = () => process.env.NODE_ENV === "production"
export const isTest = () => process.env.NODE_ENV === "test"
