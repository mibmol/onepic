import { randomInt } from "@/lib/utils/number"
import {
  DetailedHTMLProps,
  FC,
  ImgHTMLAttributes,
  SyntheticEvent,
  useCallback,
  useRef,
} from "react"

type ImgProps = {
  fallbackSrc?: string
  maxRetries?: number
  onEndRetries?: () => void
} & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

export const Img: FC<ImgProps> = ({
  fallbackSrc,
  maxRetries,
  onEndRetries,
  ...imgProps
}) => {
  const maxRetryRef = useRef(maxRetries ?? 1)

  const handleError = useCallback(
    ({ currentTarget }: SyntheticEvent<HTMLImageElement>) => {
      if (maxRetryRef.current <= 0) {
        if (fallbackSrc) {
          currentTarget.src = fallbackSrc
        } else {
          onEndRetries?.()
        }
        return
      } else if (maxRetryRef.current > 0) {
        setTimeout(() => {
          const url = new URL(imgProps.src)
          url.searchParams.set("imgRand", randomInt().toString())
          currentTarget.src = url.toString()
        }, 200)
        maxRetryRef.current--
      } else if (fallbackSrc) {
      }
    },
    [fallbackSrc, imgProps.src, onEndRetries],
  )

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img onError={handleError} {...imgProps} />
}
