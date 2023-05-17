import { Button, Select, SelectOption, Tag, Text } from "@/components/common"
import { PlanType } from "@/lib/data/entities"
import { useAfterRenderState } from "@/lib/hooks/useAfterRenderState"
import {
  cn,
  creditsOptions,
  getCreditPrice,
  getQueryParamsWith,
  getSubscriptionPrice,
  subscriptionOptions,
} from "@/lib/utils"
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline"
import { FC, useState } from "react"

export const PricingSection = () => {
  return (
    <section id="pricing" className="w-full lg:max-w-7xl mx-auto mt-12 mb-32">
      <div className="text-center">
        <Text
          as="h2"
          labelToken="Choose your plan"
          className="text-2xl md:text-4xl"
          bold
        />
      </div>
      <div className="mt-12 px-4 md:px-8 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
  subtitleToken?: string
  descriptionItems: { labelToken: string }[]
  price: { value: number; messageToken?: string }
  onChange?: (e) => void
  options?: SelectOption[]
  link: string
  linkToken: string
  defaultValue?: SelectOption
  alwaysShowBorder?: boolean
}

const PricingBox: FC<PricingBoxProps> = ({
  titleToken,
  subtitleToken,
  descriptionItems = [],
  price,
  onChange,
  options,
  link,
  linkToken,
  defaultValue,
  alwaysShowBorder = false,
}) => {
  return (
    <div
      className={cn(
        `
       p-px bg-gray-200 rounded-lg
          dark:bg-gray-800
         duration-200 from-purple-500 via-cyan-400 to-indigo-500
      `,
        alwaysShowBorder ? "bg-gradient-to-r" : "hover:bg-gradient-to-r",
      )}
    >
      <div
        className={`
          p-8 h-112 bg-white flex flex-col justify-between rounded-lg
          dark:bg-black
        `}
      >
        <div>
          <Text labelToken={titleToken} size="xl" className="text-left" semibold />
          {subtitleToken && (
            <Text
              labelToken={subtitleToken}
              className="text-left block mt-1"
              medium
              gray
            />
          )}
        </div>
        {onChange && (
          <Select
            {...{ onChange, options }}
            defaultValue={defaultValue?.value ?? options[0].value}
          />
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
  const [value, setValue] = useState("100")
  const params = useAfterRenderState(
    getQueryParamsWith({ plan: value, planType: PlanType.credits }),
    [value],
  )
  return (
    <PricingBox
      titleToken="Credits"
      subtitleToken="One-Time Payment"
      descriptionItems={[
        { labelToken: "Use all features with your credits" },
        { labelToken: "Credits never expires" },
      ]}
      price={getCreditPrice(value)}
      onChange={(e) => setValue(e.target.value)}
      {...(params && { link: `/payment/?${params.toString()}` })}
      linkToken="Buy credits"
      options={creditsOptions}
      defaultValue={creditsOptions[1]}
      alwaysShowBorder
    />
  )
}

const SubscriptionSelector = () => {
  const [value, setValue] = useState("100")
  const params = useAfterRenderState(
    getQueryParamsWith({ plan: value, planType: PlanType.subscription }),
    [value],
  )
  return (
    <PricingBox
      titleToken="Monthly Subscription"
      descriptionItems={[
        { labelToken: "Unused credits rolls over" },
        { labelToken: "Cancel any time" },
      ]}
      price={getSubscriptionPrice(value)}
      linkToken="Subscribe"
      options={subscriptionOptions}
      onChange={(e) => setValue(e.target.value)}
      {...(params && { link: `/payment/?${params.toString()}` })}
    />
  )
}
