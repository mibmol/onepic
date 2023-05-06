import { assoc } from "ramda"
import { fetchJson, isNumericString } from "@/lib/utils"
import { isFreeModel } from "../data/models"

export const postProcessImage = async (values) => {
  // parse string as numeric fields
  const formatedValues = Object.keys(values).reduce((prev, key) => {
    const value = values[key]
    return assoc(key, isNumericString(value) ? parseFloat(value) : value, prev)
  }, {})

  const response = await fetchJson(
    isFreeModel(values.modelName)
      ? "/api/features/image-to-image-free"
      : "/api/features/image-to-image",
    {
      method: "POST",
      redirectToLogin: false,
      body: JSON.stringify(formatedValues),
    },
  )

  return response
}

export const getProcessImageState = (predictionId: string) => {
  const params = new URLSearchParams({
    predictionId,
  })
  return fetchJson(`/api/result?` + params.toString(), {
    method: "GET",
  })
}
