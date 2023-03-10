import { getURLLastPathname } from "@/lib/utils/clientRouting"

export const imgToObjectUrl = (img: HTMLImageElement) =>
  fetch(img.src)
    .then((response) => response.blob())
    .then((blob) => new File([blob], getURLLastPathname(img.src), { type: blob.type }))
