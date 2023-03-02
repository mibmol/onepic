import { Listbox, Transition } from "@headlessui/react"
import { ChevronUpDownIcon } from "@heroicons/react/24/outline"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { Fragment, useState } from "react"
import { useTranslation } from "react-i18next"
import { PopoverMenu } from "../common/PopoverMenu"

export function ProfileMenu() {
  const { data: session } = useSession()
  const { t } = useTranslation()

  if (!session) {
    return (
      <div>
        <button>{t("Login")}</button>
        <button>{t("Signup")}</button>
      </div>
    )
  }

  const { name, email, image } = session.user

  return (
    <PopoverMenu
      triggerClassName="rounded-full"
      trigger={() => (
        <picture>
          <img
            className="rounded-full w-9 h-9"
            src={image}
            alt={t("{{name}} profile pic", { name })}
          />
        </picture>
      )}
      contentClassName="right-px"
      content={
        <div className="w-72 shadow-lg rounded py-4">
          <div className="px-6">
            <h3>{name}</h3>
            <h2 className="text-gray-500">{email}</h2>
          </div>
          <ul>
            <li>
              <Link
                href="/dashboard"
                className="rounded py-3 px-5 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              >
                {t("Dashboard")}
              </Link>
            </li>
            <li>
              <div className="flex items-center justify-between py-3 px-5 text-slate-600 hover:text-slate-800">
                <span>{t("Theme")}</span>
                <ThemeSelector />
              </div>
            </li>
          </ul>
        </div>
      }
    />
  )
}

const themes = [
  { name: "system", labelToken: "theme.system" },
  { name: "dark", labelToken: "theme.dark" },
  { name: "light", labelToken: "theme.light" },
]

const ThemeSelector = () => {
  const [selected, setSelected] = useState(themes[0])

  return (
    <Listbox>
      <Listbox.Button className="relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
        <span className="block truncate">{selected.name}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </Listbox.Button>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute mt-1 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {themes.map(({ name, labelToken }) => (
            <Listbox.Option
              key={name}
              className={({ active }) =>
                `relative cursor-default select-none py-1 pl-10 pr-4 ${
                  active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                }`
              }
              value={name}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {name}
                  </span>
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}
