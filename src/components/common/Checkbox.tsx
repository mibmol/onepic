import { cn } from "@/lib/utils"
import { DetailedHTMLProps, FC, forwardRef, InputHTMLAttributes } from "react"

type CheckboxProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export const Checkbox: FC<CheckboxProps> = forwardRef(function Checkbox(
  { className, ...props }: CheckboxProps,
  ref,
) {
  const classes = cn(`  
    rounded border-gray-300 text-indigo-600 shadow-sm 
        dark:border-gray-700
    focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50    
    `,
    className,
  )
  return <input ref={ref} type="checkbox" className={classes} {...props} />
})
