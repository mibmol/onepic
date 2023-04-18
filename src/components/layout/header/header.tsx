import { FC, useEffect, useRef } from "react"
import Link from "next/link"
import { ProfileMenu } from "@/components/content/ProfileMenu"
import { Text, Button } from "@/components/common"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/common/icons"
import { useRouter } from "next/router"
import { FeaturesPopoverMenu } from "@/components/content/header/FeaturesPopoverMenu"
import { FeedbackPopover } from "@/components/content/header/FeedbackPopover"

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
            <FeaturesPopoverMenu />
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
            <FeedbackPopover />
          </li>
        </ul>
      </nav>
      <div className="flex justify-end w-48">
        <ProfileMenu />
      </div>
    </header>
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
