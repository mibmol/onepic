import { cn, removeSimilarTWClasses } from "@/lib/utils"
import { always, cond, equals } from "ramda"
import { FC, ReactElement, ReactNode, useState } from "react"
import { Text } from "./Text"
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"

type MessageVariant = "info" | "warning" | "danger"

type MessageProps = {
  variant?: MessageVariant
  title: ReactNode
  description?: ReactNode
  actions?: ReactElement
  className?: string
  iconClassName?: string
  dismissable?: boolean
}

const getMesageContainerColorClasses = cond<MessageVariant[], string>([
  [equals<MessageVariant>("info"), always(`bg-indigo-50 dark:bg-indigo-900`)],
  [equals<MessageVariant>("warning"), always(`bg-amber-50 dark:bg-amber-700`)],
  [equals<MessageVariant>("danger"), always(`bg-red-50 dark:bg-red-800`)],
])

const getIconMesageColorClasses = cond<MessageVariant[], string>([
  [equals<MessageVariant>("info"), always(`stroke-indigo-700 dark:stroke-indigo-200`)],
  [equals<MessageVariant>("warning"), always(`stroke-amber-700 dark:stroke-amber-200`)],
  [equals<MessageVariant>("danger"), always(`stroke-rose-700 dark:stroke-rose-200`)],
])

const mesageIcon = {
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  danger: ExclamationCircleIcon,
}

export const Messsage: FC<MessageProps> = ({
  variant = "info",
  title,
  description,
  actions,
  className,
  iconClassName,
  dismissable = false,
}) => {
  const [show, setShow] = useState(true)
  if (!show) {
    return <></>
  }
  const Icon = mesageIcon[variant]
  return (
    <div
      className={cn(
        "flex px-4 py-3 rounded-md justify-between",
        getMesageContainerColorClasses(variant),
        className,
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-center">
          <Icon
            className={removeSimilarTWClasses(
              cn(
                "w-5 stroke-2 mr-2 my-auto",
                getIconMesageColorClasses(variant),
                iconClassName,
              ),
            )}
          />
          {title && (
            <Text size="sm" medium>
              {title}
            </Text>
          )}
        </div>
        <div className="ml-7">
          {description && (
            <Text size="sm" className="max-w-xl">
              {description}
            </Text>
          )}
          {actions}
        </div>
      </div>
      <div className="mt-1">
        {dismissable && (
          <button
            type="button"
            aria-label="dismiss this card"
            onClick={() => setShow(false)}
          >
            <XMarkIcon className="stroke-2 stroke-gray-600 w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
