export type ReplicatePrediction = {
  id: string
  status?: string
  output?: string[]
  metrics?: {
    predict_time?: number
  }

  error?: any
}
