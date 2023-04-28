import { Text } from "@/components/common"
import Link from "next/link"
import { Fragment } from "react"
import { ThemeSelector } from "@/components/content/ThemeSelector"
import { useSession } from "next-auth/react"

const services = [
  { labelToken: "Replicate", href: "https://replicate.com/explore" },
  { labelToken: "Vercel", href: "https://vercel.com/" },
]

export const Footer = () => {
  const { data: session } = useSession()
  return (
    <footer className="sticky top-[100vh] flex items-center justify-between mt-8 py-6 px-8 border-t border-gray-200 dark:border-gray-800">
      <div>
        <Text labelToken="Powered by" />
        {services.map(({ href, labelToken }, index) => {
          const isLast = index === services.length - 1
          return (
            <Fragment key={labelToken}>
              {isLast && <Text labelToken="and" className="ml-1" />}
              <Link {...{ href }}>
                <Text {...{ labelToken }} className="ml-1" bold />
                {!isLast && services.length > 2 && <Text bold>{","}</Text>}
              </Link>
            </Fragment>
          )
        })}
      </div>
      {!session && <ThemeSelector dropdownPlacement="top" />}
    </footer>
  )
}
