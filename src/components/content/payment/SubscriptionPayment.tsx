import { notification } from "@/lib/utils"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { getQueryParams } from "@/lib/utils/clientRouting"
import * as paymentClient from "@/lib/client/payment"
import { PlanType } from "@/lib/data/entities"
import { CreateSubscriptionHandler, OnApproveHandler } from "./utils"
import { PayPalButtonsLoader } from "./PayPalButtonsLoader"

export const SubscriptionPlanPayment = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const { plan } = router.query

  const createSubscription: CreateSubscriptionHandler = async () => {
    try {
      return await paymentClient.createSubscription({ plan })
    } catch (error) {
      notification.error(t("Couldn't initialize payment. Try refreshing the page"))
    }
  }

  const onApprove: OnApproveHandler = async ({ subscriptionID, ...rest }) => {
    try {
      await paymentClient.saveUserPlan({
        planType: PlanType.subscription,
        subscriptionId: subscriptionID,
        selectedPlan: plan,
      })
      notification.success(t("Subscribed successfully. You can start using all the features!"), {
        duration: 3000,
      })
      router.push(getQueryParams().get("callbackUrl") ?? "/")
    } catch (error) {
      console.error(error)
      notification.error(
        t("Couldn't process the subscription. Try again or use another method"),
        { duration: 3000 },
      )
    }
  }

  const onError = (error) => {
    console.error(error)
    notification.error(
      t("Couldn't process the subscription. Try again or use another method"),
      { duration: 3000 },
    )
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        intent: "subscription",
        vault: true,
      }}
    >
      <PayPalButtonsLoader
        {...{ createSubscription, onApprove, onError }}
        style={{
          layout: "horizontal",
          label: "subscribe",
          color: "blue",
          tagline: false,
        }}
        className="flex justify-center items-center md:mt-8"
      />
    </PayPalScriptProvider>
  )
}
