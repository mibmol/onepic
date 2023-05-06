import { useEffect, useState } from "react"

export function useAfterRenderState<T>(initialState: T | (() => T), deps = []) {
  const [state, setState] = useState<T>()
  useEffect(() => {
    setState(initialState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setState, ...deps])

  return state
}
