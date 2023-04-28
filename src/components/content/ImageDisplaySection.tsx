import { FC, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks"
import { imageGenerationSlice } from "@/lib/state/imageProcessingSlice"
import { useRouter } from "next/router"
import { AppState } from "@/lib/state/store"
import { ImageDisplay } from "./ImageDisplay"
import { ImageSelector } from "./ImageSelector"
import { isNil } from "ramda"
import { getQueryParams } from "@/lib/utils"

const { clearImages, setInputImage } = imageGenerationSlice.actions

const inputImageSelector = (state: AppState) => state.imageProcessing.inputImageUrl

export const ImageDisplaySection: FC = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const inputImageUrl = useAppSelector(inputImageSelector)
  const hasSelectedImage = !isNil(inputImageUrl)

  useEffect(() => {
    dispatch(clearImages())
  }, [router.asPath, dispatch])

  useEffect(() => {
    const uploadedImageUrl = getQueryParams().get("inputImageUrl")
    if (uploadedImageUrl && isNil(inputImageUrl)) {
      dispatch(setInputImage(uploadedImageUrl))
    }
  }, [inputImageUrl, router, dispatch])

  return (
    <section className="md:w-3/5">
      {hasSelectedImage ? <ImageDisplay /> : <ImageSelector />}
    </section>
  )
}
