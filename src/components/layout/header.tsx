import { FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { aiFeatures } from "@/lib/data/models"
import { ProfileMenu } from "@/components/content/ProfileMenu"
import { PopoverMenu, Text } from "@/components/common"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { cn } from "@/lib/utils"

const FeaturesMenuTrigger = ({ open }) => {
  return (
    <div
      className={cn(
        `flex items-center rounded h-10 pl-5 pr-4 hover:text-slate-800 hover:bg-slate-100`,
        {
          "bg-slate-200 dark:bg-slate-700": open,
        },
      )}
    >
      <Text labelToken="Features" />
      <ChevronDownIcon
        className={cn(
          "h-5 w-5 mt-0.5 ml-px transition ease-in-out duration-300 dark:text-slate-300",
          open ? "rotate-180" : "rotate-0",
        )}
      />
    </div>
  )
}

const ToolsMenuContent = () => {
  const { t } = useTranslation()
  return (
    <ul className="w-64 rounded-lg shadow-lg bg-white py-2 dark:bg-slate-900 dark:shadow-slate-800">
      {aiFeatures.map(({ path, titleToken }) => (
        <li key={path} className="w-full">
          <Link
            href={`/${path}`}
            className={`
              w-full inline-block py-3 px-5 text-slate-600 
              hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700
            `}
          >
            {t(titleToken)}
          </Link>
        </li>
      ))}
    </ul>
  )
}

const HeaderLink = ({ href, labelToken }) => {
  return (
    <Link
      {...{ href }}
      className="flex items-center rounded h-10 px-5 hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      <Text {...{ labelToken }} />
    </Link>
  )
}

export const Header: FC = () => {
  const { t } = useTranslation()
  return (
    <section className="flex justify-between items-center px-12 py-6">
      <Link href="/">
        <Image width="40" height="40" src="/brain_icon.png" alt={t("general.Home")} />
      </Link>
      <nav>
        <ul className="flex items-center">
          <li className="ml-2">
            <PopoverMenu
              trigger={(open) => <FeaturesMenuTrigger {...{ open }} />}
              triggerClassName="rounded border-none"
              content={<ToolsMenuContent />}
              contentClassName="left-1/2 transform -translate-x-1/2"
            />
          </li>
          <li className="ml-2">
            <HeaderLink href="/pricing" labelToken="Pricing" />
          </li>
          <li className="ml-2">
            <HeaderLink href="/support" labelToken="Support" />
          </li>
        </ul>
      </nav>
      <div>
        <ProfileMenu />
      </div>
    </section>
  )
}
