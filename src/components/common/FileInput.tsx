import { FC, ReactElement, useCallback, useRef, useState } from "react"
import { useTranslation } from "next-i18next"
import { cn } from "@/lib/utils/clsx"

type FileInputProps = {
  id: string
  name: string
  className?: string
  onFileChange?: (file?: File) => void
  labelToken: string
  accept?: string
  icon?: ReactElement
}

export const FileInput: FC<FileInputProps> = ({
  id,
  name,
  className,
  onFileChange,
  labelToken,
  accept,
  icon,
}) => {
  const ref = useRef(null)
  const { t } = useTranslation()

  const onChange = useCallback(
    ({ target }) => onFileChange?.(target?.files[0]),
    [onFileChange],
  )

  const onClick = useCallback(() => {
    ref.current?.click()
  }, [])

  return (
    <div>
      <input {...{ ref, id, name, onChange, accept }} type="file" className="hidden" />
      <button {...{ onClick }} className={cn("rounded-md duration-200", className)}>
        {icon}
        <span>{t(labelToken)}</span>
      </button>
    </div>
  )
}
