import Link from "next/link"
import { FC, MouseEventHandler, useCallback, useRef } from "react"
import { Img, Text } from "@/components/common"
import { useTranslation } from "next-i18next"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

type Feature = {
  titleToken: string
  descriptionToken: string
  isAnimation?: boolean
  isSlider?: boolean
  imgUrls?: { before: string; after: string }
  animationUrl?: string
  link: string
}

const features: Feature[] = [
  {
    titleToken: "Photo Restoration",
    descriptionToken:
      "Improve or restore images by deblurring, removing noise or scratches",
    isSlider: true,
    imgUrls: { before: "/images/old_before.jpg", after: "/images/old_after.jpg" },
    link: "/restore-photo-image",
  },
  {
    titleToken: "Image upscaler",
    descriptionToken:
      "Upscaling tool that create high-quality images from low-quality images",
    isSlider: true,
    imgUrls: {
      before: "/images/upscaler_before.jpg",
      after: "/images/upscaler_after.jpg",
    },
    link: "/quality-resolution-enhancer",
  },
  {
    titleToken: "Remove background",
    descriptionToken: "A deep learning approach to remove background",
    isSlider: true,
    imgUrls: { before: "/images/rembg_before.jpg", after: "/images/rembg_after.png" },
    link: "/remove-background",
  },
  {
    titleToken: "Colorize photo",
    descriptionToken: "Add colours to old photos or any black and white images",
    isSlider: true,
    imgUrls: {
      before: "/images/colorize_before.jpg",
      after: "/images/colorize_after.jpg",
    },
    link: "/colorize-image",
  },
]

export const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="mx-auto mt-40 mb-24 px-4 lg:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:max-w-6xl scroll-mt-48 md:scroll-mt-28"
    >
      {features.map((feature) => (
        <FeatureBox key={feature.titleToken} {...{ feature }} />
      ))}
    </section>
  )
}

type FeatureBoxProps = {
  feature: Feature
}
const FeatureBox: FC<FeatureBoxProps> = ({
  feature: {
    titleToken,
    descriptionToken,
    isAnimation,
    isSlider,
    imgUrls,
    animationUrl,
    link,
  },
}) => {
  return (
    <Link
      href={link}
      className="group relative h-96 border border-gray-300 bg-white p-6 rounded-xl dark:bg-gray-900 dark:border-none"
    >
      {isSlider && <ImageSlider {...{ imgUrls }} altTextToken={titleToken} />}
      <FakeButton labelToken={titleToken} />
      <article className="absolute top-64 pr-3">
        <Text as="h1" size="xl" labelToken={titleToken} className="mb-2" bold />
        <Text as="p" size="sm" labelToken={descriptionToken} medium />
      </article>
    </Link>
  )
}

const ImageSlider = ({ imgUrls: { before, after }, altTextToken }) => {
  const { t } = useTranslation()
  const imgRef = useRef<HTMLImageElement>(null)
  const sliderRef = useRef<HTMLInputElement>(null)

  const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    ({ clientX, currentTarget }) => {
      const { right, left } = currentTarget.getBoundingClientRect()
      const percentage = (((clientX - left) * 100) / (right - left)).toFixed(2)
      imgRef.current.setAttribute(
        "style",
        `clip-path: polygon(0px 0px, ${percentage}% 0px, ${percentage}% 100%, 0px 100%);`,
      )
      sliderRef.current.setAttribute("style", `left: ${percentage}%;`)
    },
    [],
  )

  const onMouseLeave = useCallback(() => {
    imgRef.current.setAttribute(
      "style",
      `clip-path: polygon(0px 0px, 50% 0px, 50% 100%, 0px 100%);`,
    )
    sliderRef.current.setAttribute("style", `left: 50%;`)
  }, [])

  return (
    <div
      {...{ onMouseMove, onMouseLeave }}
      className={`
          absolute h-60 w-full top-0 left-0 z-20 rounded-t-xl overflow-hidden
          duration-500 group-hover:h-full hover:rounded-b-xl
        `}
    >
      <Img
        ref={imgRef}
        src={before}
        alt={t(altTextToken)}
        className="absolute object-cover w-full h-full z-20"
        style={{ clipPath: "polygon(0px 0px, 50% 0px, 50% 100%, 0px 100%)" }}
      />
      <Img
        src={after}
        alt={t(altTextToken)}
        className="absolute object-cover w-full h-full bg-purple-300"
      />
      <div
        ref={sliderRef}
        className="z-30 absolute left-1/2 w-px h-full bg-gray-400/25"
      />
    </div>
  )
}

const FakeButton = ({ labelToken }) => {
  const { t } = useTranslation()

  return (
    <div className="absolute bottom-8 right-8 z-30 hidden duration-400 group-hover:flex">
      <div className="flex flex-row items-center rounded-lg bg-indigo-700 text-white px-5 py-3">
        <div className="font-semibold">{t(labelToken)}</div>
        <ArrowRightIcon className="w-4 h-4 ml-2 stroke-3" />
      </div>
    </div>
  )
}
