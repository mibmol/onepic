import { cn } from "@/lib/utils"
import { RadioGroup } from "@headlessui/react"
import { FC, ReactNode } from "react"
import { useTranslation } from "react-i18next"

type IntegerRadioGroupProps = {
  label?: ReactNode
  options: { value: any; labelToken: string }[]
  onChange: (value: any) => void
  defaultValue?: any
}

export const IntegerRadioGroup: FC<IntegerRadioGroupProps> = ({
  label,
  options = [],
  onChange,
  defaultValue,
}) => {
  const { t } = useTranslation()
  return (
    <div>
      <RadioGroup
        {...{ onChange, defaultValue }}
        className="max-w-max flex rounded-full bg-gray-100 cursor-pointer dark:bg-gray-800"
      >
        <RadioGroup.Label hidden>{label}</RadioGroup.Label>
        {options.map(({ labelToken, value }) => (
          <RadioGroup.Option
            key={labelToken}
            value={value}
            className={({ checked }) =>
              cn(
                "px-6 py-2 rounded-full font-medium",
                checked ? "bg-purple-600 text-white" : "text-gray-700 dark:text-gray-300",
              )
            }
          >
            {t(labelToken)}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  )
}
