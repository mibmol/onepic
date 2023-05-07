import { GithubIcon, GoogleIcon } from "@/components/common/icons"
import { Header } from "@/components/layout"
import { Footer } from "@/components/layout/Footer"
import { SharedHead } from "@/components/layout/header/headUtils"
import { cn, getQueryParams, notification } from "@/lib/utils"
import { GetStaticProps, NextPage } from "next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import { useTranslation } from "next-i18next"
import { Button, Modal, Text, TextInput } from "@/components/common"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { FormEvent, FormEventHandler, useEffect, useState } from "react"
import { CheckCircleIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { useToggle } from "react-use"
import { useForm } from "react-hook-form"
import { useMountedState } from "@/lib/hooks"

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeProps = await serverSideTranslations(locale, ["common"])

  return {
    props: { ...localeProps },
  }
}

const oauthProviders = [
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
            labelToken="Sign-up to witcher.ai and get 10 credits for free"
            className="mb-8"
            medium
            gray
          />
          {router.query.error === "OAuthAccountNotLinked" && (
            <Text labelToken="To confirm your identity, sign in with the same account you used initially" />
          )}
          <EmailSignin />
          {oauthProviders.map(({ id, className, labelToken, Icon }) => {
            return (
              <button
                key={id}
                type="submit"
                className={cn(
                  "w-88 mt-4 px-12 py-3 flex font-medium rounded-md",
                  className,
                )}
                onClick={() =>
                  signIn(id, { callbackUrl: (router.query.callbackUrl as string) ?? "/" })
                }
              >
                {<Icon className="w-6 h-6 ml-6 mr-3" />}
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

const EmailSignin = () => {
  const { t } = useTranslation()
  const [showFormModal, toggleFormModal] = useToggle(false)
  const { register, handleSubmit, getValues } = useForm()
  const [sending, setSending] = useMountedState(false)
  const [done, setDone] = useState(false)

  const onSend = handleSubmit(async (values) => {
    setSending(true)
    try {
      // const form = new FormData(ev.currentTarget)
      const { ok } = await signIn("email", { email: values.email, redirect: false })
      ok && setDone(true)
    } catch (error) {
      console.error(error)
      notification.error(t("An error ocurred"))
    } finally {
      setSending(false)
    }
  })

  const closeModal = () => {
    toggleFormModal()
    setTimeout(() => setDone(false), 200)
  }

  return (
    <>
      <button
        className={`
          w-88 mt-4 px-12 py-3 flex font-medium rounded-md text-gray-800 border border-gray-300 
            dark:text-white dark:border-gray-800
          hover:bg-gray-200 dark:hover:bg-gray-900
        `}
        onClick={toggleFormModal}
      >
        {<EnvelopeIcon className="w-6 h-6 ml-6 mr-3" />}
        {t("Continue with Email")}
      </button>
      <Modal
        role="form"
        show={showFormModal}
        onClose={toggleFormModal}
        titleToken={done ? "Check your email" : "Type your email to sign-in or sign-up"}
      >
        {done ? (
          <div>
            <div className="flex items-center">
              <CheckCircleIcon className="w-6 h-6 stroke-2 stroke-purple-400 mr-2 -ml-1" />
              <Text labelToken="An sign-in email was sent to" className="mr-1" />
              <Text semibold>{getValues("email")}</Text>
            </div>
            <div className="flex justify-end mt-5">
              <Button labelToken="Close" onClick={closeModal} />
            </div>
          </div>
        ) : (
          <form onSubmit={onSend}>
            <TextInput
              type="email"
              {...register("email")}
              placeholder={t("email")}
              className="w-full mt-2"
              required
            />
            <div className="mt-6 flex justify-end">
              <Button
                labelToken="Cancel"
                type="button"
                onClick={toggleFormModal}
                variant="secondary"
                className="mr-3"
              />
              <Button type="submit" labelToken="Submit" loading={sending} />
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}

export default SignInPage
