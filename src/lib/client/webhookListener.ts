import { fetchJson } from "../utils"

export const startWebhookListener = async () => {
  const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBHOOK_RELAY_WS)
  ws.addEventListener("open", () => {
    ws.send(
      JSON.stringify({
        action: "auth",
        key: process.env.NEXT_PUBLIC_WEBHOOK_RELAY_KEY,
        secret: process.env.NEXT_PUBLIC_WEBHOOK_RELAY_SECRET,
      }),
    )
  })

  ws.addEventListener("close", (e) => {
    console.log("<--- ws closed", e)
  })

  ws.addEventListener("error", (e) => {
    console.log("<--- ws error", e)
  })

  ws.addEventListener("message", ({ data }) => {
    const { type, body, status } = JSON.parse(data)
    // if we got authentication confirmation, send subscribe event to the server
    if (type === "status" && status === "authenticated") {
      ws.send(
        JSON.stringify({
          action: "subscribe",
          buckets: [process.env.NEXT_PUBLIC_WEBHOOK_RELAY_BUCKET],
        }),
      )
    }

    if (type === "webhook" && data) {
      fetchJson("/api/result_replicate_webhook", {
        method: "POST",
        body,
      })
        .then(console.log)
        .catch(console.error)
    }
  })
}
