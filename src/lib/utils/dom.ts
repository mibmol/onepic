export function elementReachedEnd(scrollingElement: Element): boolean {
  const { scrollHeight, scrollTop, clientHeight } = scrollingElement
  return clientHeight + scrollTop >= scrollHeight
}
