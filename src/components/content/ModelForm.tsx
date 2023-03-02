import { getProcessImageState } from "@/lib/client/processing"
import { getModelByName, getModelsByFeatureId } from "@/lib/data/models"
import { usePageProps } from "@/lib/hooks/usePageProps"
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks"
import { imageGenerationSlice, processImage } from "@/lib/state/imageProcessingSlice"
import { AppDispatch, AppState } from "@/lib/state/store"
import { cn, notification } from "@/lib/utils"
import { TFunction, useTranslation } from "next-i18next"
import { FC, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"

const { setResultImage, stopProcessing, clearImages } = imageGenerationSlice.actions
const checkProcessingState = async (
  predictionId: string,
  dispatch: AppDispatch,
  t: TFunction,
) => {
  let intervalId = null
  intervalId = setInterval(async () => {
    try {
      const { output, status } = await getProcessImageState(predictionId)
      if (status === "succeeded") {
        clearInterval(intervalId)
        dispatch(setResultImage(output))
      }
      if (status === "failed") {
        throw new Error(status)
      }
    } catch (error) {
      clearInterval(intervalId)
      dispatch(stopProcessing())
      notification.error(t("And error occurred while processing"))
    }
  }, 1500)
}

const checkValidationErrors = (error, t: TFunction) => {
  const validations = error.body?.error?.validation
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
    () => getModelByName(modelName) ?? defaultModel,
    // eslint-disable-next-line
    [modelName],
  )

  const onSubmit = handleSubmit((values) => {
    dispatch(
      processImage({
        value: values,
        onSuccess: ({ id }) => checkProcessingState(id, dispatch, t),
        onError: (error) => checkValidationErrors(error, t),
      }),
    )
  })

  return (
    <form {...{ onSubmit }}>
      <div className={cn("flex flex-col mt-4", { hidden: models.length === 1 })}>
        <label htmlFor="modelName">
          {t("Don't like the result? Try another method")}
        </label>
        <select {...register("modelName")} id="modelName">
          {models.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {selectedModel?.fields.map((field) => (
        <div
          key={field.name}
          className={cn("flex mt-4", {
            "flex-col": field.type !== "boolean",
            "flex-row-reverse justify-end items-center": field.type === "boolean",
          })}
        >
          <label
            htmlFor={field.name}
            className={cn({ "mx-4": field.type === "boolean" })}
          >
            {t(field.labelToken)}
          </label>
          {field.type === "boolean" && (
            <input
              {...register(field.name)}
              id={field.name}
              type="checkbox"
              defaultChecked={field.defaultValue}
            />
          )}
          {field.type === "float" && (
            <input
              {...register(field.name)}
              id={field.name}
              defaultValue={field.defaultValue}
              type="number"
              min={field.min}
              max={field.max}
              step={0.05}
            />
          )}
          {field.type === "integer" && (
            <input
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
      <SubmitButton />
    </form>
  )
}

const submitDisabledSelector = ({ imageProcessing }: AppState) =>
  imageProcessing.uploading || imageProcessing.processing

const SubmitButton: FC = () => {
  const { t } = useTranslation()
  const disabled = useAppSelector(submitDisabledSelector)

  return (
    <div className="flex justify-left mt-4">
      <button
        {...{ disabled }}
        type="submit"
        className="text-white px-6 py-4 rounded-md duration-200 bg-indigo-700 hover:bg-indigo-600 active:bg-indigo-900 disabled:bg-gray-300"
      >
        {t("general.submit")}
      </button>
    </div>
  )
}
