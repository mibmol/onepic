import { FC, useEffect } from "react"
import { themeSlice } from "../state/themeSlice"
import { useDispatch } from "react-redux"
import { useAppSelector } from "../state/hooks"

const { setMode } = themeSlice.actions
export const ThemeSystemChangeListener: FC = () => {
  const mode = useAppSelector(({ theme }) => theme.mode)
  const dispatch = useDispatch()

  useEffect(() => {
    if (mode === "system") {
      const handleThemeChange = () => dispatch(setMode("system"))
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      media.addEventListener("change", handleThemeChange)
      return () => media.removeEventListener("change", handleThemeChange)
    }
  }, [dispatch, mode])

  return <></>
}

export const useTheme = () => useAppSelector(({ theme }) => theme)
