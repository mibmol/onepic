import { cn } from "@/lib/utils"
import { FC, PropsWithChildren } from "react"
import { useTranslation } from "react-i18next"

type TextProps = PropsWithChildren & {
  labelToken?: string
  className?: string
  tokenArgs?: { [key: string]: any }
}
export const Text: FC<TextProps> = ({ labelToken, tokenArgs, className, children }) => {
  const { t } = useTranslation()
  return <p className={cn("", className)}>{children ?? t(labelToken, tokenArgs)}</p>
}
