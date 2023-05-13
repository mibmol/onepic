import { curry, isNil, reject } from "ramda"

export const removeNils = reject(isNil)

export type SelectField = { field: string; renameTo?: string } | string

export const pickAndRename = curry((fields: SelectField[], obj: any) => {
  const newObj = {}
  for (const field of fields) {
    if (typeof field === "string") {
      newObj[field] = obj[field]
    } else {
      newObj[field.renameTo ?? field.field] = obj[field.field]
    }
  }
  return newObj
})

export function objToBase64(obj: any) {
  return Buffer.from(JSON.stringify(obj)).toString("base64")
}

export function base64ToObj(b64String: string) {
  return JSON.parse(Buffer.from(b64String).toString("utf-8"))
}
