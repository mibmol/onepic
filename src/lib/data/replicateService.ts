import { fetchJson, isProd } from "@/lib/utils"
import { Prediction } from "./entities"
import { getModelByName } from "./models"

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
      webhook_completed: isProd()
        ? `https://${process.env.ENV_URL}/api/result_replicate_webhook`
        : process.env.WEBHOOK_RELAY_URL,
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
