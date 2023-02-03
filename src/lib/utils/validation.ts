export const isNumericString = (value: any): boolean => {
  const valueType = typeof value
  if (valueType === "number") return true
  if (valueType !== "string") return false

  return !isNaN(value as number) && !isNaN(parseFloat(value as string))
}
