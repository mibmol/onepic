import { Spinner } from "@/components/common/icons"
import { cn } from "@/lib/utils/clsx"
import { FC } from "react"
import { useTranslation } from "next-i18next"

type LoadingSpinnerProps = {
  labelToken: string
  className?: string
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ labelToken, className }) => {
  const { t } = useTranslation()
  return (
    <div className={cn("w-48 h-14 relative flex items-center justify-center", className)}>
      <div className="absolute w-full h-full bg-slate-900 opacity-70 rounded-md" />
      <Spinner className="animate-spin text-white h-7 w-6 z-10" />
      <span className="ml-2 font-medium text-white z-10">{t(labelToken)}</span>
    </div>
  )
}
