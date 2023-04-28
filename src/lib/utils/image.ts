import { getURLLastPathname } from "@/lib/utils/clientRouting"

export const imgToObjectUrl = (img: HTMLImageElement) =>
  fetch(img.src)
    .then((response) => response.blob())
    .then((blob) => new File([blob], getURLLastPathname(img.src), { type: blob.type }))

export const dowloadImage = async (url: string, name?: string) => {
  const image = await fetch(url)
  const imageBlog = await image.blob()
  const imageURL = URL.createObjectURL(imageBlog)

  const link = document.createElement("a")
  link.href = imageURL
  link.download = name ?? getURLLastPathname(url)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
