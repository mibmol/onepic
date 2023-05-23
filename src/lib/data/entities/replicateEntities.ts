export type ReplicatePrediction = {
  id: string
  status?: string
  output?: string[]
  metrics?: {
    predict_time?: number
  }

  error?: any
}

export type AssetInfo = {
  signature: string
  width: number
  height: number
  assetId: string
  imageUrl: string
  originalResultUrl: string
}
