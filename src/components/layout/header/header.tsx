import { FC } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { ProfileMenu } from "@/components/content/ProfileMenu"
import { PopoverMenu, Text, Tag } from "@/components/common"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { cn } from "@/lib/utils"

const FeaturesMenuTrigger = ({ open }) => {
  return (
    <div
      className={cn(
        "flex items-center rounded h-10 pl-5 pr-4 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
      )}
    >
      <Text labelToken="Features" />
      <ChevronDownIcon
        className={cn(
          "h-5 w-5 mt-0.5 ml-px transition ease-in-out duration-300 dark:text-gray-300",
          open ? "rotate-180" : "rotate-0",
        )}
      />
    </div>
  )
}

const toolsOptions = [
  {
    path: "/restore-photo-image",
    titleToken: "feature.restorePhotos",
  },
  {
    path: "/quality-resolution-enhancer",
    titleToken: "feature.qualityEnhancer",
  },
  {
    path: "/remove-background",
    titleToken: "feature.removeBackground",
    isFree: true,
  },
  {
    path: "/colorize-image",
    titleToken: "feature.colorizeImage",
  },
]

const ToolsMenuContent = ({ onItemClick }) => {
  const { t } = useTranslation()
  return (
    <ul className="rounded-lg shadow-lg bg-white py-2 dark:border dark:shadow-none dark:bg-black dark:border-gray-800">
      {toolsOptions.map(({ path, titleToken, isFree }) => (
        <li key={path} className="min-w-max">
          <Link
            href={path}
            onClickCapture={onItemClick}
            className={`
              w-full flex items-center py-3 px-6 text-gray-600 
              hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700
            `}
          >
            {t(titleToken)}
            {isFree && <Tag labelToken="Free" className="ml-3" />}
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
      className="flex items-center rounded h-10 px-5 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <Text {...{ labelToken }} />
    </Link>
  )
}

type HeaderProps = {
  className?: string
}
export const Header: FC<HeaderProps> = ({ className }) => {
  const { t } = useTranslation()
  return (
    <header
      className={cn(
        `
        sticky top-0 flex justify-between items-center px-12 py-5 border-b border-gray-200 bg-white 
        dark:bg-black dark:border-gray-800 z-50`,
        className,
      )}
    >
      <Link href="/">
        <Image width="40" height="40" src="/brain_icon.png" alt={t("general.Home")} />
      </Link>
      <nav>
        <ul className="flex items-center">
          <li className="ml-2">
            <PopoverMenu
              trigger={(open) => <FeaturesMenuTrigger {...{ open }} />}
              triggerClassName="rounded border-none"
              content={({ onMouseLeave }) => (
                <ToolsMenuContent onItemClick={onMouseLeave} />
              )}
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
    </header>
  )
}
