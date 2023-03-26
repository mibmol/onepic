import { Button, Select, SelectOption, Tag, Text } from "@/components/common"
import { PlanType } from "@/lib/data/entities"
import { cn } from "@/lib/utils"
import { getCreditPrice, getSubscriptionPrice } from "@/lib/utils"
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline"
import { FC, useState } from "react"

export const PricingSection = () => {
  return (
    <section id="pricing" className="w-full lg:max-w-7xl mx-auto mt-12 mb-32">
      <div className="text-center">
        <Text as="h2" labelToken="Choose your plan" size="4xl" bold />
      </div>
      <div className="mt-12 px-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <PricingBox
          titleToken="Free"
          descriptionItems={[
            { labelToken: "Unlimated background removal" },
            { labelToken: "15 credits for free" },
            { labelToken: "No credit card needed, just sign in" },
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
              <CheckIcon className="w-5 stroke-3 mr-2 stroke-purple-700 dark:stroke-purple-500" />
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

const CreditsSelector = () => {
  const [value, setValue] = useState("50")
  const params = new URLSearchParams({ plan: value, planType: PlanType.credits })
  return (
    <PricingBox
      titleToken="Credits"
      descriptionItems={[
        { labelToken: "Use all features with your credits" },
        { labelToken: "Credits never expires" },
      ]}
      price={getCreditPrice(value)}
      onChange={(e) => setValue(e.target.value)}
      link={`/payment/?${params.toString()}`}
      linkToken="Buy credits"
      options={[
        { value: "50", labelToken: "50 credits" },
        { value: "100", labelToken: "100 credits" },
        { value: "200", labelToken: "200 credits" },
        { value: "500", labelToken: "500 credits" },
        { value: "1000", labelToken: "1000 credits" },
      ]}
    />
  )
}

const SubscriptionSelector = () => {
  const [value, setValue] = useState("month")
  const params = new URLSearchParams({ plan: value, planType: PlanType.subscription })
  return (
    <PricingBox
      titleToken="Subscription"
      descriptionItems={[{ labelToken: "Unlimated usage for all features" }]}
      price={getSubscriptionPrice(value)}
      onChange={(e) => setValue(e.target.value)}
      link={`/payment/?${params.toString()}`}
      linkToken="Subscribe"
      options={[
        { value: "month", labelToken: "Monthly" },
        { value: "year", labelToken: "Yearly" },
      ]}
    />
  )
}
