import { GithubIcon, GoogleIcon } from "@/components/common/icons"
import { Header } from "@/components/layout"
import { Footer } from "@/components/layout/Footer"
import { SharedHead } from "@/components/layout/header/headUtils"
import { cn } from "@/lib/utils"
import { GetStaticProps, NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { Text } from "@/components/common"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeProps = await serverSideTranslations(locale, ["common"])

  return {
    props: { ...localeProps },
  }
}

const providers = [
  {
    id: "google",
    labelToken: "Continue with Google",
    Icon: GoogleIcon,
    className: `
      text-gray-800 border border-gray-300 dark:text-white dark:border-gray-800
      hover:bg-gray-200 dark:hover:bg-gray-900
    `,
  },
  {
    id: "github",
    labelToken: "Continue with GitHub",
    Icon: GithubIcon,
    className: `
      text-white bg-gray-900 dark:bg-black dark:border-gray-800 dark:border
      hover:bg-gray-700 dark:hover:bg-gray-900
    `,
  },
]

type SignInPageProps = {
  providers: string[]
}
const SignInPage: NextPage<SignInPageProps> = ({}) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    if (session) {
      const { callbackUrl } = router.query
      callbackUrl ? router.replace(callbackUrl as string) : router.replace("/")
    }
  }, [session, router])

  return (
    <>
      <SharedHead />
      <Header className="border-b" />
      <main className="w-10/12 md:flex mx-auto mt-14">
        <div className="flex flex-col items-center mx-auto mt-8">
          <Text
            as="h1"
            labelToken="Sign-In to AImage"
            size="2xl"
            className="mb-4 mt-16"
            bold
          />
          <Text
            as="p"
            labelToken="Signin and get 10 credits every week for free"
            className="mb-8"
            medium
            gray
          />
          {router.query.error === "OAuthAccountNotLinked" && (
            <Text labelToken="To confirm your identity, sign in with the same account you used initially" />
          )}
          {providers.map(({ id, className, labelToken, Icon }) => {
            return (
              <button
                key={id}
                type="submit"
                className={cn("mt-4 px-12 py-3 flex font-medium rounded-md", className)}
                onClick={() =>
                  signIn(id, { callbackUrl: (router.query.callbackUrl as string) ?? "/" })
                }
              >
                {<Icon className="w-6 h-6 mr-3" />}
                {t(labelToken)}
              </button>
            )
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default SignInPage
