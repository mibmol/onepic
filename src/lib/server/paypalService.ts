import { fetchJson, getSubscriptionPlanId } from "@/lib/utils"
import { path } from "ramda"

const { NEXT_PUBLIC_PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL } = process.env

export async function generateAccessToken(): Promise<string> {
  const basicTokenBuffer = Buffer.from(
    NEXT_PUBLIC_PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET,
  )
  const { access_token } = await fetchJson(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${basicTokenBuffer.toString("base64")}`,
    },
  })
  return access_token
}

export async function createOrder({ value }) {
  const accessToken = await generateAccessToken()
  return fetchJson(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value,
          },
        },
      ],
    }),
  })
}

export async function capturePayment(orderId: string) {
  const accessToken = await generateAccessToken()
  return fetchJson(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export async function getOrder(orderId: string) {
  const accessToken = await generateAccessToken()
  return fetchJson(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export async function createSubscription(plan: string) {
  const accessToken = await generateAccessToken()

  return fetchJson(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      plan_id: getSubscriptionPlanId(plan),
    }),
  })
}

export async function getClientToken() {
  const accessToken = await generateAccessToken()
  const { client_token } = await fetchJson(
    `${PAYPAL_API_URL}/v1/identity/generate-token`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return client_token
}

export async function getSubscription(subscriptionId: string) {
  const accessToken = await generateAccessToken()
  return fetchJson(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export async function validateWebhook({
  authAlgo,
  certUrl,
  transmissionId,
  transmissionSig,
  transmissionTime,
  webhookEvent,
  webhookId,
}) {
  const accessToken = await generateAccessToken()
  const { verification_status } = await fetchJson(
    `${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_event: webhookEvent,
        webhook_id: webhookId,
      }),
    },
  )
  return verification_status === "SUCCESS"
}

const getChargeTime = path(["billing_info", "next_billing_time"])

export async function getSubscriptionNextChargeTime(subscriptionId: string) {
  const subscription = await getSubscription(subscriptionId)
  console.log("<---- subsus", subscription)
  return getChargeTime(subscription)
}

export async function cancelSubscription(subscriptionId) {
  const accessToken = await generateAccessToken()
  await fetchJson(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
