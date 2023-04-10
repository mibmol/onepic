export const randomInt = (max: number = Number.MAX_SAFE_INTEGER) =>
  Math.floor(Math.random() * max)

export function toInt(stringNumber: string): number {
  const result = parseInt(stringNumber, 10)
  return Number.isNaN(result) ? null : result
}
