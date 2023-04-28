import { call, forEach } from "ramda"

export const noop = () => {}

export const callFunctionsInArray = forEach<Function>(call)
