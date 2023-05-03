import { getProcessImageState } from "@/lib/client/processing"
import { getModelByName, getModelsByFeatureId } from "@/lib/data/models"
import { usePageProps } from "@/lib/hooks/usePageProps"
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks"
import { imageGenerationSlice, processImage } from "@/lib/state/imageProcessingSlice"
import { AppDispatch, AppState } from "@/lib/state/store"
import { cn, FetchJsonError, notification, redirectToLogin } from "@/lib/utils"
import { TFunction, useTranslation } from "next-i18next"
import { FC, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import {
  SubmitButton,
  Text,
  Select,
  NumberInput,
  Checkbox,
  Messsage,
  Button,
} from "@/components/common"
import { useSession } from "next-auth/react"
import { AppErrorCode, ReplicateStatus } from "@/lib/data/entities"
import { getUserPlanInfo } from "@/lib/client/payment"
import useSWR from "swr"

const {
  setResultImage,
  stopProcessing,
  clearImages,
  setCurrentModelName,
  setReplicateStatus,
} = imageGenerationSlice.actions

const checkProcessingState = async (
  predictionId: string,
  dispatch: AppDispatch,
  t: TFunction,
) => {
  let intervalId = setInterval(async () => {
    try {
      const { output, status } = await getProcessImageState(predictionId)
      dispatch(setReplicateStatus(status))
      switch (status) {
        case ReplicateStatus.succeeded:
          clearInterval(intervalId)
          dispatch(setResultImage({ output, predictionId }))
          break
        case ReplicateStatus.failed:
          throw new Error(status)
        default:
          break
      }
    } catch (error) {
      clearInterval(intervalId)
      dispatch(stopProcessing())
      notification.error(t("And error occurred while processing"), {
        position: "top-right",
      })
    }
  }, 1500)
}

const showErrors = (e: FetchJsonError, t: TFunction) => {
  const { error, errorCode } = e.body ?? {}
  if (errorCode === AppErrorCode.USER_OUT_OF_CREDITS) {
    return notification.info(
      t("You ran out of credits, please buy more credits or subscribe to a plan"),
      { duration: 6000 },
    )
  }
  const validations = error?.validation
  if (validations) {
    for (let { property } of validations) {
      if (property === "input") {
        notification.info(t("Please, select an image from your device"))
      }
    }
  } else {
    notification.error(t("Something went wrong"))
  }
}

export const ModelForm = () => {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const { register, handleSubmit, watch, reset } = useForm()
  const { featureId } = usePageProps<any>()
  const models = useMemo(() => getModelsByFeatureId(featureId), [featureId])

  const defaultModel = models[0]

  useEffect(() => {
    reset()
    dispatch(clearImages())
  }, [featureId, reset, dispatch])

  const modelName = watch("modelName", defaultModel?.name)
  const selectedModel = useMemo(
    () => {
      const model = getModelByName(modelName) ?? defaultModel
      dispatch(setCurrentModelName(model.name))
      return model
    },
    // eslint-disable-next-line
    [modelName],
  )

  const onSubmit = handleSubmit((values) => {
    if (!session && selectedModel.credits > 0) {
      return redirectToLogin()
    }
    dispatch(
      processImage({
        value: values,
        onSuccess: ({ id }) => checkProcessingState(id, dispatch, t),
        onError: (error) => showErrors(error, t),
      }),
    )
  })

  return (
    <form {...{ onSubmit }}>
      <div className={cn("flex flex-col mt-6", { hidden: models.length === 1 })}>
        <Text
          as="label"
          htmlFor="modelName"
          labelToken="Don't like the result? Try another method"
          className="mb-2"
          medium
        />
        <Select
          {...register("modelName")}
          id="modelName"
          options={models.map(({ name, labelToken }) => ({
            value: name,
            labelToken: labelToken ?? name,
          }))}
        />
      </div>
      {selectedModel?.credits > 1 && (
        <>
          <Messsage
            title={t("This option will take {{credits}} of your credits", {
              credits: selectedModel.credits,
            })}
            variant="info"
            className="mt-3"
          />
        </>
      )}
      {selectedModel?.fields.map((field) => (
        <div
          key={field.name}
          className={cn("flex", {
            "flex-col mt-3": field.type !== "boolean",
            "flex-row-reverse justify-end items-center mt-5": field.type === "boolean",
          })}
        >
          <Text
            as="label"
            htmlFor={field.name}
            className={cn({
              "mb-2": field.type !== "boolean",
              "mx-4": field.type === "boolean",
            })}
            labelToken={field.labelToken}
            medium
          />
          {field.type === "boolean" && (
            <Checkbox
              {...register(field.name)}
              id={field.name}
              type="checkbox"
              defaultChecked={field.defaultValue}
            />
          )}
          {field.type === "integer" && (
            <NumberInput
              {...register(field.name)}
              id={field.name}
              defaultValue={field.defaultValue}
              type="number"
              min={field.min}
              max={field.max}
              step={1}
            />
          )}
        </div>
      ))}
      <div className="flex justify-left">
        <Submit />
      </div>
    </form>
  )
}

const submitDisabledSelector = ({ imageProcessing }: AppState) =>
  imageProcessing.uploading || imageProcessing.processing

const Submit: FC = () => {
  const { t } = useTranslation()
  const disabled = useAppSelector(submitDisabledSelector)
  const { data } = useSWR("planInfo", getUserPlanInfo)

  const hasCredits = data?.credits > 0
  return (
    <div className={cn(hasCredits && "mt-6")}>
      {!hasCredits && (
        <Messsage
          title={
            <div className="flex items-center">
              {t("You ran out of credits")}{" "}
              <Button
                variant="tertiary"
                labelToken="Buy credits"
                href="/pricing"
                className="py-1"
              />
            </div>
          }
          className="w-96 mb-6 mt-5"
          iconClassName="mt-1"
        />
      )}
      <SubmitButton {...{ disabled }} labelToken="general.submit" />
    </div>
  )
}
