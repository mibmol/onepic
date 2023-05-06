import { Header } from "@/components/layout"
import { Footer } from "@/components/layout/Footer"
import { SharedHead } from "@/components/layout/header/headUtils"
import { getCreditPrice, getSubscriptionPrice, isClient, notification } from "@/lib/utils"
import { GetStaticProps, NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { Text } from "@/components/common"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js"
import { getQueryParams, redirectToLogin } from "@/lib/utils/clientRouting"
import { Spinner } from "@/components/common/icons"
import * as paymentClient from "@/lib/client/payment"
import { PlanType } from "@/lib/data/entities"

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeProps = await serverSideTranslations(locale, ["common"])

  return {
    props: { ...localeProps },
  }
}
type CreateOrderHandler = PayPalButtonsComponentProps["createOrder"]
type OnApproveHandler = PayPalButtonsComponentProps["onApprove"]
type CreateSubscriptionHandler = PayPalButtonsComponentProps["createSubscription"]

const CreditCheckoutPage: NextPage = () => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const router = useRouter()
  const { plan, planType } = router.query

  useEffect(() => {
    if (!session && isClient()) {
      redirectToLogin()
    } else if (!plan || !planType) {
      router.back()
    }
  }, [session, router, router.query, plan, planType])

  return (
    <>
      <SharedHead />
      <Header />
      <main>
        <div className="mt-32 mb-10 flex flex-col items-center">
          <Text
            labelToken="Choose a payment method"
            size="2xl"
            className="mb-4"
            semibold
          />
          {planType === PlanType.credits && (
            <Text
              labelToken="Buying {{totalCredits}} credits. Total: ${{price}}"
              tokenArgs={{
                totalCredits: plan,
                price: getCreditPrice(plan)?.value.toFixed(2),
              }}
              medium
              gray
            />
          )}
          {planType === PlanType.subscription && (
            <Text medium gray>
              {plan === "month" && t("Subscribing to a Monthly plan")}
              {plan === "year" &&
                t(
                  "Subscribing to a Yearly plan. You will be charged ${{price}} once annually",
                  { price: getSubscriptionPrice(plan).value },
                )}
            </Text>
          )}
        </div>
        <div className="">
          {planType === PlanType.credits && <CreditsPlanPayment />}
          {planType === PlanType.subscription && <SubscriptionPlanPayment />}
        </div>
      </main>
      <Footer />
    </>
  )
}

const PayPalButtonsLoader: FC<PayPalButtonsComponentProps> = (props) => {
  const [{ isPending }] = usePayPalScriptReducer()
  return (
    <>
      <PayPalButtons {...props}>
        {isPending && (
          <Spinner
            className="animate-spin stroke-1 w-12 mx-auto "
            circleStroke="#33333366"
            semiCircleStroke="#333333"
          />
        )}
      </PayPalButtons>
    </>
  )
}

const CreditsPlanPayment = () => {
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
    <PayPalScriptProvider
      options={{
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      }}
    >
      <PayPalButtonsLoader
        {...{ createOrder, onApprove, onError }}
        style={{ layout: "vertical", label: "pay", color: "blue" }}
        className="mx-auto w-2/5 p-8 border border-gray-200 rounded-lg ring-0 dark:border-gray-700 dark:bg-gray-200"
      />
    </PayPalScriptProvider>
  )
}

const SubscriptionPlanPayment = () => {
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
      notification.success(t("Subscribed successfully. You can start using the app!"), {
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
        style={{ layout: "vertical", label: "subscribe", color: "blue" }}
        className="mx-auto w-2/5 p-8 border border-gray-200 rounded-lg ring-0 dark:border-gray-700 dark:bg-gray-200"
      />
    </PayPalScriptProvider>
  )
}

export default CreditCheckoutPage
