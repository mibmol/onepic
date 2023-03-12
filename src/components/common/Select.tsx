import { DetailedHTMLProps, FC, forwardRef, SelectHTMLAttributes } from "react"
import { useTranslation } from "next-i18next"
import { cn } from "@/lib/utils"

type SelectOption = {
  labelToken: string
  value: number | string
}
type SelectProps = {
  options: SelectOption[]
} & DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>

export const Select: FC<SelectProps> = forwardRef(function Select(
  { options, className, ...props }: SelectProps,
  ref,
) {
  const { t } = useTranslation()
  const classes = cn(
    `
    w-full rounded-md border-gray-300 
        dark:bg-black dark:text-white dark:border-gray-700
    focus:ring focus:ring-indigo-200 focus:ring-opacity-50
        dark:focus:ring-indigo-300
    `,
    className,
  )
  return (
    <select className={classes} {...props} ref={ref}>
      {options.map(({ value, labelToken }) => (
        <option key={labelToken + value} {...{ value }}>
          {t(labelToken)}
        </option>
      ))}
    </select>
  )
})
