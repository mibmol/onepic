import { createSlice } from "@reduxjs/toolkit"
import { isClient } from "@/lib/utils"

type ThemeMode = "system" | "dark" | "light"

type Theme = {
  mode: ThemeMode
  color?: any
}

const themeLocalStorageKey = "themeMode"

const getSystemMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

const updateClassName = (mode: ThemeMode) => {
  const isDark = mode === "dark" || (mode === "system" && getSystemMode() === "dark")
  isDark
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark")
}

const getUserMode = (): ThemeMode => {
  const mode =
    (window.localStorage.getItem(themeLocalStorageKey) as ThemeMode) ?? "system"
  updateClassName(mode)
  return mode
}

const getInitialState = (): Theme => ({
  mode: isClient() ? getUserMode() : "system",
})

export const themeSlice = createSlice({
  name: "theme",
  initialState: getInitialState,
  reducers: {
    setMode: (state, { payload }) => {
      window.localStorage.setItem(themeLocalStorageKey, payload)
      updateClassName(payload)
      state.mode = payload
    },
  },
})
