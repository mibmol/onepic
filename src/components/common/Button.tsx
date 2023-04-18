import {
  ButtonHTMLAttributes,
  ComponentType,
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  PropsWithChildren,
  SVGProps,
  useMemo,
} from "react"
import { useTranslation } from "next-i18next"
import { cn, removeSimilarTWClasses } from "@/lib/utils"
import Link, { LinkProps } from "next/link"
import { always, cond, equals } from "ramda"
import { Spinner } from "./icons"
import { LoadingDots } from "./LoadingDots"

type HTMLButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger"

type ButtonProps<NativeProps> = PropsWithChildren & {
  labelToken?: string
  className?: string
  tokenArgs?: { [key: string]: any }
  href?: string
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
  iconPlacement?: "left" | "right"
  iconSize?: "sm" | "md"
  disabled?: boolean
  variant?: ButtonVariant
  download?: any
  loading?: boolean
} & NativeProps

const getButtonColorClasses = cond<ButtonVariant[], string>([
  [
    equals<ButtonVariant>("primary"),
    always(
      `bg-gray-900 text-white border border-gray-900 
        dark:bg-white dark:text-gray-900
        hover:bg-white hover:text-gray-900
          dark:hover:bg-gray-900 dark:hover:text-white dark:hover:border-white
        active:bg-gray-200 
          dark:active:bg-gray-800 
        disabled:bg-gray-200 disabled:text-gray-900 disabled:cursor-not-allowed
          dark:disabled:bg-gray-900 dark:disabled:text-white dark:disabled:border-white
        focus:ring focus:ring-purple-200 focus:ring-opacity-50 
          dark:focus:ring-purple-600
      `,
    ),
  ],
  [
    equals<ButtonVariant>("secondary"),
    always(
      `bg-white text-gray-600 border border-gray-300 
        dark:bg-black dark:border-gray-600 dark:text-gray-300
        hover:text-gray-900 hover:border-gray-900
          dark:hover:text-white dark:hover:border-white
        active:bg-gray-200 
          dark:active:bg-gray-700
      `,
    ),
  ],
  [
    equals<ButtonVariant>("tertiary"),
    always(`
    text-purple-700 dark:text-purple-300 px-3 py-1
      hover:bg-gray-100  dark:hover:bg-gray-800
  `),
  ],
  [
    equals<ButtonVariant>("danger"),
    always(
      `bg-rose-600 text-white border border-rose-700 
        hover:bg-white/25 hover:text-pink-700
          dark:hover:bg-gray-900/25 dark:hover:text-rose-600
        active:bg-rose-50 
        disabled:bg-gray-200 disabled:text-gray-900 disabled:cursor-not-allowed
          dark:disabled:bg-gray-900 dark:disabled:text-white dark:disabled:border-white
        
  `,
    ),
  ],
])

export const getButtonStyles = (variant: ButtonVariant, className?: string) =>
  removeSimilarTWClasses(
    cn(
      "relative group cursor-pointer rounded-md flex px-4 py-3 font-medium items-center",
      getButtonColorClasses(variant),
      className,
    ),
  )

export const Button: FC<ButtonProps<HTMLButtonProps | LinkProps>> = ({
  labelToken,
  tokenArgs,
  className,
  children,
  href,
  Icon,
  iconPlacement = "left",
  iconSize = "md",
  variant = "primary",
  download,
  loading,
  ...props
}) => {
  const { t } = useTranslation()
  const iconPlacementRight = iconPlacement === "right"
  const classes = useMemo(
    () =>
      removeSimilarTWClasses(
        cn(
          "relative group cursor-pointer rounded-md flex px-4 py-3 font-medium items-center",
          getButtonColorClasses(variant),
          { "flex-row-reverse": iconPlacement === "right" },
          className,
        ),
      ),
    [className, variant, iconPlacement],
  )

  const content = (
    <>
      {Icon && (
        <Icon
          className={cn(
            "stroke-2 w-5 h-5",
            {
              "w-5 h-5": iconSize === "md",
              "w-4 h-4": iconSize === "sm",
              invisible: loading,
            },
            iconPlacementRight ? "ml-2" : "mr-2",
          )}
        />
      )}
      <span className={cn({ invisible: loading })}>
        {children ?? t(labelToken, tokenArgs)}
      </span>
      {loading && variant !== "tertiary" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingDots size="sm" />
        </div>
      )}
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
  loading,
  ...props
}) => {
  const { t } = useTranslation()
  const classes = useMemo(() => getButtonStyles(variant, className), [variant, className])
  return (
    <input
      type="submit"
      className={classes}
      disabled={loading}
      value={t(labelToken, tokenArgs)}
      {...props}
    />
  )
}
