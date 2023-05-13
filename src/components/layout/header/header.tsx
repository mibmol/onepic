import { FC, useEffect, useRef } from "react"
import Link from "next/link"
import { ProfileMenu } from "@/components/content/ProfileMenu"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/common/icons"
import { useRouter } from "next/router"
import { BurguerMenu } from "./BurgerMenu"
import { HeaderLink } from "./HeaderLink"
import { FeaturesPopoverMenu } from "./FeaturesPopoverMenu"
import { FeedbackPopover } from "./FeedbackPopover"

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
    if (showBottomLineOnScroll) {
      const handler = () => {
        window.scrollY > 16
          ? headerRef.current.classList.add("border-b")
          : headerRef.current.classList.remove("border-b")
      }
      document.addEventListener("scroll", handler)
      return () => document.removeEventListener("scroll", handler)
    }
  }, [showBottomLineOnScroll])

  return (
    <header
      ref={headerRef}
      className={cn(
        `
          top-0 flex justify-between items-center pl-4 pr-1 lg:pl-12 lg:pr-12 py-5 border-gray-200 bg-white z-200
          dark:bg-black dark:border-gray-800
        `,
        { sticky: !noSticky },
        className,
      )}
    >
      <Link href="/">
        <Logo className="h-6" />
      </Link>
      <nav className="hidden lg:flex">
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
            <HeaderLink
              href="https://witcherai.freshdesk.com/support/tickets/new"
              target="_black"
              labelToken="Support"
            />
          </li>
          <li>
            <FeedbackPopover />
          </li>
        </ul>
      </nav>
      <div className="hidden lg:flex justify-end w-48">
        <ProfileMenu />
      </div>
      <div className="flex lg:hidden justify-end w-48">
        <BurguerMenu />
      </div>
    </header>
  )
}
