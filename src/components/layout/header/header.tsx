import { FC, useEffect, useRef } from "react"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { ProfileMenu } from "@/components/content/ProfileMenu"
import { PopoverMenu, Text, Tag, Button } from "@/components/common"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/common/icons"
import { useRouter } from "next/router"

const FeaturesMenuTrigger = ({ open }) => {
  return (
    <div
      className={cn(`
        flex items-center rounded h-10 pl-5 pr-4 
          dark:hover:bg-gray-700
        hover:text-gray-800 hover:bg-gray-100 
      `)}
    >
      <Text labelToken="Features" medium />
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
    titleToken: "feature.restorePhotos.title",
  },
  {
    path: "/quality-resolution-enhancer",
    titleToken: "feature.qualityEnhancer.title",
  },
  {
    path: "/remove-background",
    titleToken: "feature.removeBackground.title",
    isFree: true,
  },
  {
    path: "/colorize-image",
    titleToken: "feature.colorizeImage.title",
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
      scroll={false}
    >
      <Text {...{ labelToken }} medium />
    </Link>
  )
}

type HeaderProps = {
  className?: string
  showBottomLineOnScroll?: boolean
  noSticky?: boolean
}

export const Header: FC<HeaderProps> = ({
  className,
  showBottomLineOnScroll = true,
  noSticky,
}) => {
  const headerRef = useRef<HTMLElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = () => {
      showBottomLineOnScroll && window.scrollY > 16
        ? headerRef.current.classList.add("border-b")
        : headerRef.current.classList.remove("border-b")
    }
    document.addEventListener("scroll", handler)
    return () => document.removeEventListener("scroll", handler)
  }, [showBottomLineOnScroll])

  return (
    <header
      ref={headerRef}
      className={cn(
        `
          top-0 flex justify-between items-center px-12 py-5 border-gray-200 bg-white z-200
          dark:bg-black dark:border-gray-800
        `,
        { sticky: !noSticky },
        className,
      )}
    >
      <Link href="/">
        <Logo className="h-6" />
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
            <HeaderLink
              href={router.pathname === "/" ? "/#pricing" : "/pricing"}
              labelToken="Pricing"
            />
          </li>
          <li className="ml-2">
            <HeaderLink href="/support" labelToken="Support" />
          </li>
          <li>
            <Button labelToken="Feedback" variant="secondary" className="py-1 ml-2" />
          </li>
        </ul>
      </nav>
      <div className="flex justify-end w-48">
        <ProfileMenu />
      </div>
    </header>
  )
}
