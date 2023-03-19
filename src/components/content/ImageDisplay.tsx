import { useAppDispatch, useAppSelector } from "@/lib/state/hooks"
import { LoadingSpinner } from "./LoadingSpinner"
import { AppState } from "@/lib/state/store"
import { createSelector } from "@reduxjs/toolkit"
import { useDropArea } from "react-use"
import { Button, FileInput, Img } from "@/components/common"
import {
  ArrowDownOnSquareIcon,
  ArrowDownTrayIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline"
import { MouseEventHandler, useCallback, useEffect, useRef } from "react"
import { uploadImage } from "@/lib/state/imageProcessingSlice"
import { useTranslation } from "react-i18next"
import { dowloadImage, downloadFile, imgToObjectUrl, isNotNil } from "@/lib/utils"
import { uploadUserResultImage } from "@/lib/client/upload"

const indicatorSelector = createSelector(
  (state: AppState) => state.imageProcessing.uploading,
  (state: AppState) => state.imageProcessing.processing,
  (state: AppState) => state.imageProcessing.resultImageUrl,
  (uploading, processing, resultImageUrl) => ({
    uploading,
    processing,
    resultImageUrl,
  }),
)

export const ImageDisplay = () => {
  const dispatch = useAppDispatch()
  const { uploading, processing, resultImageUrl } = useAppSelector(indicatorSelector)

  const onFileChange = useCallback(
    (file: File) => dispatch(uploadImage({ value: file })),
    [dispatch],
  )
  const [dropHandlers] = useDropArea({
    onFiles: (files = []) => onFileChange(files[0]),
  })

  return (
    <div className="w-full relative" {...dropHandlers}>
      {uploading && (
        <div className="absolute z-40 inset-0 flex items-center justify-center bg-black/50 dark:bg-black/75">
          <LoadingSpinner labelToken="general.uploading" />
        </div>
      )}
      {processing && (
        <div className="absolute z-40 inset-0 flex items-center justify-center bg-black/50 dark:bg-black/75">
          <LoadingSpinner labelToken="general.processing" />
        </div>
      )}
      {!(uploading || processing) && (
        <div className="flex items-center justify-between absolute inset-x-0 pt-6 px-6 z-40">
          <FileInput
            {...{ onFileChange }}
            id="image-input-2"
            name="image-input-2"
            labelToken="general.newPhoto"
            className=""
            accept="image/png, image/jpeg, image/webp"
            Icon={ArrowUpOnSquareIcon}
          />
          {resultImageUrl && (
            <Button
              labelToken="Download"
              Icon={ArrowDownTrayIcon}
              onClick={() => dowloadImage(resultImageUrl).catch(console.error)}
            />
          )}
        </div>
      )}
      <ImageView />
    </div>
  )
}

const imageDisplaySelector = createSelector(
  (state: AppState) => state.imageProcessing.inputImageUrl,
  (state: AppState) => state.imageProcessing.resultImageUrl,
  (state: AppState) => state.imageProcessing.predictionId,
  (state: AppState) => state.imageProcessing.currentModelName,
  (inputImageUrl, resultImageUrl, predictionId, modelName) => ({
    inputImageUrl,
    resultImageUrl,
    predictionId,
    modelName,
  }),
)

const ImageView = () => {
  const { t } = useTranslation()
  const resultImgRef = useRef<HTMLImageElement>(null)
  const clipImgRef = useRef<HTMLImageElement>(null)
  const sliderRef = useRef<HTMLInputElement>(null)
  const { predictionId, inputImageUrl, resultImageUrl, modelName } =
    useAppSelector(imageDisplaySelector)

  useEffect(() => {
    if (predictionId) {
      const imageLoadedHandler = async () => {
        try {
          await uploadUserResultImage(
            await imgToObjectUrl(resultImgRef.current),
            predictionId,
            modelName,
          )
        } catch (error) {
          console.error(error)
        }
      }
      const imgElement = resultImgRef.current
      imgElement.addEventListener("load", imageLoadedHandler)
      return () => imgElement.removeEventListener("load", imageLoadedHandler)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictionId])

  const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    ({ clientX, currentTarget }) => {
      const { right, left } = currentTarget.getBoundingClientRect()
      const percentage = (((clientX - left) * 100) / (right - left)).toFixed(1)
      clipImgRef.current.setAttribute(
        "style",
        `clip-path: polygon(0px 0px, ${percentage}% 0px, ${percentage}% 100%, 0px 100%);`,
      )
      sliderRef.current.setAttribute("style", `left: ${percentage}%;`)
    },
    [],
  )

  const showSlider = isNotNil(resultImageUrl)
  return (
    <div {...(showSlider && { onMouseMove, className: "cursor-ew-resize" })}>
      {showSlider && (
        <Img
          ref={clipImgRef}
          src={inputImageUrl}
          className="absolute w-full object-cover"
          style={{ clipPath: "polygon(0px 0px, 50% 0px, 50% 100%, 0px 100%)" }}
          alt={t("User uploaded image")}
          crossOrigin="anonymous"
        />
      )}
      <Img
        ref={resultImgRef}
        src={resultImageUrl ?? inputImageUrl}
        className="w-full object-cover"
        alt={t("User uploaded image")}
        crossOrigin="anonymous"
      />
      {showSlider && (
        <div
          ref={sliderRef}
          className="absolute flex-1 z-30 left-1/2 w-px top-0 bottom-0 bg-gray-600/25"
        />
      )}
    </div>
  )
}
