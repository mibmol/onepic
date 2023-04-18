import {
  Img,
  PopoverMenu,
  SubmitButton,
  Text,
  TextInput,
  getButtonStyles,
} from "@/components/common"
import { useMemo } from "react"
import { useTranslation } from "next-i18next"
import { RadioGroup } from "@headlessui/react"
import { useForm } from "react-hook-form"
import { cn, notification } from "@/lib/utils"
import { postFeedback } from "@/lib/client/user"
import { useMountedState } from "@/lib/hooks"

export const FeedbackPopover = () => {
  const { t } = useTranslation()
  const triggerClasses = useMemo(() => getButtonStyles("secondary", "py-1 ml-2"), [])
  return (
    <PopoverMenu
      trigger={() => <>{t("Feedback")}</>}
      triggerClassName={triggerClasses}
      content={({ closeContent }) => <FeedbackForm onSent={closeContent} />}
      contentClassName="left-1/2 transform -translate-x-1/2"
    />
  )
}

const FeedbackForm = ({ onSent }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setValue } = useForm()
  const [sending, setSending] = useMountedState(false)

  const feedbackScores = [
    { name: "amazing", iconLink: "/icons/1f929.svg" },
    { name: "good", iconLink: "/icons/1f600.svg" },
    { name: "whatever", iconLink: "/icons/1f615.svg" },
    { name: "sad", iconLink: "/icons/1f62d.svg" },
  ]

  const sendFeedBack = handleSubmit(
    async (values: { feedback: string; score: string }) => {
      setSending(true)
      try {
        await postFeedback(values)
      } catch (error) {
      } finally {
        setSending(false)
        onSent()
        notification.success(t("Thanks for sending feedback :)"), {
          duration: 3000,
          position: "top-right",
        })
      }
    },
  )

  return (
    <form
      onSubmit={sendFeedBack}
      className="p-4 rounded-lg shadow-lg bg-white dark:shadow-none border dark:bg-black dark:border-gray-800"
    >
      <TextInput
        id="feedback"
        {...register("feedback")}
        rows={4}
        className="w-80 resize-none"
        placeholder={t("Your feedback")}
        required
        textArea
        autoFocus
      />
      <div className="mt-4 flex items-center justify-between">
        <RadioGroup className="flex" onChange={(value) => setValue("score", value)}>
          <RadioGroup.Label hidden>
            <Text
              labelToken="What's you overall reaction about this app?"
              size="sm"
              gray
              medium
            />
          </RadioGroup.Label>
          {feedbackScores.map(({ name, iconLink }) => (
            <RadioGroup.Option
              key={name}
              value={name}
              className={({ checked }) =>
                cn(
                  "p-1.5 mr-2 cursor-pointer border rounded-full border-gray-200 outline-none hover:border-gray-700 dark:border-gray-600 dark:hover:border-gray-400",
                  {
                    "border-amber-600 bg-amber-100 hover:border-amber-600 dark:border-amber-400 dark:bg-amber-600/25":
                      checked,
                  },
                )
              }
            >
              <Img src={iconLink} width={26} height={26} />
            </RadioGroup.Option>
          ))}
        </RadioGroup>
        <SubmitButton labelToken="Send" className="py-1" loading={sending} />
      </div>
    </form>
  )
}
