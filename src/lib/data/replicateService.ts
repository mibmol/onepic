import { fetchJson, isProd } from "@/lib/utils"
import { Prediction } from "./entities"
import { getModelByName } from "./models"

const { REPLICATE_API_URL, REPLICATE_AUTH_TOKEN, WEBHOOK_RELAY_URL, ENV_URL } =
  process.env

export const generatePrediction = async ({
  modelName,
  input,
  ...options
}: Prediction) => {
  const { version, modelInputType } = getModelByName(modelName)
  console.log(`https://${ENV_URL}/api/result_replicate_webhook`)
  const response = await fetchJson(`${REPLICATE_API_URL}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      version,
      input: { ...options, [modelInputType.name]: input },
      webhook_completed: isProd()
        ? `https://${ENV_URL}/api/result_replicate_webhook`
        : WEBHOOK_RELAY_URL,
    }),
  })

  return response
}

export const cancelPrediction = async ({ predictionId }) =>
  fetchJson(`${REPLICATE_API_URL}/predictions/${predictionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_AUTH_TOKEN}`,
    },
  })
