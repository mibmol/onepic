import { Spinner } from "@/components/common/icons"
import { cn } from "@/lib/utils/clsx"
import { FC } from "react"
import { useTranslation } from "next-i18next"

type LoadingSpinnerProps = {
  labelToken: string
  className?: string
  spinnerClassName?: string
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  labelToken,
  className,
  spinnerClassName,
}) => {
  const { t } = useTranslation()
  return (
    <div {...{ className }}>
      <Spinner
        className={cn("mx-auto animate-spin text-white stroke-1", spinnerClassName)}
      />
      <span className="ml-2 font-bold text-lg text-white z-10">{t(labelToken)}</span>
    </div>
  )
}
