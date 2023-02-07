import { FC } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "next-i18next"
import { aiFeatures } from "@/lib/data/models"
import { cn } from "@/lib/utils/clsx"
import AuthSection from "../content/AuthSection"

export const Header: FC = () => {
  const route = useRouter()
  const { t } = useTranslation()
  return (
    <section className="flex flex-row justify-between items-center px-12 py-6">
      <div className="flex items-center">
        <Link href="/">
          <Image width="40" height="40" src="/brain_icon.png" alt={t("general.Home")} />
        </Link>
        <div className="mx-4">&middot;</div>
        <nav>
          <ul className="flex flex-row">
            {aiFeatures.map(({ path, titleToken }) => {
              const pathname = `/${path}`
              return (
                <li key={path} className="mx-3">
                  <Link
                    href={pathname}
                    className={cn(
                      "rounded-md py-3 px-5 text-slate-600 hover:text-slate-800 hover:bg-slate-50",
                      {
                        "bg-slate-100 hover:bg-slate-100 text-slate-800":
                          route.asPath === pathname,
                      },
                    )}
                  >
                    {t(titleToken)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <div>
        <AuthSection />
      </div>
    </section>
  )
}
