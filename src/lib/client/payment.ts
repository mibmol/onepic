import { fetchJson, fetchJsonRetry } from "@/lib/utils"

export async function createCreditOrder({ plan, planType }): Promise<string> {
  const order = await fetchJson("/api/payment/order", {
    method: "POST",
    body: JSON.stringify({ plan, planType }),
  })
  return order.id
}

export async function captureCreditOrder({ orderID }) {
  const { orderCaptureData } = await fetchJson("/api/payment/order-capture", {
    method: "POST",
    body: JSON.stringify({ orderID }),
  })
  return orderCaptureData
}

export async function saveUserPlan({
  orderId = null,
  planType,
  selectedPlan = null,
  subscriptionId = null,
}) {
  return fetchJsonRetry(`/api/plan/save`, {
    retries: 2,
    redirectToLogin: false,
    method: "POST",
    body: JSON.stringify({ orderId, selectedPlan, planType, subscriptionId }),
  })
}

export async function createSubscription({ plan }): Promise<string> {
  const subscription = await fetchJson("/api/payment/subscription", {
    method: "POST",
    body: JSON.stringify({ plan }),
  })
  return subscription.id
}

export function getUserPlanInfo(redirectToLogin = true) {
  return fetchJson("/api/plan/info", { redirectToLogin })
}

export function getSubscriptionNextChargeTime() {
  return fetchJson("/api/plan/next-charge")
}

export function cancelUserSubscription() {
  return fetchJson("/api/plan/cancel-subscription", { method: "PATCH", body: "{}" })
}

export function createStripeSessionUrl({ plan, planType }) {
  const params = new URLSearchParams({
    plan,
    planType,
  })
  return fetchJson("/api/payment/stripe/session?" + params.toString())
}
