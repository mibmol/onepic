import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { GetStaticProps, NextPage } from "next"
import { Header } from "@/components/layout"
import { SharedHead } from "@/components/layout/header/headUtils"
import { PagePropsProvider } from "@/lib/hooks"
import { Button, Text } from "@/components/common"
import { Footer } from "@/components/layout/Footer"
import { ArrowDownIcon } from "@heroicons/react/20/solid"
import { GradientText } from "@/components/common/GradientText"
import { PricingSection } from "@/components/content/PricingSection"
import { FeaturesSection } from "@/components/content/FeaturesSection"

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeProps = await serverSideTranslations(locale, ["common"])

  return {
    props: { ...localeProps },
  }
}

const Home: NextPage = ({}) => {
  return (
    <PagePropsProvider
      value={{ titleToken: "AImage", descriptionToken: "Generated by create next app" }}
    >
      <SharedHead />
      <Header className="sticky top-0" />
      <main className="w-full">
        <section className="px-6 mt-20 lg:mt-40 text-center">
          <GradientText
            charRange={[27]}
            as="h1"
            className="max-w-3xl mx-auto"
            labelToken="Transform Your Photos with AI Magic"
            size="6xl"
            bold
          />
          <Text
            as="h3"
            className="max-w-2xl mx-auto mt-12"
            labelToken="Discover the power of AI and take your images to the next level with just one click."
            size="xl"
            semibold
            gray
          />
        </section>
        <section>
          <Button
            labelToken="Explore features"
            Icon={ArrowDownIcon}
            iconPlacement="right"
            className="mx-auto mt-32"
            onClick={() =>
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth", inline: "start" })
            }
          />
        </section>
        <FeaturesSection/>
        <PricingSection />
      </main>
      <Footer />
    </PagePropsProvider>
  )
}



export default Home
