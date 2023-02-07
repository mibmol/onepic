import { useSession, signIn, signOut } from "next-auth/react"
import { useTranslation } from "react-i18next"

export default function AuthSection() {
  const { data: session } = useSession()
  const { t } = useTranslation()

  return (
    <div className="flex">
      {session ? (
        <>
          <span className="mr-2">
            {t("Signed in as {{email}}", { email: session.user.email })} <br />
          </span>
          <button className="font-medium" onClick={() => signOut()}>
            {t("Sign out")}
          </button>
        </>
      ) : (
        <>
          <span className="mr-2">{t("Not signed in")}</span>
          <button className="font-medium" onClick={() => signIn()}>
            {t("Sign in")}
          </button>
        </>
      )}
    </div>
  )
}
