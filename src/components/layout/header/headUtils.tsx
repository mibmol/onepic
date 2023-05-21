import { usePageProps } from "@/lib/hooks"
import Head from "next/head"
import { useTranslation } from "next-i18next"

export const SharedHead = () => {
  const { t } = useTranslation()
  const {
    titleToken,
    descriptionToken,
    openGraphTitle,
    openGraphDescription,
    openGraphImage,
    path,
  } = usePageProps<any>()
  return (
    <Head>
      <title>{t(titleToken)}</title>
      <meta name="description" content={t(descriptionToken)} />
      <meta
        property="og:title"
        content={openGraphTitle ? `OnepicAI | ${openGraphTitle}` : t(titleToken)}
      />
      <meta
        property="og:description"
        content={openGraphDescription ?? t(descriptionToken)}
      />
      <meta
        property="og:image"
        content={openGraphImage ?? "https://onepic.ai/logo.png"}
      />
      <meta property="og:url" content={"https://onepic.ai/" + (path ?? "")} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  )
}
