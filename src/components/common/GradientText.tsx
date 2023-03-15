import { FC } from "react"
import { useTranslation } from "next-i18next"
import { Text, TextProps } from "./Text"

type GradientTextProps = {
  charRange: [number, number?]
} & TextProps

const splitRange = (text: string, range: [number, number?]) => {
  return [
    text.slice(0, range[0]),
    text.slice(range[0], range[1] ?? text.length),
    range[1] ? text.slice(range[1]) : "",
  ]
}

export const GradientText: FC<GradientTextProps> = ({
  labelToken,
  charRange,
  ...props
}) => {
  const { t } = useTranslation()
  const [leftText, gradientText, rightText] = splitRange(t(labelToken), charRange)

  return (
    <Text {...props}>
      <>
        {leftText}
        <span
          className={`
            bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-indigo-600 
            dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400
          `}
        >
          {gradientText}
        </span>
        {rightText}
      </>
    </Text>
  )
}
