import { Button, Text } from "@/components/common"
import { ComponentType, FC, PropsWithChildren, SVGProps } from "react"
import { cn, isNotNil } from "@/lib/utils"
import { isNil } from "ramda"

export type ConfigSectionProps = PropsWithChildren & {
  titleToken: string
  actionToken?: string
  actionMessage?: string
  actionHref?: string
  actionLoading?: boolean
  onActionClick?: () => void
  danger?: boolean
  className?: string
  actionIcon?: ComponentType<SVGProps<SVGSVGElement>>
}
export const ConfigSection: FC<ConfigSectionProps> = ({
  titleToken,
  children,
  actionToken,
  actionMessage,
  actionIcon,
  actionHref,
  actionLoading,
  onActionClick,
  danger,
  className,
}) => {
  return (
    <section
      className={cn(
        "mb-4 border border-gray-200 rounded-md dark:border-gray-800",
        {
          "border-rose-600 dark:border-rose-800": danger,
        },
        className,
      )}
    >
      <div className="p-5 pt-6 flex flex-col">
        <Text as="h2" labelToken={titleToken} size="lg" className="mb-2 ml-1" semibold />
        <div className="ml-1">{children}</div>
      </div>
      <div
        className={cn(
          "px-5 py-3 flex items-center border-t rounded-b-md border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900",
          { "justify-between": isNotNil(actionMessage) },
          { "justify-end": isNil(actionMessage) },
        )}
      >
        {actionMessage && <Text as="p" labelToken={actionMessage} size="sm" />}
        <Button
          labelToken={actionToken}
          className="py-1 lg:text-sm outline-none"
          onClick={onActionClick}
          loading={actionLoading}
          href={actionHref}
          {...(danger && { variant: "danger" })}
          {...(actionIcon && {
            Icon: actionIcon,
            iconPlacement: "right",
            iconSize: "sm",
          })}
        />
      </div>
    </section>
  )
}
