import "@/styles/globals.css"
import { appWithTranslation } from "next-i18next"
import { SessionProvider } from "next-auth/react"
import { AppPropsWithLayout } from "@/lib/utils/next"
import { ReduxProvider } from "@/lib/state/store"
import { Toaster } from "react-hot-toast"
import { AppInitializer } from "@/components/content/AppInitializer"

const App = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  return (
    <div className="min-h-screen" >
      <SessionProvider {...{ session }}>
        <ReduxProvider>
          {getLayout(<Component {...pageProps} />)}
          <Toaster position="bottom-right" />
          <AppInitializer />
        </ReduxProvider>
      </SessionProvider>
    </div>
  )
}

export default appWithTranslation(App as any)
