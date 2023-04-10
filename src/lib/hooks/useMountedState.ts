import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { useMountedState as _useMountedState } from "react-use"

export const useMounted = _useMountedState

export function useMountedState<T>(
  initialState: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
    
  const [state, _setState] = useState<T>(initialState)
  const mounted = _useMountedState()

  const setState = useCallback(
    (newState: SetStateAction<T>) => {
      mounted() && _setState(newState)
    },
    [mounted],
  )

  return [state, setState]
}
