import { fetchJson, fetchJsonRetry } from "@/lib/utils"

export const createCreditOrder = async ({ plan, planType }) => {
  const order = await fetchJson("/api/payment/order", {
    method: "POST",
    body: JSON.stringify({ plan, planType }),
  })
  return order.id
}

export const captureCreditOrder = async ({ orderID }) => {
  const { orderCaptureData } = await fetchJson("/api/payment/order-capture", {
    method: "POST",
    body: JSON.stringify({ orderID }),
  })
  return orderCaptureData
}

export const saveUserPlan = ({
  orderId,
  planType,
  selectedPlan,
  subscriptionId = null,
}) =>
  fetchJsonRetry(`/api/plan/save`, {
    retries: 3,
    redirectToLogin: false,
    method: "POST",
    body: JSON.stringify({ orderId, selectedPlan, planType, subscriptionId }),
  })

export const createSubscription = async ({ plan }) => {
  const subscription = await fetchJson("/api/payment/subscription", {
    method: "POST",
    body: JSON.stringify({ plan }),
  })
  return subscription.id
}
