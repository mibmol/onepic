import { useTranslation } from "next-i18next"
import { FC } from "react"

type DescriptionSectionProps = {
  descriptionToken: string
}

export const DescriptionSection: FC<DescriptionSectionProps> = ({ descriptionToken }) => {
  const { t } = useTranslation()
  return <section >{t(descriptionToken)}</section>
}
