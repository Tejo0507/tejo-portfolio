export function reorderList<T>(items: T[], startIndex: number, endIndex: number): T[] {
  const list = [...items]
  const [removed] = list.splice(startIndex, 1)
  list.splice(endIndex, 0, removed)
  return list
}
