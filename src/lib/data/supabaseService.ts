import { createClient } from "@supabase/supabase-js"
import { ReplicatePrediction } from "./entities"

// Use on SERVER only!
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    global: {
      fetch,
    },
  },
)

const defaultUrlDuration = 60 * 60 * 1 // 1 hour
export const getImageSignedUrl = (
  imagePath: string,
  options: { width: any; height: any },
) =>
  supabaseService.storage
    .from("user-images")
    .createSignedUrl(imagePath, defaultUrlDuration, {
      ...(options?.width && options?.height && { transform: options }),
    })

export const getPrediction = (predictionId: string) =>
  supabaseService.from("prediction_result").select().eq("prediction_id", predictionId)

export const insertPrediction = (
  { input, modelName },
  { status, id }: ReplicatePrediction,
) =>
  supabaseService.from("prediction_result").insert({
    input,
    status,
    model_name: modelName,
    prediction_id: id,
  })

export const updatePrediction = ({ id, status, metrics, output }: ReplicatePrediction) =>
  supabaseService
    .from("prediction_result")
    .update({
      status,
      run_time: metrics?.predict_time,
      output: Array.isArray(output) ? output[0] : output,
    })
    .eq("prediction_id", id)
