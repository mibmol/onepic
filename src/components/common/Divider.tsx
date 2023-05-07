import { cn } from "@/lib/utils"
import { FC } from "react"

type DividerProps = {
  className?: string
}

export const Divider: FC<DividerProps> = ({ className }) => {
  return <div className={cn("w-full h-px bg-gray-200 dark:bg-gray-800", className)} />
}
