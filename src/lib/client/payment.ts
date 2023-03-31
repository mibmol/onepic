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

export const saveUserPlan = ({
  orderId = null,
  planType,
  selectedPlan = null,
  subscriptionId = null,
}) =>
  fetchJsonRetry(`/api/plan/save`, {
    retries: 2,
    redirectToLogin: false,
    method: "POST",
    body: JSON.stringify({ orderId, selectedPlan, planType, subscriptionId }),
  })

export async function createSubscription({ plan }): Promise<string> {
  const subscription = await fetchJson("/api/payment/subscription", {
    method: "POST",
    body: JSON.stringify({ plan }),
  })
  return subscription.id
}
