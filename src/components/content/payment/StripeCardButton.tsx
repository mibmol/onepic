import { ApplePayIcon, GooglePayIcon } from "@/components/common/icons"
import { PlanType } from "@/lib/data/entities"
import { getCreditStripeLink } from "@/lib/utils"
import { CreditCardIcon } from "@heroicons/react/24/outline"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { FC } from "react"

type StripeCardButtonProps = {
  plan: string
  planType: string
}

function createPaymentLink(plan: string, planType: string, session: Session) {
  if (!session) {
    return ""
  }
  let url: URL
  switch (planType) {
    case PlanType.credits:
      url = new URL(getCreditStripeLink(plan))
      break
  }
  url.searchParams.set("client_reference_id", [session.user.id, plan, planType].join("_"))
  url.searchParams.set("prefilled_email", session.user.email)
  return url?.toString()
}

export const StripeCardButton: FC<StripeCardButtonProps> = ({ plan, planType }) => {
  const { t } = useTranslation()
  const { data: session } = useSession()

  const link = createPaymentLink(plan, planType, session)

  return (
    <Link
      href={link}
      target="_self"
      className={`
        mx-auto w-104 md:w-128 py-2 mt-4 md:py-3.5 md:mt-6 flex justify-center items-center font-medium rounded-md text-gray-800 border border-gray-300 
        dark:text-white dark:border-gray-700
        hover:bg-gray-200 dark:hover:bg-gray-900
      `}
    >
      <div className="flex items-center">
        <CreditCardIcon className="w-6 mr-2" />
        <span className="">{t("Credit or Debit Card")}</span>
      </div>
      <span className="mx-2">/</span>
      <GooglePayIcon className="w-12 mt-0.5" />
      <span className="mx-2">/</span>
      <ApplePayIcon className="h-6 mb-px" />
    </Link>
  )
}
