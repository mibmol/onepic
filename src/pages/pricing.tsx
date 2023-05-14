import { Header } from "@/components/layout"
import { PagePropsProvider } from "@/lib/hooks"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { SharedHead } from "@/components/layout/header/headUtils"
import { Footer } from "@/components/layout/Footer"
import { PricingSection } from "@/components/content/PricingSection"

export const getStaticProps = async ({ locale }) => {
  const localeProps = await serverSideTranslations(locale, ["common"])
  return {
    props: { ...localeProps },
  }
}

const PricingPage = () => {
  const { t } = useTranslation()
  return (
    <PagePropsProvider
      value={{ titleToken: "Pricing", descriptionToken: "Pricing information for Onepic.AI plans" }}
    >
      <SharedHead />
      <Header />
      <main className="md:px-12">
        <div className="mt-8 md:mt-16">
          <PricingSection />
        </div>
      </main>
      <Footer />
    </PagePropsProvider>
  )
}

export default PricingPage
