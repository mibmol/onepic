import { createClient } from "@supabase/supabase-js"
import { PlanType, ReplicatePrediction } from "@/lib/data/entities"
import { pickAndRename, removeNils, getSubscriptionPrice } from "@/lib/utils"
import { User } from "next-auth"
import { getModelByName } from "@/lib/data/models"
import { isNil } from "ramda"

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

const supabaseAuthSchema = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    db: { schema: "next_auth" },
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
  const { data, error } = await supabase.storage
    .from("user-images")
    .createSignedUrl(imagePath, defaultUrlDuration, {
      ...(options?.width && options?.height && { transform: options }),
    })
  if (error) {
    throw error
  }
  return data
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
  user?: User,
) {
  return supabase.from("prediction_result").insert({
    input,
    status,
    model_name: modelName,
    prediction_id: id,
    user_id: user?.id ?? null,
  })
}

export async function updatePrediction({
  id,
  status,
  metrics,
  output,
}: ReplicatePrediction) {
  const updateFields = removeNils({
    status,
    run_time: metrics?.predict_time,
    output: Array.isArray(output) ? output[0] : output,
  })
  return supabase.from("prediction_result").update(updateFields).eq("prediction_id", id)
}

export async function updateUserCredits({ predictionId }) {
  const { error, prediction } = await getPrediction(predictionId)
  if (error) throw error
  if (!prediction?.user) return

  const {
    user: { id, credits },
  } = prediction

  if (credits > 0) {
    const { credits } = getModelByName(prediction.model_name)
    await supabase.rpc("decrement_user_credits", { user_id: id, n: credits })
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
  if (planType === PlanType.credits && orderId) {
    const [{ error }, { error: error2 }] = await Promise.all([
      supabase.rpc("increment_user_credits", { user_id: userId, n: credits }),
      supabase.from("payments").insert({
        plan_type: planType,
        plan: selectedPlan,
        order_id: orderId,
        subscription_id: subscriptionId,
        user_id: userId,
        paid_amount: paidAmount,
      }),
    ])
    if (error) throw error
    if (error2) throw error2
    return
  }

  if (planType === PlanType.subscription && subscriptionId) {
    const { error } = await supabase.rpc("save_subscription", {
      user_id: userId,
      subscription_id: subscriptionId,
      plan: selectedPlan,
      plan_type: planType,
      paid_amount: paidAmount,
      credits,
    })
    if (error) throw error
    return
  }

  throw Error("Not allowed")
}

export async function getSubscription(id: string) {
  const {
    error,
    data: [subscription],
  } = await supabase.from("subscriptions").select().eq("subscription_id", id)

  return { error, subscription }
}

export async function saveSubscriptionPayment({ subscriptionId, paidAmount }) {
  const { error, subscription } = await getSubscription(subscriptionId)

  if (error) {
    throw error
  }
  const { plan, user_id } = subscription
  const { totalCredits } = getSubscriptionPrice(plan)
  const result = await supabase.rpc("save_subscription_payment", {
    subscription_id: subscriptionId,
    user_id,
    plan,
    plan_type: PlanType.subscription,
    credits: totalCredits,
    paid_amount: paidAmount,
  })
  if (result.error) throw error
}

export async function endSubscription({ subscriptionId }) {
  const { error } = await supabase
    .from("subscriptions")
    .update({ end_date: new Date() })
    .eq("subscription_id", subscriptionId)
  if (error) {
    throw error
  }
}

const renameSubscriptionFields = pickAndRename([
  "plan",
  { field: "start_date", renameTo: "startDate" },
  { field: "subscription_id", renameTo: "subscriptionId" },
])

export async function getUserActiveSubscription(userId: string): Promise<any> {
  const { error, data: subscriptions } = await supabase
    .from("subscriptions")
    .select()
    .eq("user_id", userId)

  if (error) throw error
  const subscription = subscriptions?.find(({ end_date }) => isNil(end_date))
  return subscription ? renameSubscriptionFields(subscription) : null
}

export async function getUserPlan({ userId }) {
  const [{ error, data: user }, subscription] = await Promise.all([
    supabase.from("users").select().eq("id", userId).single(),
    getUserActiveSubscription(userId),
  ])
  if (error) {
    throw error
  }

  const haveSubscription = !isNil(subscription)
  return {
    credits: user.credits,
    planType: haveSubscription ? PlanType.subscription : PlanType.credits,
    subscription: haveSubscription ? renameSubscriptionFields(subscription) : null,
  }
}

export async function getUserPredictions({ userId, lastId, limit }) {
  let query = supabase
    .from("prediction_result")
    .select()
    .eq("user_id", userId)
    .order("id", { ascending: false })
    .limit(limit)

  if (lastId && lastId !== 0) {
    query = query.lt("id", lastId)
  }

  const { error, data } = await query

  if (error) throw error

  return data
}

export async function updateUserName({ userId, newName }) {
  const [{ error }, { error: error2 }] = await Promise.all([
    supabase.from("users").update({ name: newName }).eq("id", userId),
    supabaseAuthSchema.from("users").update({ name: newName }).eq("id", userId),
  ])

  if (error) throw error
  if (error2) throw error2
}

export async function deleteUserAccount(userId: string) {
  const { error } = await supabaseAuthSchema.rpc("delete_account", { user_id: userId })
  if (error) throw error
}

export async function insertFeedback({ feedback, score, userId }) {
  const { error } = await supabase
    .from("feedback")
    .insert({ feedback, score, user_id: userId })
  if (error) throw error
}
