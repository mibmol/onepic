import { cn } from "@/lib/utils"
import { always, cond, equals } from "ramda"
import { Component, FC, ReactComponentElement, ReactElement, useMemo } from "react"
import { Text } from "./Text"
import {
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"

type MessageVariant = "info" | "warning" | "danger"

type MessageProps = {
  variant?: MessageVariant
  titleToken?: string
  descriptionToken?: string
  actions?: ReactElement
  className?: string
}

const getMesageContainerColorClasses = cond<MessageVariant[], string>([
  [
    equals<MessageVariant>("info"),
    always(
      `
        `,
    ),
  ],
  [
    equals<MessageVariant>("warning"),
    always(
      `
        `,
    ),
  ],
  [
    equals<MessageVariant>("danger"),
    always(`
     
    `),
  ],
])

const mesageIcon = {
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
  danger: ExclamationCircleIcon,
}

export const Messsage: FC<MessageProps> = ({
  variant,
  titleToken,
  descriptionToken,
  actions,
  className,
}) => {
  const classes = useMemo(
    () => cn(getMesageContainerColorClasses(variant), className),
    [variant, className],
  )
  return (
    <div className={classes}>
      <div>
        {titleToken && <Text as="p" size="lg" labelToken={titleToken} />}
        {descriptionToken && <Text as="p" labelToken={descriptionToken} />}
        {actions}
      </div>
    </div>
  )
}
