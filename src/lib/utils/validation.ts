import { complement, isNil } from "ramda"

export const isNumericString = (value: any): boolean => {
  const valueType = typeof value
  if (valueType === "number") return true
  if (valueType !== "string") return false

  return !Number.isNaN(value) && !Number.isNaN(parseFloat(value))
}

export const isNotNil: (value: any) => boolean = complement(isNil)
