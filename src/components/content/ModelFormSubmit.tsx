import { Model, getFeatureByModelName } from "@/lib/data/models"
import { useAppSelector } from "@/lib/state/hooks"
import { AppState } from "@/lib/state/store"
import { cn, getPathWithQueryParams, isHttpUrl } from "@/lib/utils"
import { useTranslation } from "next-i18next"
import { FC, useEffect, useRef } from "react"
import { SubmitButton, Messsage, Button } from "@/components/common"
import { getUserPlanInfo } from "@/lib/client/payment"
import useSWR from "swr"
import { useAfterRenderState } from "@/lib/hooks/useAfterRenderState"
import { createSelector } from "@reduxjs/toolkit"

const submitDisabledSelector = createSelector(
  (state: AppState) => state.imageProcessing.uploading,
  (state: AppState) => state.imageProcessing.processing,
  (state: AppState) => state.imageProcessing.inputImageUrl,
  (uploading, processing, inputImageUrl) => ({
    uploading,
    processing,
    inputImageUrl,
  }),
)

export const ModelFormSubmit: FC<{ selectedModel: Model }> = ({ selectedModel }) => {
  const { t } = useTranslation()
  const { uploading, processing, inputImageUrl } = useAppSelector(submitDisabledSelector)
  const { data: planInfo } = useSWR("planInfo", () => getUserPlanInfo(false), {
    errorRetryCount: 2,
    errorRetryInterval: 30000,
    dedupingInterval: 6000,
  })
  const buyCreditsCallbackUrl = useAfterRenderState(getPathWithQueryParams)
  const submitRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (selectedModel.autoSubmit && !uploading && isHttpUrl(inputImageUrl)) {
      submitRef.current?.click()
    }
  }, [uploading, inputImageUrl, selectedModel.name, selectedModel.autoSubmit])

  const disabled = uploading || processing
  const hasCredits = selectedModel.credits === 0 || planInfo?.credits > 0
  return (
    <div
      className={cn({
        "mt-6": hasCredits,
        hidden: selectedModel.autoSubmit,
      })}
    >
      {!hasCredits && (
        <Messsage
          title={
            <div className="flex items-center">
              {planInfo
                ? t("You ran out of credits")
                : t("You need to login to use this feature")}
              <Button
                variant="tertiary"
                labelToken={planInfo ? "Buy credits" : "Sign-in"}
                href={
                  (planInfo ? "/pricing?" : "/auth/signin?") +
                  new URLSearchParams({ callbackUrl: buyCreditsCallbackUrl })
                }
                className="py-1"
              />
            </div>
          }
          className="w-96 mb-6 mt-5"
          iconClassName="mt-1"
        />
      )}
      <SubmitButton
        {...{ disabled }}
        ref={submitRef}
        labelToken={getFeatureByModelName(selectedModel.name).actionToken}
      />
    </div>
  )
}
