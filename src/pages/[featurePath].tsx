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
import { isClient } from "@/lib/utils"

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
  const feature = aiFeatures.find(propEq("path", featurePath))

  return {
    props: {
      ...localeProps,
      ...feature,
    },
  }
}

type ToolPageProps = {
  titleToken: string
  descriptionToken: string
  featureId: string
  openGraphImage: string
  openGraphTitle: string
  path: string
}

const ToolPage: NextPage<ToolPageProps> = ({
  titleToken,
  descriptionToken,
  featureId,
  openGraphImage,
  openGraphTitle,
  path,
}) => {
  return (
    <PagePropsProvider
      value={{
        titleToken,
        descriptionToken,
        featureId,
        openGraphImage,
        openGraphTitle,
        path,
      }}
    >
      <SharedHead />
      <Header />
      <main className="grid grid-cols-1 lg:grid-cols-2 px-6 md:px-16 lg:px-0 lg:w-10/12 mx-auto mt-8 md:mt-14">
        <section className="lg:hidden">
          <div className="text-center max-w-lg mx-auto mb-6">
            <Text as="h1" className="mb-6" labelToken={titleToken} size="4xl" bold />
            <Text as="p" labelToken={descriptionToken} gray />
          </div>
        </section>
        <section>
          <ImageDisplaySection />
        </section>
        <section className="lg:ml-8">
          <div className="hidden lg:block mb-6">
            <Text as="h1" className="mb-6" labelToken={titleToken} size="4xl" bold />
            <Text as="p" labelToken={descriptionToken} gray />
          </div>
          <ModelForm />
        </section>
      </main>
      {isClient() && <ExoClickBanner />}
      <Footer />
    </PagePropsProvider>
  )
}

const ExoClickBanner = () => {
  const onLoad = () => {
    ;((window as any).AdProvider ?? []).push({ serve: {} })
  }
  return (
    <div>
      <script
        async
        type="application/javascript"
        src="https://a.exdynsrv.com/ad-provider.js"
        onLoad={onLoad}
      ></script>
      <ins className="eas6a97888ec52c042c679a36e919843cca" data-zoneid="5018992"></ins>
    </div>
  )
}

export default ToolPage
