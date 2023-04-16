import { cn } from "@/lib/utils"
import { DetailedHTMLProps, FC, forwardRef, InputHTMLAttributes } from "react"

type TextInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

export const TextInput: FC<TextInputProps> = forwardRef(function NumberInput(
  { className, ...props }: TextInputProps,
  ref,
) {
  return (
    <input
      type="text"
      className={cn(
        `
        w-full rounded-md border-gray-300 
            dark:bg-black dark:text-white dark:border-gray-700
         focus:ring focus:ring-purple-200 focus:ring-opacity-50
            dark:focus:ring-purple-300
        `,
        className,
      )}
      {...props}
      ref={ref}
    />
  )
})
