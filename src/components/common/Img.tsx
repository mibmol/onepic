import { randomInt } from "@/lib/utils/number"
import { compose, toString } from "ramda"
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
  successLoad?: () => void
} & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const getUrlWithRandParam = compose(
  toString,
  (url: URL) => {
    url.searchParams.set("imgRand", randomInt().toString())
    return url
  },
  (url: string) => new URL(url),
)

export const Img: FC<ImgProps> = ({
  fallbackSrc,
  maxRetries,
  onEndRetries,
  successLoad,
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
      } else {
        setTimeout(() => {
          currentTarget.src = getUrlWithRandParam(imgProps.src)
          maxRetryRef.current--
        }, 400)
      }
    },
    [fallbackSrc, imgProps.src, onEndRetries],
  )

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img onError={handleError} {...imgProps} onLoad={successLoad} />
}
