import { ApplePayIcon, GooglePayIcon, Spinner } from "@/components/common/icons"
import { createStripeSessionUrl as _createStripeSessionUrl } from "@/lib/client/payment"
import { cn } from "@/lib/utils"
import { CreditCardIcon } from "@heroicons/react/24/outline"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { FC } from "react"
import useSWR from "swr"

type StripeCardButtonProps = {
  plan: string
  planType: string
}

function getStripeSessionSWRKey({ plan, planType }) {
  return ["stripeSession", plan, planType].join("_")
}

function createStripeSessionUrl(swrKey: string) {
  const [_, plan, planType] = swrKey.split("_")
  return _createStripeSessionUrl({ plan, planType })
}

export const StripeCardButton: FC<StripeCardButtonProps> = ({ plan, planType }) => {
  const { t } = useTranslation()
  const { data } = useSWR(
    getStripeSessionSWRKey({ plan, planType }),
    createStripeSessionUrl,
  )

  return (
    <Link
      href={data?.sessionUrl ?? "/"}
      target="_self"
      className={cn(
        `
        mx-auto w-full md:w-128 mt-4 md:mt-6 
        flex justify-center items-center font-medium rounded-md text-gray-800 border border-gray-300 
        dark:text-white dark:border-gray-700
        hover:bg-gray-200 dark:hover:bg-gray-900
      `,
        { "py-2 md:py-3.5": data, "py-1 md:py-2.5": !data },
      )}
    >
      {data ? (
        <>
          <div className="flex items-center">
            <CreditCardIcon className="w-6 mr-2" />
            <span>{t("Credit or Debit")}</span>
          </div>
          <span className="mx-2">/</span>
          <GooglePayIcon className="w-12 mt-0.5" />
          <span className="mx-2">/</span>
          <span>{t("& other methods")}</span>
        </>
      ) : (
        <Spinner
          className="animate-spin stroke-1 w-10 mx-auto"
          circleStroke="#33333366"
          semiCircleStroke="#333333"
        />
      )}
    </Link>
  )
}
