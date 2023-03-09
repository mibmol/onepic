import { cn } from "@/lib/utils"
import { assoc } from "ramda"
import { createElement, FC, PropsWithChildren } from "react"
import { useTranslation } from "next-i18next"

type TextSize = "xm" | "sm" | "md" | "lg" | "xl" | "4xl"

// using this intead of `keyof JSX.IntrinsicElements` due to type inference performance
type TextTags = "span" | "p" | "h1" | "h2" | "h3" | "label" | "div"

type TextCustomProps<TTag extends TextTags> = {
  as?: TTag
  labelToken?: string
  className?: string
  tokenArgs?: { [key: string]: any }
  medium?: boolean
  semibold?: boolean
  bold?: boolean
  italic?: boolean
  size?: TextSize
  gray?: boolean
} & JSX.IntrinsicElements[TTag]

type TextProps = PropsWithChildren & TextCustomProps<TextTags>

const getTextSizeClass = (size: TextSize) => {
  switch (size) {
    case "xm":
      return "text-xs"
    case "sm":
      return "text-base"
    case "md":
      return "text-md"
    case "lg":
      return "text-lg"
    case "xl":
      return "text-xl"
    case "4xl":
      return "text-4xl"
    default:
      return "text-base"
  }
}

export const Text: FC<TextProps> = ({
  as,
  labelToken,
  tokenArgs,
  className,
  children,
  medium,
  semibold,
  bold,
  italic,
  size = "md",
  gray,
  ...props
}) => {
  const { t } = useTranslation()
  const classes = cn(
    "text-gray-800 dark:text-gray-200",
    {
      italic,
      "font-medium": medium,
      "font-semibold": semibold,
      "font-bold": bold,
      "text-gray-600 dark:text-gray-400": gray,
    },
    getTextSizeClass(size),
    className,
  )

  return createElement(
    as ?? "span",
    assoc("className", classes, props),
    children ?? t(labelToken, tokenArgs ?? {}),
  )
}
