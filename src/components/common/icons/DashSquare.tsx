import { FC } from "react"
import { SvgIconProps } from "./types"


export const DashSquare: FC<SvgIconProps> = ({
  width = 420,
  height = 264,
  strokeWidth = 5,
  stroke = "#b6b6b6",
  strokeDasharray = 15,
  className,
}) => {
  return (
    <svg
      {...{ width, height, className }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 264"
    >
      <g {...{ strokeWidth, stroke, strokeDasharray }} fill="none">
        <rect width="420" height="264" stroke="none" rx="20"></rect>
        <rect width="415" height="259" x="2.5" y="2.5" rx="17.5"></rect>
      </g>
    </svg>
  )
}
