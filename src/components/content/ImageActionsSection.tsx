import { usePageProps } from "@/lib/hooks/usePageProps"
import { ModelForm } from "./ModelForm"
import { Text } from "@/components/common"

export const ImageActionsSection = () => {
  const { titleToken, descriptionToken } = usePageProps<any>()

  return (
    <section className="md:w-2/5 ml-12">
      <div className="mt-2">
        <Text as="h1" className="mb-6" labelToken={titleToken} size="4xl" bold />
        <Text as="p" labelToken={descriptionToken} gray />
      </div>
      <ModelForm />
    </section>
  )
}
