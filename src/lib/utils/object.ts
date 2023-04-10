import { curry, isNil, reject } from "ramda"

export const removeNilKeys = reject(isNil)

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
