import { startWebhookListener } from "@/lib/client/webhookListener"
import { usePageProps } from "@/lib/hooks/usePageProps"
import { isClient, isDev } from "@/lib/utils"
import { useTranslation } from "next-i18next"
import { useEffect } from "react"
import { ModelForm } from "./ModelForm"

export const ImageActionsSection = () => {
  const { t } = useTranslation()
  const { titleToken, descriptionToken } = usePageProps<any>()

  useEffect(() => {
    if (isClient() && isDev()) startWebhookListener()
  }, [])

  return (
    <section className="md:w-2/5 ml-12">
      <div className="mt-2">
        <h1 className="font-bold text-4xl mb-6">{t(titleToken)}</h1>
        <h3>{t(descriptionToken)}</h3>
      </div>
      <ModelForm />
    </section>
  )
}
