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
  const { t } = useTranslation()

  return (
    <PagePropsProvider value={{ titleToken, descriptionToken, featureId }}>
      <Head>
        <title>{t(titleToken)}</title>
        <meta name="description" content={t(descriptionToken)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="h-screen w-10/12 md:flex mx-auto mt-16">
        <ImageDisplaySection />
        <ImageActionsSection />
      </main>
    </PagePropsProvider>
  )
}

export default ToolPage
