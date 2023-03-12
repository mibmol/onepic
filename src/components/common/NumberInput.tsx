import { cn } from "@/lib/utils"
import { DetailedHTMLProps, FC, forwardRef, InputHTMLAttributes } from "react"

type NumberInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export const NumberInput: FC<NumberInputProps> = forwardRef(function NumberInput(
  { className, ...props }: NumberInputProps,
  ref,
) {
  return (
    <input
      type="number"
      className={cn(
        `
        w-full rounded-md border-gray-300 
            dark:bg-black dark:text-white dark:border-gray-700
         focus:ring focus:ring-indigo-200 focus:ring-opacity-50
            dark:focus:ring-indigo-300
        `,
        className,
      )}
      {...props}
      ref={ref}
    />
  )
})
