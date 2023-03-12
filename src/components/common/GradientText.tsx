import { FC, useEffect, useRef } from "react"
import { useTranslation } from "next-i18next"
import { Text, TextProps } from "./Text"
import { splitAt } from "ramda"

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
  const text = t(labelToken)
  const [leftText, gradientText, rightText] = splitRange(text, charRange)
  console.log(leftText, "<>", gradientText, "<>", rightText)

  return (
    <Text {...props}>
      <>
        {leftText}
        <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-500 bg-clip-text text-transparent">{gradientText}</span>
        {rightText}
      </>
    </Text>
  )
}
