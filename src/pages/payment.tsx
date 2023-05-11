import { Header } from "@/components/layout"
import { Footer } from "@/components/layout/Footer"
import { SharedHead } from "@/components/layout/header/headUtils"
import { getCreditPrice, getSubscriptionPrice, isClient } from "@/lib/utils"
import { GetStaticProps, NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { Text } from "@/components/common"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { redirectToLogin } from "@/lib/utils/clientRouting"
import { PlanType } from "@/lib/data/entities"
import { CreditsPlanPayment } from "@/components/content/payment/CreditsPlanPayment"
import { SubscriptionPlanPayment } from "@/components/content/payment/SubscriptionPayment"

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeProps = await serverSideTranslations(locale, ["common"])

  return {
    props: { ...localeProps },
  }
}

const CreditCheckoutPage: NextPage = () => {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const router = useRouter()
  const { plan, planType } = router.query

  useEffect(() => {
    if (!session && isClient()) {
      redirectToLogin(router)
    } else if (!plan || !planType) {
      router.back()
    }
  }, [session, router, router.query, plan, planType])

  return (
    <>
      <SharedHead />
      <Header className="border-b" showBottomLineOnScroll={false} />
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
        <div className="mx-auto px-4 lg:w-3/5">
          {planType === PlanType.credits && <CreditsPlanPayment />}
          {planType === PlanType.subscription && <SubscriptionPlanPayment />}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CreditCheckoutPage
