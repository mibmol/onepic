import { getSystemMode, getUserMode, themeSlice } from "@/lib/state/themeSlice"
import { useAppSelector } from "@/lib/state/hooks"
import { isClient } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { useDispatch } from "react-redux"

const { setMode } = themeSlice.actions

export const ThemeModeInitializer = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (isClient()) {
      dispatch(setMode(getUserMode()))
    }
  }, [dispatch])

  return <></>
}

export const useTheme = () => useAppSelector(({ theme }) => theme)
export const useThemeMode = () => {
  const { mode, clientInitialized } = useTheme()
  if (!clientInitialized) return "system"
  if (mode === "system" && isClient()) return getSystemMode()
  return mode
}
