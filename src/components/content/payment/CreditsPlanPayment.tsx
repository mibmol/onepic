import { notification } from "@/lib/utils"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { getQueryParams } from "@/lib/utils/clientRouting"
import * as paymentClient from "@/lib/client/payment"
import { PlanType } from "@/lib/data/entities"
import { CreateOrderHandler, OnApproveHandler } from "./utils"
import { PayPalButtonsLoader } from "./PayPalButtonsLoader"
import { StripeCardButton } from "./StripeCardButton"

export const CreditsPlanPayment = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const { plan, planType } = router.query

  const createOrder: CreateOrderHandler = async () => {
    try {
      return await paymentClient.createCreditOrder({ plan, planType })
    } catch (error) {
      notification.error(t("Couldn't initialize payment. Try refreshing the page"))
    }
  }

  const onApprove: OnApproveHandler = async (data) => {
    try {
      const { id: orderId } = await paymentClient.captureCreditOrder(data)
      await paymentClient.saveUserPlan({
        orderId,
        planType: PlanType.credits,
        selectedPlan: plan,
      })
      notification.success(t("Plan saved. You can start using your credits now!"), {
        duration: 3000,
      })
      router.push(getQueryParams().get("callbackUrl") ?? "/")
    } catch (error) {
      console.error(error)
      notification.error(
        t("Couldn't process the payment. Try again or use another method"),
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
    <div>
      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          "disable-funding": "card",
        }}
      >
        <PayPalButtonsLoader
          {...{ createOrder, onApprove, onError }}
          style={{ layout: "vertical", label: "pay", color: "blue", tagline: false }}
          className="mx-auto w-96 md:w-128"
        />
      </PayPalScriptProvider>
      <StripeCardButton plan={plan as string} planType={PlanType.credits} />
    </div>
  )
}
