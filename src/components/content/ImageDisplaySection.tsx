import { FC, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks"
import { imageGenerationSlice } from "@/lib/state/imageProcessingSlice"
import { useRouter } from "next/router"
import { AppState } from "@/lib/state/store"
import { ImageDisplay } from "./ImageDisplay"
import { ImageSelector } from "./ImageSelector"
import { isNil } from "ramda"

const { clearImages } = imageGenerationSlice.actions

const hasSelectedImageSelector = (state: AppState) =>
  !isNil(state.imageProcessing.inputImageUrl)

export const ImageDisplaySection: FC = () => {
  const dispatch = useAppDispatch()
  const hasSelectedImage = useAppSelector(hasSelectedImageSelector)
  const router = useRouter()

  useEffect(() => {
    dispatch(clearImages())
  }, [router.asPath, dispatch])

  return (
    <section className="md:w-3/5">
      {hasSelectedImage ? <ImageDisplay /> : <ImageSelector />}
    </section>
  )
}
