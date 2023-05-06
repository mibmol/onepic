import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { propEq } from "ramda"
import { Header } from "@/components/layout"
import { aiFeatures } from "@/lib/data/models"
import { ImageDisplaySection } from "@/components/content/ImageDisplaySection"
import { PagePropsProvider } from "@/lib/hooks/usePageProps"
import { Footer } from "@/components/layout/Footer"
import { SharedHead } from "@/components/layout/header/headUtils"
import { Text } from "@/components/common"
import { ModelForm } from "@/components/content/ModelForm"

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
      <main className="grid w-10/12 mx-auto mt-14">
        <section className="lg:w-2/5">
          <div className="text-center max-w-lg mx-auto mb-6">
            <Text as="h1" className="mb-6" labelToken={titleToken} size="4xl" bold />
            <Text as="p" labelToken={descriptionToken} gray />
          </div>
        </section>
        <section className="lg:w-3/5">
          <ImageDisplaySection />
        </section>
        <section>
          <ModelForm />
        </section>
      </main>
      <Footer />
    </PagePropsProvider>
  )
}

export default ToolPage
