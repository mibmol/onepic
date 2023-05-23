import { getUserPredictions } from "@/lib/client/dashboard"
import { complement, compose, descend, isEmpty, nth, path, prop, sort } from "ramda"
import { FC, Fragment, useEffect, useMemo } from "react"
import { Button, Img, Text } from "@/components/common"
import { useTranslation } from "next-i18next"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import {
  dowloadImage,
  elementReachedEnd,
  notification,
  sequentialIntegers,
} from "@/lib/utils"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useSWRInfinite, useThemeMode } from "@/lib/hooks"
import { ReplicateStatus } from "@/lib/data/entities"
import { LoadingSpinner } from "./LoadingSpinner"
import { getFeatureByModelName } from "@/lib/data/models"
import { useToggle } from "react-use"
import { Spinner } from "../common/icons"

const sortById = sort(descend(prop("id") as any) as any)
const last = nth(-1)

const getKey = (_, previousData) => {
  const predictions = previousData?.predictions
  if (!predictions) {
    return "0"
  }
  const lastPred = last(sortById(previousData.predictions)) as any
  return lastPred?.id.toString()
}

const fetcher = (lastId: string) =>
  getUserPredictions({
    lastId,
  })

const shouldLoadMore = compose(complement(isEmpty), path(["predictions"]), last)
const hasResultItems = compose(complement(isEmpty), path([0, "predictions"]))

export const UserPredictions: FC = () => {
  const { t } = useTranslation()
  const { data, isLoading, size, setSize, error } = useSWRInfinite(getKey, fetcher)

  useEffect(() => {
    error &&
      notification.info(
        t("An error occurred while loading the predictions. Please try again"),
      )
  }, [error, t])

  useEffect(() => {
    const onScrollEnd = () => {
      if (elementReachedEnd(document.scrollingElement)) {
        !isLoading && shouldLoadMore(data) && setSize(size + 1)
      }
    }
    document.addEventListener("scroll", onScrollEnd)
    return () => {
      document.removeEventListener("scroll", onScrollEnd)
    }
  }, [size, isLoading, setSize, data])

  return (
    <ul
      className={`
        w-full mt-12 grid gap-5 grid-cols-1
        sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7
      `}
    >
      {hasResultItems(data) ? (
        data?.map(({ predictions }, index) => (
          <Fragment key={index}>
            {predictions?.map((item) => (
              <PredictionItem key={item.id} {...item} />
            ))}
          </Fragment>
        ))
      ) : (
        <Text
          className="col-span-2"
          labelToken="Your processed images will appear here"
          size="xl"
          medium
          gray
        />
      )}
      {isLoading && <LoadingSkeleton />}
    </ul>
  )
}

const getFeatureModelInputUrl = ({ modelName, input }): string => {
  const { path } = getFeatureByModelName(modelName)
  return `/${path}?${new URLSearchParams({ inputImageUrl: input }).toString()}`
}

const PredictionItem = ({ input, output, modelName, status }) => {
  const { t } = useTranslation()
  const [downloading, setDownloading] = useToggle(false)

  const download = async () => {
    setDownloading(true)
    try {
      await dowloadImage(output)
    } catch (error) {
      console.error(error)
      notification.error(t("Ups!"))
    } finally {
      setDownloading(false)
    }
  }

  return (
    <li className="relative group h-32 md:h-60 2xl:h-56 rounded-md overflow-hidden">
      <Img
        src={output ?? input}
        alt={t("Result image")}
        className="object-cover w-full h-full bg-gray-100 z-20 transparent-image-background bg-white"
      />
      {status === ReplicateStatus.succeeded && (
        <button
          disabled={downloading}
          onClick={download}
          className="lg:hidden group-hover:flex p-2 absolute top-4 right-4 rounded-full bg-gray-900 active:bg-gray-700"
        >
          {downloading ? (
            <Spinner className="w-6 h-6 stroke-white" />
          ) : (
            <ArrowDownTrayIcon className="w-6 h-6 stroke-white" />
          )}
        </button>
      )}
      {(status === ReplicateStatus.processing || status === ReplicateStatus.starting) && (
        <div className="absolute z-30 inset-0 flex items-center justify-center bg-black/50">
          <LoadingSpinner labelToken="general.processing" spinnerClassName="w-20" />
        </div>
      )}
      {status === ReplicateStatus.failed && (
        <div className="absolute z-30 inset-0 flex flex-col items-center justify-center bg-black/50 dark:bg-black/75">
          <span className="font-semibold text-white">{t("Failed")}</span>
          <Button
            variant="secondary"
            href={getFeatureModelInputUrl({ modelName, input })}
            labelToken="Try again"
            className="py-1 mt-2"
          />
        </div>
      )}
    </li>
  )
}

const LoadingSkeleton: FC = () => {
  const themeMode = useThemeMode()
  const loadingCount = useMemo(() => sequentialIntegers(6), [])

  const [baseColor, highlightColor] =
    themeMode === "dark" ? ["#111827", "#1f2937"] : ["#f3f4f6", "#d1d5db"]
  return (
    <>
      {loadingCount.map((n) => (
        <Skeleton key={n} className="md:h-60" {...{ baseColor, highlightColor }} />
      ))}
    </>
  )
}
