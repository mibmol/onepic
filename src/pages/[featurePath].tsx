import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { propEq } from "ramda"
import { useTranslation } from "next-i18next"
import Head from "next/head"
import { Header } from "@/components/layout"
import { aiFeatures } from "@/lib/data/models"
import { ImageDisplaySection } from "@/components/content/ImageDisplaySection"
import { ImageActionsSection } from "@/components/content/ImageActionsSection"
import { PagePropsProvider } from "@/lib/hooks/usePageProps"
import { Footer } from "@/components/layout/Footer"
import { SharedHead } from "@/components/layout/header/headUtils"

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: aiFeatures.map(({ path }) => ({ params: { featurePath: path } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({
  params: { featurePath },
  locale,
}) => {
  const localeProps = await serverSideTranslations(locale, ["common"])
  const { titleToken, descriptionToken, featureId } = aiFeatures.find(
    propEq("path", featurePath),
  )

  return {
    props: {
      ...localeProps,
      titleToken,
      descriptionToken,
      featureId,
    },
    revalidate: 16,
  }
}

type ToolPageProps = {
  titleToken: string
  descriptionToken: string
  featureId: string
}

const ToolPage: NextPage<ToolPageProps> = ({
  titleToken,
  descriptionToken,
  featureId,
}) => {
  return (
    <PagePropsProvider value={{ titleToken, descriptionToken, featureId }}>
      <SharedHead />
      <Header />
      <main className="w-10/12 md:flex mx-auto mt-14">
        <ImageDisplaySection />
        <ImageActionsSection />
      </main>
      <Footer />
    </PagePropsProvider>
  )
}

export default ToolPage
