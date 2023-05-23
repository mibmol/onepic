import { v2 as cloudinary } from "cloudinary"
import { AssetInfo } from "@/lib/data/entities"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadFromUrl(url: string): Promise<AssetInfo> {
  const { secure_url, asset_id, signature, width, height } =
    await cloudinary.uploader.upload(url, { resource_type: "image" })
  return {
    signature,
    width,
    height,
    assetId: asset_id,
    imageUrl: secure_url,
    originalResultUrl: url,
  }
}
