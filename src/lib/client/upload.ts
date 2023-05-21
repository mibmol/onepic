import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import { fetchJson } from "@/lib/utils"
import { compose, nth, split } from "ramda"

// Safe to use in client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_CLIENT_API_KEY,
  {
    global: {
      fetch,
    },
  },
)

const getFileExtension = compose(nth(-1), split("."))

export async function uploadUserImage(file: File) {
  const imagePath = `${uuidv4()}.${getFileExtension(file.name)}`
  const { data, error } = await supabase.storage
    .from("user-images")
    .upload(imagePath, file, { contentType: file.type ?? "File" })

  if (error) {
    throw error
  }
  return { imagePath, data }
}

export async function getImageUrl(
  imagePath: string,
  options?: { width: number; height: number },
): Promise<string> {
  const params = new URLSearchParams({
    imagePath,
  })
  const { signedUrl } = await fetchJson("/api/image/signed-url?" + params.toString())
  return signedUrl
}

export async function uploadUserResultImage(
  file: any,
  predictionId: string,
  modelName: string,
) {
  const { imagePath } = await uploadUserImage(file)
  const signedUrl = await getImageUrl(imagePath)
  await fetchJson("/api/image/update-result-image?", {
    method: "PUT",
    body: JSON.stringify({ signedUrl, predictionId, modelName }),
  })
}

export async function uploadImagex(file: File) {
  const form = new FormData()
  form.append("file", file)
  // form.append("api_key", process.env.CLOUDINARY_API_KEY)
  form.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
  // form.append("public_id", "998bf7716e807ec3b95a8aa71203f0")
  
  const response = await fetchJson(
    `${process.env.NEXT_PUBLIC_CLOUDINARY_API_URL}/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: form,
    },
  )
  console.log(response)
  return response
}
