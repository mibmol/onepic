import { fetchJson } from "@/lib/utils"

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
