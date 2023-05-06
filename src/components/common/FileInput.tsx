import { ComponentType, FC, SVGProps, useCallback, useRef } from "react"
import { Button } from "./Button"

type FileInputProps = {
  id: string
  name: string
  className?: string
  onFileChange?: (file?: File) => void
  labelToken: string
  accept?: string
  Icon?: ComponentType<SVGProps<SVGSVGElement>>
}

export const FileInput: FC<FileInputProps> = ({
  id,
  name,
  className,
  onFileChange,
  labelToken,
  accept,
  Icon,
}) => {
  const ref = useRef(null)

  const onChange = useCallback(
    ({ target }) => onFileChange?.(target?.files[0]),
    [onFileChange],
  )

  const onClick = useCallback(() => {
    ref.current?.click()
  }, [])

  return (
    <>
      <input {...{ ref, id, name, onChange, accept }} type="file" className="hidden" />
      <Button {...{ Icon, labelToken, onClick, className }} />
    </>
  )
}
