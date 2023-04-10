import _useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite"
import { FetcherResponse, StrictTupleKey } from "swr/_internal"

export function useSWRInfinite<Data, Error>(
  getKey: (index: number, previousPageData: Data) => StrictTupleKey,
  fetcher: (...args: any) => FetcherResponse<any>,
): SWRInfiniteResponse<Data, Error> {
  const { isLoading, size, data, ...rest } = _useSWRInfinite<Data, Error>(getKey, fetcher)

  return {
    isLoading: isLoading || (size > 0 && data && typeof data[size - 1] === "undefined"),
    size,
    data,
    ...rest,
  }
}
