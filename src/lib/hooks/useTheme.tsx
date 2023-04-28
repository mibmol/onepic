import { getSystemMode } from "@/lib/state/themeSlice"
import { useAppSelector } from "@/lib/state/hooks"
import { isClient } from "@/lib/utils"

export const useTheme = () => useAppSelector(({ theme }) => theme)

export function useThemeMode() {
  const { mode, clientInitialized } = useTheme()
  if (!clientInitialized) return "system"
  if (mode === "system" && isClient()) return getSystemMode()
  return mode
}
