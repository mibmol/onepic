import { useAppDispatch, useAppSelector } from "@/lib/state/hooks"
import { LoadingSpinner } from "./LoadingSpinner"
import { AppState } from "@/lib/state/store"
import { createSelector } from "@reduxjs/toolkit"
import { useDropArea } from "react-use"
import { FileInput } from "@/components/common"
import { ArrowsPointingOutIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/outline"
import { useCallback, useEffect, useRef } from "react"
import { uploadImage } from "@/lib/state/imageProcessingSlice"
import { useTranslation } from "react-i18next"
import { imgToObjectUrl } from "@/lib/utils"
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

export const ImageInputDisplay = () => {
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
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <LoadingSpinner labelToken="general.uploading" />
        </div>
      )}
      {processing && (
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
          <LoadingSpinner labelToken="general.processing" />
        </div>
      )}
      {!(uploading || processing) && (
        <>
          <FileInput
            {...{ onFileChange }}
            id="image-input-2"
            name="image-input-2"
            labelToken="general.newPhoto"
            className="absolute top-6 left-4 z-30"
            accept="image/png, image/jpeg, image/webp"
            Icon={ArrowUpOnSquareIcon}
          />
          {resultImageUrl && <ResultFullscreenButton />}
        </>
      )}
      <ImageDisplay />
    </div>
  )
}

const imageDisplaySelector = createSelector(
  (state: AppState) => state.imageProcessing.displayImageUrl,
  (state: AppState) => state.imageProcessing.predictionId,
  (displayImageUrl, predictionId) => ({
    displayImageUrl,
    predictionId,
  }),
)

const ImageDisplay = () => {
  const { t } = useTranslation()
  const imgRef = useRef<HTMLImageElement>(null)
  const { predictionId, displayImageUrl } = useAppSelector(imageDisplaySelector)

  useEffect(() => {
    if (predictionId) {
      const imageLoadedHandler = async () => {
        try {
          await uploadUserResultImage(await imgToObjectUrl(imgRef.current), predictionId)
        } catch (error) {
          console.error(error)
        }
      }
      const imgElement = imgRef.current
      imgElement.addEventListener("load", imageLoadedHandler)
      return () => imgElement.removeEventListener("load", imageLoadedHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictionId])

  return (
    <picture>
      <img
        id="displayImageUrlElement"
        ref={imgRef}
        src={displayImageUrl}
        className="w-full object-cover"
        alt={t("User uploaded image")}
        crossOrigin="anonymous"
      />
    </picture>
  )
}

const ResultFullscreenButton = () => {
  const showFullscreenResult = () => {}
  return (
    <button
      onClick={showFullscreenResult}
      className="absolute p-3 top-6 right-6 z-30 bg-gray-900 bg-gray-900 hover:bg-gray-800 active:bg-black rounded-full"
    >
      <ArrowsPointingOutIcon className="w-5 h-5 text-white" />
    </button>
  )
}
