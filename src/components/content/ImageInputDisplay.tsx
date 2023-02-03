import { useAppDispatch, useAppSelector } from "@/lib/state/hooks"
import { LoadingSpinner } from "./LoadingSpinner"
import { AppState } from "@/lib/state/store"
import { createSelector } from "@reduxjs/toolkit"
import { useDropArea } from "react-use"
import { FileInput } from "@/components/common"
import { ArrowsPointingOutIcon, ArrowUpTrayIcon } from "@heroicons/react/20/solid"
import { useCallback } from "react"
import { uploadImage } from "@/lib/state/imageProcessingSlice"

const indicatorSelector = createSelector(
  (state: AppState) => state.imageProcessing.uploading,
  (state: AppState) => state.imageProcessing.processing,
  (state: AppState) => state.imageProcessing.displayImageUrl,
  (state: AppState) => state.imageProcessing.resultImageUrl,
  (uploading, processing, displayImageUrl, resultImageUrl) => ({
    uploading,
    processing,
    displayImageUrl,
    resultImageUrl,
  }),
)

export const ImageInputDisplay = () => {
  const dispatch = useAppDispatch()
  const { uploading, processing, displayImageUrl, resultImageUrl } =
    useAppSelector(indicatorSelector)

  const onFileChange = useCallback(
    (file: File) => dispatch(uploadImage(file)),
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
            className="absolute top-6 left-4 z-30 flex items-center justify-center w-44 text-white text-sm py-3 bg-gray-900 hover:bg-gray-800 active:bg-black"
            icon={<ArrowUpTrayIcon className="w-5 h-5 text-white mr-3" />}
            accept="image/png, image/jpeg, image/webp"
          />
          {resultImageUrl && <ResultFullscreenButton />}
        </>
      )}
      <picture>
        <img
          src={displayImageUrl}
          className="w-full object-cover"
          alt="user uploaded image"
        />
      </picture>
    </div>
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
