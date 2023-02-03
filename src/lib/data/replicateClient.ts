import { fetchJson } from "@/lib/utils"
import { Prediction } from "./entities"
import { getModelByName } from "./models"

const { REPLICATE_API_URL, REPLICATE_AUTH_TOKEN } = process.env

export const generatePrediction = async ({
  modelName,
  inputImageUrl,
  ...options
}: Prediction) => {
  const { version, modelInputType } = getModelByName(modelName)
  const response =  await fetchJson(`${REPLICATE_API_URL}/predictions`, {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      version,
      input: { ...options, [modelInputType.name]: inputImageUrl },
    }),
  })



  return response
}

export const getPrediction = async ({ predictionId }) =>
  fetchJson(`${REPLICATE_API_URL}/predictions/${predictionId}`, {
    method: "GET",
    headers: {
      Authorization: `Token ${REPLICATE_AUTH_TOKEN}`,
    },
  })

export const cancelPrediction = async ({ predictionId }) =>
  fetchJson(`${REPLICATE_API_URL}/predictions/${predictionId}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_AUTH_TOKEN}`,
    },
  })
