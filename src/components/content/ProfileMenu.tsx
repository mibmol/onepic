import { ArrowRightOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { Button, Img, PopoverMenu, Text } from "@/components/common"
import { FC, useState } from "react"
import { ThemeSelector } from "./ThemeSelector"
import useSWR from "swr"
import { getUserPlanInfo } from "@/lib/client/payment"

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

const PlanInfo: FC = () => {
  const {} = useSWR("planInfo", getUserPlanInfo)
  return <></>
}

const ProfileMenuContent = ({ user }) => {
  const { t } = useTranslation()
  return (
    <div className="w-72 py-4 rounded bg-white shadow-lg dark:bg-black dark:border dark:border-gray-800 ">
      <div className="px-6">
        <Text as="h3" semibold>
          {user.name}
        </Text>
        <Text as="h3" gray>
          {user.email}
        </Text>
      </div>
      <div>
        <PlanInfo />
      </div>
      <ul className="mt-3">
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
