import { always, cond, equals } from "ramda"
import { fetchJson } from "../utils"

const {
  NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_API_URL,
  PAYPAL_MONTHLY_PLAN_ID,
  PAYPAL_YEARLY_PLAN_ID,
} = process.env

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

const getSubscriptionPlanId = cond([
  [equals("month"), always(PAYPAL_MONTHLY_PLAN_ID)],
  [equals("year"), always(PAYPAL_YEARLY_PLAN_ID)],
])

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
