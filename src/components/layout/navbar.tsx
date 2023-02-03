import { FC } from "react"
import { useTranslation } from "next-i18next"
import Link from "next/link"
import { aiFeatures } from "@/lib/data/models"

type NavbarProps = {
  currentPath: string
}

export const Navbar: FC<NavbarProps> = ({ currentPath }) => {
  const { t } = useTranslation()
  return (
    <nav>
      <ul className="flex flex-row">
        {aiFeatures.map(({ path, titleToken }) => (
          <li key={path} className="mx-2">
            <Link href={`/${path}`}>{t(titleToken)}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
