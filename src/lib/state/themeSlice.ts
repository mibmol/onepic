import { createSlice } from "@reduxjs/toolkit"
import { isClient } from "@/lib/utils"

export type ThemeMode = "system" | "dark" | "light"

type Theme = {
  mode: ThemeMode
  color: any
  clientInitialized: boolean
}

const themeLocalStorageKey = "themeMode"

const isValidThemeMode = (mode: string) => ["system", "dark", "light"].includes(mode)

export const getSystemMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

const updateClassName = (mode: ThemeMode) => {
  const isDark = mode === "dark" || (mode === "system" && getSystemMode() === "dark")
  isDark
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark")
}

export const getUserMode = (): ThemeMode => {
  const storedMode = window.localStorage.getItem(themeLocalStorageKey) as ThemeMode
  const mode = isValidThemeMode(storedMode) ? storedMode : "system"
  updateClassName(mode)
  return mode
}

const getInitialState = (): Theme => ({
  clientInitialized: false,
  mode: "system",
  color: {},
})

export const themeSlice = createSlice({
  name: "theme",
  initialState: getInitialState,
  reducers: {
    setMode: (state, { payload }) => {
      window.localStorage.setItem(themeLocalStorageKey, payload)
      updateClassName(payload)
      state.mode = payload
      state.clientInitialized = true
    },
  },
})
