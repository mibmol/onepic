import { fetchRaw } from "@/lib/utils"

export async function uploadImageToCloud(file: File) {
  const form = new FormData()
  form.append("file", file)
  form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

  const response = await fetchRaw(
    `${process.env.NEXT_PUBLIC_CLOUDINARY_API_URL}/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: form,
      credentials: "omit",
    },
  )

  return response.secure_url
}
