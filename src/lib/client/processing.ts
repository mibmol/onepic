import { assoc } from "ramda"
import { fetchJson, isNumericString } from "@/lib/utils"

export const postProcessImage = async (values) => {
  // parse string as numeric fields
  const formatedValues = Object.keys(values).reduce((prev, key) => {
    const value = values[key]
    return assoc(key, isNumericString(value) ? parseFloat(value) : value, prev)
  }, {})

  const response = await fetchJson("/api/process-image", {
    method: "POST",
    redirectToLogin: false,
    body: JSON.stringify(formatedValues),
  })

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
