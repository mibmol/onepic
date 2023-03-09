import { usePageProps } from "@/lib/hooks"
import Head from "next/head"
import { useTranslation } from "next-i18next"

export const SharedHead = () => {
  const { t } = useTranslation()
  const { titleToken, descriptionToken } = usePageProps<any>()
  return (
    <Head>
      <title>{t(titleToken)}</title>
      <meta name="description" content={t(descriptionToken)} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  )
}
