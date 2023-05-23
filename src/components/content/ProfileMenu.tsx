import { ArrowRightOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { Button, Img, PopoverMenu, Text } from "@/components/common"
import { FC, useState } from "react"
import { ThemeSelector } from "./ThemeSelector"
import useSWR from "swr"
import { getUserPlanInfo } from "@/lib/client/payment"
import { cn, removeSimilarTWClasses } from "@/lib/utils"

export function ProfileMenu() {
  const { data: session } = useSession()

  if (!session) {
    return <Button href="/auth/signin" labelToken="Sign-in / Sign-up" className="py-2" />
  }

  return (
    <PopoverMenu
      triggerClassName="outline-none rounded-full w-10 h-10 flex items-center justify-center"
      trigger={() => <ProfileMenuTrigger imageUrl={session.user.image} />}
      contentClassName="right-px"
      content={() => <ProfileMenuContent user={session.user} />}
      openOnHover
    />
  )
}

const ProfileMenuTrigger = ({ imageUrl }) => {
  const { t } = useTranslation()
  const [showUserImage, setShowUserImage] = useState(!!imageUrl)

  return showUserImage ? (
    <picture>
      <Img
        className="rounded-full w-10 h-10 text-xs"
        src={imageUrl}
        alt={t("User photo")}
        onEndRetries={() => setShowUserImage(false)}
        successLoad={() => setShowUserImage(true)}
      />
    </picture>
  ) : (
    <UserCircleIcon className="w-10 h-10 text-gray-600 dark:text-gray-200" />
  )
}

export const UserPlanInfo: FC<{ user: any; textGray?: boolean }> = ({
  user,
  textGray,
}) => {
  const { data } = useSWR("planInfox", getUserPlanInfo)
  return (
    <div>
      <Text as="h2" gray={textGray} semibold>
        {user.name}
      </Text>
      {data ? (
        <>
          <Text as="h3">
            <Text labelToken="Credits" size="sm" gray={textGray} />:
            <Text className="ml-2" size="sm" gray={textGray} medium>
              {data.credits}
            </Text>
          </Text>
          {data.subscription && (
            <Text as="h3">
              <Text labelToken="Subscription" size="sm" gray={textGray} />:
              <Text
                className="ml-2"
                labelToken="active"
                size="sm"
                gray={textGray}
                medium
              />
            </Text>
          )}
          {data.credits === 0 && (
            <Button
              variant="tertiary"
              href="/pricing"
              labelToken="Buy credits"
              className="-ml-3"
            />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export const ProfileMenuContent = ({ user }) => {
  const { t } = useTranslation()
  return (
    <div className="w-72 py-4 rounded bg-white shadow-lg dark:bg-black dark:border dark:border-gray-800 ">
      <div className="border-b border-gray-200 pb-4 dark:border-gray-700 px-6">
        <UserPlanInfo {...{ user }} />
      </div>
      <ul className="mt-2">
        <li>
          <Link
            href="/dashboard"
            className={`
              inline-block w-full py-3 pl-6
              group hover:bg-gray-100 dark:hover:bg-gray-700
              
            `}
          >
            <Text
              labelToken="Dashboard"
              className="group-hover:text-gray-800 dark:group-hover:text-gray-300"
              gray
            />
          </Link>
        </li>
        <li>
          <div
            className={`
              flex items-center justify-between py-3 pl-6 pr-3 group
            `}
          >
            <Text
              labelToken="Theme"
              className="group-hover:text-gray-800 dark:group-hover:text-gray-300"
              gray
            />
            <ThemeSelector />
          </div>
        </li>
        <li>
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className={`
              w-full pr-4 py-3 pl-6
              group hover:bg-gray-100 dark:hover:bg-gray-700
            `}
          >
            <Text
              className="flex justify-between group-hover:text-gray-800 dark:group-hover:text-gray-300"
              gray
            >
              {t("Log Out")}
              <ArrowRightOnRectangleIcon className="w-5 h-5 stroke-2" />
            </Text>
          </button>
        </li>
      </ul>
    </div>
  )
}

export const LogoutButton = ({ className = "pl-6" }) => {
  const { t } = useTranslation()
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
      className={removeSimilarTWClasses(
        cn(
          `
        w-full pr-4 py-3 
        group hover:bg-gray-100 dark:hover:bg-gray-700
      `,
          className,
        ),
      )}
    >
      <Text
        className="flex justify-between group-hover:text-gray-800 dark:group-hover:text-gray-300"
        gray
      >
        {t("Log Out")}
        <ArrowRightOnRectangleIcon className="w-5 h-5 stroke-2" />
      </Text>
    </button>
  )
}
