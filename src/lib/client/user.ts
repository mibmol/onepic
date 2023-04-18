import { fetchJson, fetchJsonRetry, removeNils } from "@/lib/utils"

export function updateUserName(newUserName: string) {
  return fetchJson("/api/user/name", {
    method: "PATCH",
    body: JSON.stringify({ newName: newUserName }),
  })
}

export function deleteUserAccount() {
  return fetchJson("/api/user/delete-account", {
    method: "DELETE",
  })
}

export function postFeedback({ feedback, score }) {
  return fetchJsonRetry("/api/user/feedback", {
    retries: 2,
    method: "POST",
    body: JSON.stringify(removeNils({ feedback, score })),
  })
}
