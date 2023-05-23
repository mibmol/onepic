import { getProcessImageState } from "@/lib/client/processing"
import { getModelByName, getModelsByFeatureId } from "@/lib/data/models"
import { usePageProps } from "@/lib/hooks/usePageProps"
import { useAppDispatch } from "@/lib/state/hooks"
import { imageGenerationSlice, processImage } from "@/lib/state/imageProcessingSlice"
import { AppDispatch } from "@/lib/state/store"
import { cn, FetchJsonError, notification, redirectToLogin } from "@/lib/utils"
import { TFunction, useTranslation } from "next-i18next"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import {
  Text,
  Select,
  NumberInput,
  Checkbox,
  Messsage,
  IntegerRadioGroup,
} from "@/components/common"
import { useSession } from "next-auth/react"
import { AppErrorCode, ReplicateStatus } from "@/lib/data/entities"
import { ModelFormSubmit } from "./ModelFormSubmit"

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
      const { output, status, assets } = await getProcessImageState(predictionId)
      dispatch(setReplicateStatus(status))
      switch (status) {
        case ReplicateStatus.succeeded:
          clearInterval(intervalId)
          dispatch(
            setResultImage({ output: assets.originalResultUrl ?? output, predictionId }),
          )
          break
        case ReplicateStatus.failed:
          throw new Error(status)
        default:
          break
      }
    } catch (error) {
      clearInterval(intervalId)
      dispatch(stopProcessing())
      notification.error(t("An error occurred while processing"), {
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
  const { register, handleSubmit, watch, reset, setValue, getValues } = useForm()
  const { featureId } = usePageProps<any>()
  const models = useMemo(() => getModelsByFeatureId(featureId), [featureId])

  const defaultModel = models[0]

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

  useEffect(() => {
    reset()
    dispatch(clearImages())
  }, [featureId, reset, dispatch])

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
          {field.type === "integer-select" && (
            <>
              <IntegerRadioGroup
                options={field.values}
                label={t(field.labelToken)}
                defaultValue={field.defaultValue}
                onChange={(value) => setValue(field.name, value)}
              />
            </>
          )}
        </div>
      ))}
      <div className="flex justify-left">
        <ModelFormSubmit {...{ selectedModel }} />
      </div>
    </form>
  )
}
