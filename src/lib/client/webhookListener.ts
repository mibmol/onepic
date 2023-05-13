import { assoc, compose, curry, nth, path, split, toLower } from "ramda"
import { fetchJson } from "@/lib/utils"

const getSender = compose(toLower, nth(0), split("/"), path(["User-Agent", 0]))
const headerGetter = curry((headers, headerName) => path([headerName, 0], headers))


export default function startWebhookListener() {
  console.log("<---- conect ---")
  const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBHOOK_RELAY_WS)
  ws.addEventListener("open", () => {
    console.log("<--- webhookListener: ws open")
    ws.send(
      JSON.stringify({
        action: "auth",
        key: process.env.NEXT_PUBLIC_WEBHOOK_RELAY_KEY,
        secret: process.env.NEXT_PUBLIC_WEBHOOK_RELAY_SECRET,
      }),
    )
  })

  ws.addEventListener("close", (e) => {
    console.log("<--- webhookListener: ws closed", e.reason)
  })

  ws.addEventListener("error", (e) => {
    console.log("<--- webhookListener: ws error", e)
  })

  ws.addEventListener("message", ({ data }) => {
    const { type, body, status, headers } = JSON.parse(data ?? "{}")

    // if we got authentication confirmation, send subscribe event to the server
    if (type === "status" && status === "authenticated") {
      console.log("<---- webhookListener: AUTH")
      ws.send(
        JSON.stringify({
          action: "subscribe",
          buckets: [process.env.NEXT_PUBLIC_WEBHOOK_RELAY_BUCKET],
        }),
      )
    }

    if (type === "webhook" && headers && body) {
      const sender = getSender(headers)
      console.log({ type, sender, headers, body: JSON.parse(body ?? "{}") })
      const getHeader = headerGetter(headers)
      switch (sender) {
        case "paypal":
          fetchJson("/api/webhook/paypal", {
            method: "POST",
            headers: [
              "Paypal-Auth-Algo",
              "Paypal-Cert-Url",
              "Paypal-Transmission-Id",
              "Paypal-Transmission-Sig",
              "Paypal-Transmission-Time",
            ].reduce(
              (_headers, headerName) =>
                assoc(headerName, getHeader(headerName), _headers),
              {},
            ),
            body,
          }).catch(console.error)
          break
        case "replicate-webhook":
          fetchJson("/api/webhook/replicate", {
            method: "POST",
            body,
          }).catch(console.error)
          break
        case "stripe":
          fetchJson("/api/webhook/stripe", {
            method: "POST",
            headers: { "Stripe-Signature": getHeader("Stripe-Signature") },
            body,
          }).catch(console.error)
        default:
          break
      }
    }
  })

  return () => ws.close()
}
