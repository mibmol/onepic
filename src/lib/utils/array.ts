import { curry, identity, times } from "ramda"
import { pickAndRename, SelectField } from "./object"

function _selectFields<T>(fields: SelectField[], array: T[]) {
  return array.map((obj) => pickAndRename(fields, obj))
}

export const selectFields = curry(_selectFields)

export const sequentialIntegers = times<number>(identity)
