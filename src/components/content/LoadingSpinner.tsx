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
    <div className={cn("", className)}>
      <Spinner className="animate-spin text-white stroke-1 " />
      <span className="ml-2 font-bold text-lg text-white z-10">{t(labelToken)}</span>
    </div>
  )
}
