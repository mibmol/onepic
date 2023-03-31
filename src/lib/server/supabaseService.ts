import { createClient } from "@supabase/supabase-js"
import { PlanType, ReplicatePrediction } from "@/lib/data/entities"
import { removeNilKeys } from "@/lib/utils/object"
import { Session } from "next-auth"
import { getModelByName } from "@/lib/data/models"

// Use on SERVER only!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    global: {
      fetch,
    },
  },
)

const defaultUrlDuration = 60 * 60 * 24 * 30 * 1 // 1 Month

export async function getImageSignedUrl(
  imagePath: string,
  options: { width: any; height: any },
) {
  return supabase.storage
    .from("user-images")
    .createSignedUrl(imagePath, defaultUrlDuration, {
      ...(options?.width && options?.height && { transform: options }),
    })
}

export async function getUser(userId: string) {
  const {
    error,
    data: [user],
  } = await supabase.from("users").select().eq("id", userId)

  return { error, user }
}

export async function getPrediction(predictionId: string) {
  const {
    error,
    data: [prediction],
  } = await supabase
    .from("prediction_result")
    .select(`*, user:user_id ( * )`)
    .eq("prediction_id", predictionId)

  return { error, prediction }
}

export async function insertPrediction(
  { input, modelName },
  { status, id }: ReplicatePrediction,
  session: Session,
) {
  return supabase.from("prediction_result").insert({
    input,
    status,
    model_name: modelName,
    prediction_id: id,
    user_id: session?.user?.id ?? null,
  })
}

export async function updatePrediction({
  id,
  status,
  metrics,
  output,
}: ReplicatePrediction) {
  const updateFields = removeNilKeys({
    status,
    run_time: metrics?.predict_time,
    output: Array.isArray(output) ? output[0] : output,
  })
  return supabase.from("prediction_result").update(updateFields).eq("prediction_id", id)
}

export async function updateUserCredits({ predictionId }) {
  const { error, prediction } = await getPrediction(predictionId)
  if (error || !prediction?.user) return

  const { user } = prediction
  if (user?.plan_type === PlanType.credits && user?.credits > 0) {
    const { credits } = getModelByName(prediction.model_name)
    await supabase.rpc("decrement_user_credits", { user_id: user.id, n: credits })
  }
}

export async function saveOrder({
  orderId = null,
  selectedPlan,
  planType,
  subscriptionId = null,
  userId,
  credits,
  paidAmount,
}) {
  return Promise.all([
    supabase.rpc("increment_user_credits", { user_id: userId, n: credits }),
    supabase.from("payments").insert({
      plan_type: planType,
      plan: selectedPlan,
      order_id: orderId,
      subscription_id: subscriptionId,
      user_id: userId,
      paid_amount: paidAmount
    }),
  ])
}
