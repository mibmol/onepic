import startWebhookListener from "@/lib/client/webhookListener"
import { useAppDispatch } from "@/lib/state/hooks"
import { getUserMode, themeSlice } from "@/lib/state/themeSlice"
import { isClient, isDev } from "@/lib/utils"
import { callFunctionsInArray } from "@/lib/utils/function"
import { FC, useEffect } from "react"

const { setMode } = themeSlice.actions

export const AppInitializer: FC = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const cleanUpFunctions = []

    if (isClient()) {
      dispatch(setMode(getUserMode()))
      isDev() && cleanUpFunctions.push(startWebhookListener())
    }

    return () => {
      callFunctionsInArray(cleanUpFunctions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}
