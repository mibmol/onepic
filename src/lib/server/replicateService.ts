import { fetchJson, isDev, isProd } from "@/lib/utils"
import { Prediction } from "@/lib/data/entities"
import { getModelByName } from "@/lib/data/models"

export const generatePrediction = async ({
  modelName,
  input,
  ...options
}: Prediction) => {
  const { version, modelInputType } = getModelByName(modelName)
  const response = await fetchJson(`${process.env.REPLICATE_API_URL}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      version,
      input: { ...options, [modelInputType.name]: input },
      webhook: isDev()
        ? process.env.WEBHOOK_RELAY_URL
        : `https://${process.env.ENV_URL}/api/webhook/replicate`,
      webhook_events_filter: ["start", "completed"],
    }),
  })

  return response
}

export const cancelPrediction = async ({ predictionId }) =>
  fetchJson(`${process.env.REPLICATE_API_URL}/predictions/${predictionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_AUTH_TOKEN}`,
    },
  })
