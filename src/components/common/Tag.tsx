import { FC } from "react"
import { useTranslation } from "next-i18next"
import { cn } from "@/lib/utils"

type TagProps = {
  labelToken: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export const Tag: FC<TagProps> = ({ labelToken, className }) => {
  const { t } = useTranslation()
  const classes = cn(
    `
    px-2 py-px rounded border border-gray-300 text-xs
        dark:border-gray-600 dark:text-gray-200
  `,
    className,
  )

  return <span className={classes}>{t(labelToken)}</span>
}
