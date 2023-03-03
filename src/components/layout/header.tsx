import { FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { aiFeatures } from "@/lib/data/models"
import { ProfileMenu } from "@/components/content/ProfileMenu"
import { PopoverMenu } from "@/components/common"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { cn } from "@/lib/utils"

const ToolsMenuTrigger = ({ open }) => {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        "flex items-center rounded py-2 px-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100",
        {
          "bg-slate-200 hover:bg-slate-200 text-slate-800": open,
        },
      )}
    >
      {t("AI tools")}
      <ChevronDownIcon
        className={cn(
          "h-5 w-5 mt-0.5 ml-px transition ease-in-out duration-300",
          open ? "rotate-180" : "rotate-0",
        )}
      />
    </div>
  )
}

const ToolsMenuContent = () => {
  const { t } = useTranslation()
  return (
    <ul className="w-64 rounded-lg shadow-lg bg-white py-2">
      {aiFeatures.map(({ path, titleToken }) => (
        <li key={path} className="w-full">
          <Link
            href={`/${path}`}
            className="w-full inline-block py-3 px-5 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          >
            {t(titleToken)}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export const Header: FC = () => {
  const { t } = useTranslation()
  return (
    <section className="flex flex-row justify-between items-center px-12 py-6">
      <Link href="/">
        <Image width="40" height="40" src="/brain_icon.png" alt={t("general.Home")} />
      </Link>
      <nav>
        <ul className="flex items-center">
          <li className="ml-2">
            <PopoverMenu
              trigger={(open) => <ToolsMenuTrigger {...{ open }} />}
              triggerClassName="rounded"
              content={<ToolsMenuContent />}
              contentClassName="left-1/2 transform -translate-x-1/2"
            />
          </li>
          <li className="ml-2">
            <Link
              href="/pricing"
              className="rounded py-3 px-5 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            >
              {t("Pricing")}
            </Link>
          </li>
          <li className="ml-2">
            <Link
              href="/support"
              className="rounded py-3 px-5 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
            >
              {t("Support")}
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <ProfileMenu />
      </div>
    </section>
  )
}
