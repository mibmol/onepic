import { useThemeMode } from "@/lib/hooks"
import { ThemeMode } from "@/lib/state/themeSlice"
import { FC } from "react"
import { SvgIconProps } from "./types"

type DashSquareProps = { over?: boolean } & SvgIconProps

const getStrokeColor = (mode: ThemeMode, over: boolean): string => {
  if (mode === "dark") {
    return over ? "stroke-gray-100" : "stroke-gray-400"
  }
  return over ? "stroke-gray-800" : "stroke-gray-500"
}

export const DashSquare: FC<DashSquareProps> = ({
  width = 420,
  height = 264,
  strokeWidth = 5,
  strokeDasharray = 15,
  className,
  over,
}) => {
  const mode = useThemeMode()
  const strokeClass = getStrokeColor(mode, over)
  return (
    <svg
      {...{ width, height, className }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 264"
    >
      <g {...{ strokeWidth, strokeDasharray }} fill="none" className={strokeClass}>
        <rect width="420" height="264" stroke="none" rx="20"></rect>
        <rect width="415" height="259" x="2.5" y="2.5" rx="17.5"></rect>
      </g>
    </svg>
  )
}
