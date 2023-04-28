import { FC } from "react"
import { SvgIconProps } from "./types"

export const Spinner: FC<
  SvgIconProps & {
    circleStroke?: string
    semiCircleStroke?: string
    circleClassName?: string
    semiCircleClassName?: string
  }
> = ({
  className,
  circleStroke = "#eeeeee44",
  circleClassName,
  semiCircleStroke = "#eeeeee",
  semiCircleClassName,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      display="block"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
      {...{ className }}
    >
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke={circleStroke}
        className={circleClassName}
        strokeWidth="6"
      ></circle>
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke={semiCircleStroke}
        className={semiCircleClassName}
        strokeLinecap="round"
        strokeWidth="6"
      >
        <animateTransform
          attributeName="transform"
          dur="2.2s"
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          type="rotate"
          values="0 50 50;180 50 50;720 50 50"
        ></animateTransform>
        <animate
          attributeName="stroke-dasharray"
          dur="1s"
          keyTimes="0;0.5;1"
          repeatCount="indefinite"
          values="18.84955592153876 169.64600329384882;94.2477796076938 94.24777960769377;18.84955592153876 169.64600329384882"
        ></animate>
      </circle>
    </svg>
  )
}
