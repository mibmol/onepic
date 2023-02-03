import { useCallback, useEffect, useState } from "react"

export const useClearInterval = (delay: number, depsArray: any[] = []) => {
  const [intervalId, setIntervalId] = useState<number>(null)

  useEffect(() => {
    return () => intervalId && clearInterval(intervalId)
    // eslint-disable-next-line
  }, depsArray)

  const runInterval = (callback: Function) => {
    const intervalId = setInterval(callback, delay)
    setIntervalId(intervalId)
  }

  const stopInterval = useCallback(() => {
    intervalId && clearInterval(intervalId)
  }, [intervalId])

  return { runInterval, stopInterval }
}

// export const useSetInterval = (delay: number, depsArray: any[] = []) => {
//   const intervalArgs = useRef<Function>(null)

//   useEffect(() => {
//     if (intervalArgs.current) {
//       const interval = setInterval(() => {
//         intervalArgs.current?.()
//       }, delay)
//       return () => {
//         intervalArgs.current = null
//         clearInterval(interval)
//       }
//     }
//     // eslint-disable-next-line
//   }, [intervalArgs.current, ...depsArray])

//   const runInterval = (callback: Function) => {
//     intervalArgs.current = callback
//   }

//   const stopInterval = () => {
//     intervalArgs.current = null
//   }

//   return { runInterval, stopInterval }
// }
