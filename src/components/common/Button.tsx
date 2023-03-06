import {
  ButtonHTMLAttributes,
  ComponentType,
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  PropsWithChildren,
  SVGProps,
} from "react"
import { useTranslation } from "next-i18next"
import { cn } from "@/lib/utils"
import Link, { LinkProps } from "next/link"
import { always, cond, equals } from "ramda"

type HTMLButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
type ButtonType = "primary" | "secondary" | "tertiary"

type ButtonProps<NativeProps> = PropsWithChildren & {
  labelToken?: string
  className?: string
  tokenArgs?: { [key: string]: any }
  href?: string
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
  iconPlacement?: "left" | "right"
  disabled?: boolean
  buttonType?: ButtonType
} & NativeProps

const getButtonColorClasses = cond<ButtonType[], string>([
  [
    equals<ButtonType>("primary"),
    always(
      `cursor-pointer bg-gray-900 text-white rounded-md border border-gray-900 
        dark:bg-white dark:text-gray-900
        hover:bg-white hover:text-gray-900
          dark:hover:bg-gray-900 dark:hover:text-white dark:hover:border-white
        active:bg-gray-200 
          dark:active:bg-gray-800
        disabled:bg-gray-200 disabled:text-gray-900 disabled:cursor-not-allowed
          dark:disabled:bg-gray-900 dark:disabled:text-white dark:disabled:border-white
          `,
    ),
  ],
  [equals<ButtonType>("secondary"), always("")],
  [equals<ButtonType>("tertiary"), always("")],
])

export const Button: FC<ButtonProps<HTMLButtonProps | LinkProps>> = ({
  labelToken,
  tokenArgs,
  className,
  children,
  href,
  Icon,
  iconPlacement = "left",
  buttonType = "primary",
  ...props
}) => {
  const { t } = useTranslation()
  const iconPlacementRight = iconPlacement === "right"
  const classes = cn(
    "flex px-4 py-3 font-medium",
    getButtonColorClasses(buttonType),
    { "flex-row-reverse": iconPlacement === "right" },
    className,
  )

  const content = (
    <>
      {Icon && (
        <Icon className={cn("stroke-2 w-5 h-5", iconPlacementRight ? "ml-2" : "mr-2")} />
      )}
      <span>{children ?? t(labelToken, tokenArgs)}</span>
    </>
  )

  if (href) {
    return (
      <Link {...{ href }} {...(props as LinkProps)} className={classes}>
        {content}
      </Link>
    )
  }
  return (
    <button {...(props as HTMLButtonProps)} className={classes}>
      {content}
    </button>
  )
}

type InputSubmitProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>
export const SubmitButton: FC<ButtonProps<InputSubmitProps>> = ({
  labelToken,
  tokenArgs,
  className,
  buttonType = "primary",
  ...props
}) => {
  const { t } = useTranslation()
  const classes = cn(
    "flex px-4 py-3 font-medium",
    getButtonColorClasses(buttonType),
    className,
  )
  return (
    <input
      type="submit"
      className={classes}
      value={t(labelToken, tokenArgs)}
      {...props}
    />
  )
}
