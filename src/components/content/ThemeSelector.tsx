import { useTheme } from "@/lib/hooks"
import { themeSlice } from "@/lib/state/themeSlice"
import { Listbox } from "@headlessui/react"
import {
  CheckIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid"
import { ChevronUpDownIcon } from "@heroicons/react/24/outline"
import { propEq } from "ramda"
import { useCallback } from "react"
import { useTranslation } from "next-i18next"
import { useDispatch } from "react-redux"
import { Text } from "@/components/common"

const { setMode } = themeSlice.actions

const iconClassName = `
  w-4 h-4
  dark:text-slate-300
`
const themesOptions = [
  {
    name: "system",
    labelToken: "theme.system",
    icon: <ComputerDesktopIcon className={iconClassName} />,
  },
  {
    name: "dark",
    labelToken: "theme.dark",
    icon: <MoonIcon className={iconClassName} />,
  },
  {
    name: "light",
    labelToken: "theme.light",
    icon: <SunIcon className={iconClassName} />,
  },
]

export const ThemeSelector = () => {
  const { t } = useTranslation()
  const { mode } = useTheme()
  const dispatch = useDispatch()
  const selected = themesOptions.find(propEq("name", mode))
  const changeThemeMode = useCallback(({ name }) => dispatch(setMode(name)), [dispatch])

  return (
    <Listbox as="div" className="relative" onChange={changeThemeMode}>
      <Listbox.Button
        className={`
          w-32 py-1.5 px-3 flex justify-between items-center rounded border border-slate-300
          hover:border-slate-500 dark:text-slate-200 dark:border-slate-700 dark:hover:border-slate-500
        `}
      >
        <div className="flex items-center text-sm">
          {selected.icon}
          <Text labelToken={selected.labelToken} className="ml-2" />
        </div>
        <ChevronUpDownIcon className="h-5 w-5" />
      </Listbox.Button>
      <Listbox.Options className="absolute w-32 py-2 rounded shadow-lg cursor-pointer bg-slate-100 dark:bg-slate-800">
        {themesOptions.map((theme) => (
          <Listbox.Option
            key={theme.name}
            value={theme}
            className={
              "flex items-center py-1 hover:bg-slate-300 dark:hover:bg-slate-700"
            }
          >
            <div className="w-3 ml-3">
              {selected.name == theme.name && (
                <Text>
                  <CheckIcon className="w-3 stroke-2" />
                </Text>
              )}
            </div>
            <Text labelToken={theme.labelToken} size="sm" className="ml-3" />
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}
