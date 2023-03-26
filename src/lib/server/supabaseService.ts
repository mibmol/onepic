import { createClient } from "@supabase/supabase-js"
import { PlanType, ReplicatePrediction } from "@/lib/data/entities"
import { removeNilKeys } from "@/lib/utils/object"
import { Session } from "next-auth"
import { getModelByName } from "@/lib/data/models"

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

export const getUser = async (userId: string) => {
  const {
    error,
    data: [user],
  } = await supabaseService.from("users").select().eq("id", userId)

  return { error, user }
}

export const getPrediction = async (predictionId: string) => {
  const {
    error,
    data: [prediction],
  } = await supabaseService
    .from("prediction_result")
    .select()
    .eq("prediction_id", predictionId)

  return { error, prediction }
}

export const insertPrediction = (
  { input, modelName },
  { status, id }: ReplicatePrediction,
  session: Session,
) =>
  supabaseService.from("prediction_result").insert({
    input,
    status,
    model_name: modelName,
    prediction_id: id,
    user_id: session?.user?.id ?? null,
  })

export const updatePrediction = ({
  id,
  status,
  metrics,
  output,
}: ReplicatePrediction) => {
  const updateFields = removeNilKeys({
    status,
    run_time: metrics?.predict_time,
    output: Array.isArray(output) ? output[0] : output,
  })
  return supabaseService
    .from("prediction_result")
    .update(updateFields)
    .eq("prediction_id", id)
}

export const updateUserCredits = async ({ predictionId }) => {
  const { error, prediction } = await getPrediction(predictionId)
  if (error || !prediction?.user_id) return

  const { user } = await getUser(prediction.user_id)
  if (user?.plan_type === PlanType.credits && user?.credits > 0) {
    const { credits } = getModelByName(prediction.model_name)
    console.log({ credits })
    await supabaseService.rpc("decrement_user_credits", { user_id: user.id, n: credits })
  }
}
