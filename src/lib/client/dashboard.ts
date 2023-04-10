import { fetchJson } from "@/lib/utils"

export async function getUserPredictions({ lastId = "0" }) {
  const params = new URLSearchParams({
    lastId: lastId,
  })
  return fetchJson(`/api/predictions?` + params.toString())
}
