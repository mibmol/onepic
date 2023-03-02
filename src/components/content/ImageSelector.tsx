import { FC, useCallback } from "react"
import { useDropArea } from "react-use"
import { cn } from "@/lib/utils/clsx"
import { DashSquare, AddImageIcon } from "@/components/common/icons"
import { FileInput } from "@/components/common"
import { useAppDispatch } from "@/lib/state/hooks"
import { uploadImage } from "@/lib/state/imageProcessingSlice"
import { useTranslation } from "react-i18next"
import { notification } from "@/lib/utils"

export const ImageSelector: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const onFileChange = useCallback(
    (file: File) =>
      dispatch(
        uploadImage({
          value: file,
          onError: (e) => notification.error(t("Couldn't upload the image")),
        }),
      ),
    [dispatch, t],
  )
  const [dropHandlers, { over }] = useDropArea({
    onFiles: (files = []) => onFileChange(files[0]),
  })
  return (
    <div className="bg-gray-100 h-168 rounded-md pt-16">
      <div className="relative">
        <div className="hidden md:block">
          <div className="w-full h-full transparent absolute z-10" {...dropHandlers} />
          <DashSquare className={cn("mx-auto")} {...(over && { stroke: "#4338ca" })} />
          <AddImageIcon className="absolute top-8 left-1/2 -translate-x-1/2" />
        </div>
        <p className="absolute bottom-16 left-1/2 -translate-x-1/2 font-bold text-lg">
          {t("Drop an image")}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <span className="font-bold mt-12">OR</span>
        <div>
          <FileInput
            {...{ onFileChange }}
            id="image-input"
            name="image-input"
            labelToken="general.chooseAPhoto"
            accept="image/png, image/jpeg, image/webp"
            className="bg-indigo-700 text-white px-6 py-4 mx-auto hover:bg-indigo-600 active:bg-indigo-900 mt-12"
          />
        </div>
      </div>
    </div>
  )
}
