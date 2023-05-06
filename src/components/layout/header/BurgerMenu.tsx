import { Button, Divider, Img, PopoverMenu, Tag, Text } from "@/components/common"
import { BurguerMenuButton } from "./BurguerMenuButton"
import { LogoutButton, UserPlanInfo } from "@/components/content/ProfileMenu"
import { useSession } from "next-auth/react"
import { useTranslation } from "next-i18next"
import { HeaderLink } from "./HeaderLink"
import { ThemeSelector } from "@/components/content/ThemeSelector"
import Link from "next/link"
import { toolsOptions } from "./FeaturesPopoverMenu"
import { Fragment } from "react"

const ProfileInfo = () => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  if (!session) {
    return <Button href="/auth/signin" labelToken="Sign-in / Sign-up" className="py-2 justify-center mt-4" />
  }
  return (
    <div className="flex justify-between mt-4 px-5">
      <UserPlanInfo user={session.user} textGray />
      <Img
        className="rounded-full w-10 h-10 text-xs mt-1"
        src={session.user.image}
        alt={t("profile photo")}
      />
    </div>
  )
}

export const BurguerMenu = () => {
  const { t } = useTranslation()
  return (
    <PopoverMenu
      trigger={(isOpen) => <BurguerMenuButton {...{ isOpen }} />}
      contentClassName="px-4 top-20 left-0 right-0 bottom-0 bg-white dark:bg-black"
      content={() => (
        <>
          <div>
            <Button
              variant="secondary"
              labelToken="Support"
              href="/support"
              className="py-1.5 justify-center"
            />
            <ProfileInfo />
            <Divider className="mt-3" />
            <Link
              href="/pricing"
              className={`
                inline-block w-full py-4 pl-5
                group hover:bg-gray-100 dark:hover:bg-gray-900
              `}
            >
              <Text
                labelToken="Pricing"
                className="group-hover:text-gray-800 dark:group-hover:text-gray-300"
                gray
              />
            </Link>
            <Divider />
            <Link
              href="/dashboard"
              className={`
                inline-block w-full py-4 pl-5
                group hover:bg-gray-100 dark:hover:bg-gray-900
              `}
            >
              <Text
                labelToken="Dashboard"
                className="group-hover:text-gray-800 dark:group-hover:text-gray-300"
                gray
              />
            </Link>
            <Divider />
            <div
              className={`
                flex items-center justify-between py-2 pl-5 pr-3
                group hover:bg-gray-100 dark:hover:bg-gray-900
              `}
            >
              <Text
                labelToken="Theme"
                className="group-hover:text-gray-800 dark:group-hover:text-gray-300"
                gray
              />
              <ThemeSelector />
            </div>
            <Divider className="mt-px" />
            <LogoutButton className="pl-5 py-4 dark:hover:bg-gray-800" />
            <Divider />
          </div>
          <div className="mt-8">
            <Text labelToken="Features" className="mt-8 ml-5" semibold />
            <Divider className="mt-4" />
            {toolsOptions.map(({ path, titleToken, isFree }) => (
              <Fragment key={path}>
                <Link
                  href={path}
                  className={`
                    w-full flex items-center py-4 px-6 text-gray-600
                    hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900
                  `}
                >
                  {t(titleToken)}
                  {isFree && <Tag labelToken="Free" className="ml-3" />}
                </Link>
                <Divider />
              </Fragment>
            ))}
          </div>
        </>
      )}
      fixedContent
    />
  )
}
