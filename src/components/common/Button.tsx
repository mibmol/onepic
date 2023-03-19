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
type ButtonVariant = "primary" | "secondary" | "tertiary"

type ButtonProps<NativeProps> = PropsWithChildren & {
  labelToken?: string
  className?: string
  tokenArgs?: { [key: string]: any }
  href?: string
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
  iconPlacement?: "left" | "right"
  disabled?: boolean
  variant?: ButtonVariant
  download?: any
} & NativeProps

const getButtonColorClasses = cond<ButtonVariant[], string>([
  [
    equals<ButtonVariant>("primary"),
    always(
      `cursor-pointer bg-gray-900 text-white rounded-md border border-gray-900 
        dark:bg-white dark:text-gray-900
        hover:bg-white hover:text-gray-900
          dark:hover:bg-gray-900 dark:hover:text-white dark:hover:border-white
        active:bg-gray-200 
          dark:active:bg-gray-800 
        disabled:bg-gray-200 disabled:text-gray-900 disabled:cursor-not-allowed
          dark:disabled:bg-gray-900 dark:disabled:text-white dark:disabled:border-white
        focus:ring focus:ring-indigo-200 focus:ring-opacity-50 
          dark:focus:ring-indigo-600
      `,
    ),
  ],
  [
    equals<ButtonVariant>("secondary"),
    always(
      `cursor-pointer bg-white text-gray-600 rounded-md border border-gray-300 
        dark:bg-black dark:border-gray-600 dark:text-gray-300
        hover:text-gray-900 hover:border-gray-900
          dark:hover:text-white dark:hover:border-white
        active:bg-gray-200 
          dark:active:bg-gray-700
      `,
    ),
  ],
  [equals<ButtonVariant>("tertiary"), always("")],
])

export const Button: FC<ButtonProps<HTMLButtonProps | LinkProps>> = ({
  labelToken,
  tokenArgs,
  className,
  children,
  href,
  Icon,
  iconPlacement = "left",
  variant = "primary",
  download,
  ...props
}) => {
  const { t } = useTranslation()
  const iconPlacementRight = iconPlacement === "right"
  const classes = cn(
    "flex px-4 py-3 font-medium items-center",
    getButtonColorClasses(variant),
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
  variant = "primary",
  ...props
}) => {
  const { t } = useTranslation()
  const classes = cn(
    "flex px-4 py-3 font-medium",
    getButtonColorClasses(variant),
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
