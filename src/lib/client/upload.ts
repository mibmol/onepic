import { createClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"
import { fetchJson } from "@/lib/utils"

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

export const uploadUserImage = async (file: File) => {
  const imagePath = `${uuidv4()}.${file.name}`
  const { data, error } = await supabase.storage
    .from("user-images")
    .upload(imagePath, file, { contentType: "File" })

  if (error) {
    throw error
  }
  return { imagePath, data }
}

export const getImageUrl = async (
  imagePath: string,
  options?: { width: number; height: number },
): Promise<string> => {
  const params = new URLSearchParams({
    imagePath,
  })
  const { signedUrl } = await fetchJson("/api/image/signed-url?" + params.toString())
  return signedUrl
}

export const uploadUserResultImage = async (file: any, predictionId: string) => {
  const { imagePath } = await uploadUserImage(file)
  const signedUrl = await getImageUrl(imagePath)
  await fetchJson("/api/image/update-result-image?", {
    method: "PUT",
    body: JSON.stringify({ signedUrl, predictionId }),
  })
}
