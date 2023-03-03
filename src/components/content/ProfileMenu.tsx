import { useTheme } from "@/lib/hooks"
import { themeSlice } from "@/lib/state/themeSlice"
import { cn } from "@/lib/utils"
import { Listbox } from "@headlessui/react"
import {
  CheckIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/20/solid"
import {
  ArrowRightOnRectangleIcon,
  ChevronUpDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { propEq } from "ramda"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { Img, PopoverMenu } from "@/components/common"

export function ProfileMenu() {
  const { data: session } = useSession()
  const { t } = useTranslation()

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn()}>{t("Login")}</button>
        <button onClick={() => signIn()}>{t("Signup")}</button>
      </div>
    )
  }

  return (
    <PopoverMenu
      triggerClassName="rounded-full"
      trigger={() => <ProfileMenuTrigger imageUrl={session.user.image} />}
      contentClassName="right-px"
      content={<ProfileMenuContent user={session.user} />}
    />
  )
}

const ProfileMenuTrigger = ({ imageUrl }) => {
  const { t } = useTranslation()
  const [showUserImage, setShowUserImage] = useState(!!imageUrl)

  return showUserImage ? (
    <picture>
      <Img
        className="rounded-full w-9 h-9 text-xs"
        src={imageUrl}
        alt={t("Profile pic")}
        onEndRetries={() => setShowUserImage(false)}
      />
    </picture>
  ) : (
    <UserCircleIcon className="w-9 h-9 text-slate-600" />
  )
}

const ProfileMenuContent = ({ user }) => {
  const { t } = useTranslation()
  return (
    <div className="w-72 shadow-lg rounded py-4 bg-white">
      <div className="px-6">
        <h3>{user.name}</h3>
        <h2 className="text-gray-500">{user.email}</h2>
      </div>
      <ul className="mt-3">
        <li>
          <Link
            href="/dashboard"
            className="inline-block w-full rounded py-3 pl-6 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            {t("Dashboard")}
          </Link>
        </li>
        <li>
          <div className="flex items-center justify-between py-3 pl-6 pr-3 text-slate-500 hover:text-slate-800">
            <span>{t("Theme")}</span>
            <ThemeSelector />
          </div>
        </li>
        <li>
          <button
            onClick={() => signOut()}
            className="w-full flex justify-between pr-4 py-3 pl-6 text-left rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            {t("Log Out")}
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </li>
      </ul>
    </div>
  )
}

const themesOptions = [
  {
    name: "system",
    labelToken: "theme.system",
    icon: <ComputerDesktopIcon className="w-4 h-4" />,
  },
  { name: "dark", labelToken: "theme.dark", icon: <MoonIcon className="w-4 h-4" /> },
  { name: "light", labelToken: "theme.light", icon: <SunIcon className="w-4 h-4" /> },
]

const { setMode } = themeSlice.actions

const ThemeSelector = () => {
  const { t } = useTranslation()
  const { mode } = useTheme()
  const dispatch = useDispatch()
  const selected = themesOptions.find(propEq("name", mode))
  const changeThemeMode = useCallback(({ name }) => dispatch(setMode(name)), [dispatch])

  return (
    <Listbox as="div" className="relative" onChange={changeThemeMode}>
      <Listbox.Button className="w-32 py-1.5 px-3 flex justify-between items-center rounded border-2 bg-slate-100 text-left hover:border-slate-400">
        <div className="flex items-center text-sm">
          {selected.icon}
          <span className="ml-2">{t(selected.labelToken)}</span>
        </div>
        <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
      </Listbox.Button>
      <Listbox.Options className="absolute w-32 py-2 rounded shadow-lg cursor-pointer bg-gray-100">
        {themesOptions.map((theme) => (
          <Listbox.Option
            key={theme.name}
            value={theme}
            className={"flex items-center py-1 hover:bg-gray-300"}
          >
            <div className="w-3 ml-3">
              {selected.name == theme.name && <CheckIcon className="w-3 stroke-2" />}
            </div>
            <span className="text-sm  ml-3">{t(theme.labelToken)}</span>
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}
