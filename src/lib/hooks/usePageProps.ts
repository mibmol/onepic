import { Context, createContext, useContext } from "react"

const PagePropsContext = createContext({})

export const PagePropsProvider = PagePropsContext.Provider
export function usePageProps<T>(): T {
  return useContext<T>(PagePropsContext as Context<T>)
}
