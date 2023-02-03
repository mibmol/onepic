import "@/styles/globals.css"
import { appWithTranslation } from "next-i18next"
import { SessionProvider } from "next-auth/react"
import { AppPropsWithLayout } from "@/lib/utils/next"
import { ReduxProvider } from "@/lib/state/store"
import { Toaster } from "react-hot-toast"

const App = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <SessionProvider {...{ session }}>
      <ReduxProvider>
        {getLayout(<Component {...pageProps} />)}
        <Toaster position="bottom-right" />
      </ReduxProvider>
    </SessionProvider>
  )
}

export default appWithTranslation(App as any)
