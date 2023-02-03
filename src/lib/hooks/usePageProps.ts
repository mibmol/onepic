import { createContext, useContext } from "react"

const PagePropsContext = createContext<any>({})

export const PagePropsProvider = PagePropsContext.Provider
export const usePageProps = () => useContext(PagePropsContext)
