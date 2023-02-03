import { FC, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks"
import { imageGenerationSlice } from "@/lib/state/imageProcessingSlice"
import { useRouter } from "next/router"
import { AppState } from "@/lib/state/store"
import { ImageInputDisplay } from "./ImageInputDisplay"
import { ImageSelector } from "./ImageSelector"

const { clearImages } = imageGenerationSlice.actions

const hasSelectedImageSelector = (state: AppState) =>
  !!state.imageProcessing.displayImageUrl

export const ImageDisplaySection: FC = () => {
  const dispatch = useAppDispatch()
  const hasSelectedImage = useAppSelector(hasSelectedImageSelector)
  const router = useRouter()
  
  useEffect(() => {
    dispatch(clearImages())
  }, [router.asPath, dispatch])

  return (
    <section className="md:w-3/5">
      {hasSelectedImage ? <ImageInputDisplay /> : <ImageSelector />}
    </section>
  )
}
