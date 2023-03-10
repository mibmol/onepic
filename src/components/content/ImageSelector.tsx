import { FC, useCallback } from "react"
import { useDropArea } from "react-use"
import { cn } from "@/lib/utils/clsx"
import { DashSquare, AddImageIcon } from "@/components/common/icons"
import { FileInput, Text } from "@/components/common"
import { useAppDispatch } from "@/lib/state/hooks"
import { uploadImage } from "@/lib/state/imageProcessingSlice"
import { useTranslation } from "next-i18next"
import { notification } from "@/lib/utils"
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline"

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
    <div className="bg-gray-100 h-168 rounded-md pt-16 dark:bg-gray-900/50">
      <div className="relative">
        <div className="hidden md:block">
          <div className="w-full h-full transparent absolute z-10" {...dropHandlers} />
          <DashSquare {...{ over }} className={cn("mx-auto")} />
          <AddImageIcon className="absolute top-8 left-1/2 -translate-x-1/2" />
        </div>
        <Text
          as="p"
          size="lg"
          labelToken="Drop an image"
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
          bold
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <Text labelToken="OR" className="mt-12" bold />
        <div>
          <FileInput
            {...{ onFileChange }}
            id="image-input"
            name="image-input"
            labelToken="general.chooseAPhoto"
            accept="image/png, image/jpeg, image/webp"
            className="mt-12"
            Icon={ArrowUpOnSquareIcon}
          />
        </div>
      </div>
    </div>
  )
}
