import { isNil, reject } from "ramda"

export const removeNilKeys = reject(isNil)
