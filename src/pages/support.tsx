import { Header } from "@/components/layout"
import { PagePropsProvider } from "@/lib/hooks"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { SharedHead } from "@/components/layout/header/headUtils"
import { Footer } from "@/components/layout/Footer"

export const getStaticProps = async ({ locale }) => {
  const localeProps = await serverSideTranslations(locale, ["common"])
  return {
    props: { ...localeProps },
  }
}

const SupportPage = () => {
  const { t } = useTranslation()
  return (
    <PagePropsProvider
      value={{ titleToken: "Support", descriptionToken: "Support page for Onepic.ai" }}
    >
      <SharedHead />
      <Header />
      <main className="px-12">{t("Support")}</main>
      <Footer />
    </PagePropsProvider>
  )
}

export default SupportPage
