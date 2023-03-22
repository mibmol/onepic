import { Button, Select, SelectOption, Tag, Text } from "@/components/common"
import { cn } from "@/lib/utils"
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline"
import { always, cond, equals } from "ramda"
import { FC, useState } from "react"

export const PricingSection = () => {
  return (
    <section id="pricing" className="w-full lg:max-w-7xl mx-auto mt-12 mb-32">
      <div className="text-center">
        <Text as="h2" labelToken="Choose your plan" size="4xl" bold />
      </div>
      <div className="mt-12 grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <PricingBox
          titleToken="Free"
          descriptionItems={[
            { labelToken: "Unlimated background removal" },
            { labelToken: "10 credits per week for free" },
          ]}
          price={{ value: 0 }}
          link="/auth/signin"
          linkToken="Get started"
        />
        <CreditsSelector />
        <SubscriptionSelector />
      </div>
    </section>
  )
}

type PricingBoxProps = {
  titleToken: string
  descriptionItems: { labelToken: string }[]
  price: { value: number; messageToken?: string }
  onChange?: (e) => void
  options?: SelectOption[]
  link: string
  linkToken: string
}

const PricingBox: FC<PricingBoxProps> = ({
  titleToken,
  descriptionItems = [],
  price,
  onChange,
  options,
  link,
  linkToken,
}) => {
  return (
    <div
      className={`
       p-px bg-gray-200 rounded-lg
          dark:bg-gray-800
        hover:bg-gradient-to-r duration-200 from-purple-500 via-cyan-400 to-indigo-500
      `}
    >
      <div
        className={`
          p-8 h-112 bg-white flex flex-col justify-between rounded-lg
          dark:bg-black
        `}
      >
        <Text labelToken={titleToken} size="xl" className="text-left" semibold />
        {onChange && (
          <Select {...{ onChange, options }} defaultValue={options[0].value} />
        )}
        <div className="flex items-center">
          <div className="text-left text-5xl">
            <span className="text-gray-500 dark:text-gray-400">$</span>
            <span className="dark:text-white">{price.value}</span>
          </div>
          <div className="ml-4">
            {price.messageToken && <Tag labelToken={price.messageToken} />}
          </div>
        </div>
        <ul className="mb-6">
          {descriptionItems.map(({ labelToken }, index) => (
            <li
              key={labelToken}
              className={cn("flex", { "mb-3": index !== descriptionItems.length - 1 })}
            >
              <CheckIcon className="w-5 stroke-3 mr-2 stroke-purple-700" />
              <Text {...{ labelToken }} medium gray />
            </li>
          ))}
        </ul>
        <Button
          labelToken={linkToken}
          Icon={ArrowRightIcon}
          href={link}
          iconPlacement="right"
          className="justify-between"
        />
      </div>
    </div>
  )
}

const getCreditPrice = cond([
  [equals("50-credits"), always({ value: 3 })],
  [equals("100-credits"), always({ value: 5.5 })],
  [equals("200-credits"), always({ value: 10 })],
  [equals("300-credits"), always({ value: 14 })],
])

const CreditsSelector = () => {
  const [value, setValue] = useState("50-credits")
  return (
    <PricingBox
      titleToken="Credits"
      descriptionItems={[{ labelToken: "Use all features with your credits" }]}
      price={getCreditPrice(value)}
      onChange={(e) => setValue(e.target.value)}
      link="/auth/signin"
      linkToken="Buy credits"
      options={[
        { value: "50-credits", labelToken: "50 credits" },
        { value: "100-credits", labelToken: "100 credits" },
        { value: "200-credits", labelToken: "200 credits" },
        { value: "300-credits", labelToken: "300 credits" },
      ]}
    />
  )
}

const getSubscriptionPrice = cond([
  [equals("month"), always({ value: 7 })],
  [equals("year"), always({ value: 74, messageToken: "save 12%" })],
])

const SubscriptionSelector = () => {
  const [value, setValue] = useState("month")
  return (
    <PricingBox
      titleToken="Subscription"
      descriptionItems={[{ labelToken: "Unlimated usage for all features" }]}
      price={getSubscriptionPrice(value)}
      onChange={(e) => setValue(e.target.value)}
      link="/auth/signin"
      linkToken="Subscribe"
      options={[
        { value: "month", labelToken: "Monthly" },
        { value: "year", labelToken: "Yearly" },
      ]}
    />
  )
}
