import { useAppDispatch, useAppSelector } from "@/lib/state/hooks"
import { LoadingSpinner } from "./LoadingSpinner"
import { AppState } from "@/lib/state/store"
import { createSelector } from "@reduxjs/toolkit"
import { useDropArea } from "react-use"
import { Button, FileInput, Img, Messsage } from "@/components/common"
import {
  ArrowDownTrayIcon,
  ArrowUpOnSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import {
  MouseEventHandler,
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
} from "react"
import { uploadImage } from "@/lib/state/imageProcessingSlice"
import { useTranslation } from "react-i18next"
import { cn, dowloadImage, imgToObjectUrl, isNotNil } from "@/lib/utils"
import { uploadUserResultImage } from "@/lib/client/upload"
import { useRouter } from "next/router"
import { ReplicateStatus } from "@/lib/data/entities"

const indicatorSelector = createSelector(
  (state: AppState) => state.imageProcessing.uploading,
  (state: AppState) => state.imageProcessing.processing,
  (state: AppState) => state.imageProcessing.resultImageUrl,
  (state: AppState) => state.imageProcessing.replicateStatus,
  (uploading, processing, resultImageUrl, replicateStatus) => ({
    uploading,
    processing,
    resultImageUrl,
    replicateStatus,
  }),
)

export const ImageDisplay = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { uploading, processing, resultImageUrl, replicateStatus } =
    useAppSelector(indicatorSelector)

  const onFileChange = useCallback(
    (file: File) =>
      dispatch(
        uploadImage({
          value: file,
          onSuccess: (uploadedImageUrl: string) => {
            router.push({
              pathname: router.pathname,
              query: { ...router.query, inputImageUrl: uploadedImageUrl },
            })
          },
        }),
      ),
    [dispatch, router],
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
        <div className="absolute z-40 inset-0 flex flex-col items-center justify-center bg-black/50 dark:bg-black/75">
          <LoadingSpinner labelToken="general.processing" />
          {replicateStatus === ReplicateStatus.starting && (
            <Messsage
              title={t("Model is starting")}
              description={t(
                "Sometimes we turn off models to save resources. This is running in the background, so you can close this page and look for the result in the dashboard",
              )}
              className="mt-8"
            />
          )}
        </div>
      )}
      {!(uploading || processing) && (
        <div className="flex items-center justify-between absolute inset-x-0 pt-2 lg:pt-6 px-2 lg:px-6 z-150">
          <FileInput
            {...{ onFileChange }}
            id="image-input-2"
            name="image-input-2"
            labelToken="general.newPhoto"
            className="text-sm lg:text-base"
            accept="image/png, image/jpeg, image/webp"
            Icon={ArrowUpOnSquareIcon}
          />
          {resultImageUrl && (
            <Button
              labelToken="Download"
              className="text-sm lg:text-base"
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
  const rightImgRef = useRef<HTMLImageElement>(null)
  const leftImgRef = useRef<HTMLImageElement>(null)
  const sliderRef = useRef<HTMLInputElement>(null)
  const mousePosRef = useRef({ startX: 0, start: false })
  const { predictionId, inputImageUrl, resultImageUrl, modelName } =
    useAppSelector(imageDisplaySelector)

  useEffect(() => {
    if (predictionId) {
      const imageLoadedHandler = async () => {
        try {
          await uploadUserResultImage(
            await imgToObjectUrl(leftImgRef.current),
            predictionId,
            modelName,
          )
        } catch (error) {
          console.error(error)
        }
      }
      const imgElement = leftImgRef.current
      imgElement.addEventListener("load", imageLoadedHandler)
      return () => imgElement.removeEventListener("load", imageLoadedHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predictionId])

  const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    ({ clientX, currentTarget }) => {
      if (!mousePosRef.current?.start) {
        return
      }
      const { left, right } = currentTarget.getBoundingClientRect()
      const percentage = (((clientX - left) * 100) / (right - left)).toFixed(1)
      if (clientX < left || clientX > right) return
      rightImgRef.current?.setAttribute(
        "style",
        `clip-path: polygon(0px 0px, ${percentage}% 0px, ${percentage}% 100%, 0px 100%);`,
      )
      sliderRef.current?.setAttribute("style", `left: ${percentage}%;`)
    },
    [],
  )
  const onMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    mousePosRef.current.start = true
  }, [])
  const onMouseUp: MouseEventHandler<HTMLDivElement> = useCallback(() => {
    mousePosRef.current.start = false
  }, [])
  const onTouchStart = useCallback(() => {
    mousePosRef.current.start = true
  }, [])
  const onTouchEnd = useCallback(() => {
    mousePosRef.current.start = false
  }, [])
  const onTouchMove: TouchEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      onMouseMove({
        clientX: e.touches[0].clientX,
        currentTarget: e.currentTarget,
      } as any)
    },
    [onMouseMove],
  )

  const showSlider = isNotNil(resultImageUrl)
  return (
    <div
      {...{ onMouseMove, onMouseDown, onMouseUp, onTouchStart, onTouchEnd, onTouchMove }}
      className="select-none relative"
    >
      {showSlider && (
        <Img
          ref={rightImgRef}
          src={inputImageUrl}
          className="absolute w-full object-cover"
          style={{ clipPath: "polygon(0px 0px, 50% 0px, 50% 100%, 0px 100%)" }}
          alt={t("User uploaded image")}
          crossOrigin="anonymous"
        />
      )}
      <Img
        ref={leftImgRef}
        src={resultImageUrl ?? inputImageUrl}
        className={cn("w-full h-full object-cover bg-white", {
          "transparent-image-background": true,
        })}
        alt={t("User uploaded image")}
        crossOrigin="anonymous"
      />
      {showSlider && (
        <div
          ref={sliderRef}
          className="cursor-pointer absolute flex flex-col justify-center items-center left-1/2 w-0.5 top-0 bottom-0 bg-gray-100/50"
        >
          <div className="group top-1/2 left-1/2 rounded-full bg-white flex justify-center items-center w-8 h-8 ">
            <ChevronLeftIcon className="w-4 h-4 stroke-3 stroke-gray-500 group-hover:stroke-gray-800" />
            <ChevronRightIcon className="w-4 h-4 stroke-3 stroke-gray-500 group-hover:stroke-gray-800" />
          </div>
        </div>
      )}
    </div>
  )
}
