export type Matrix = number[][]

export const createMatrix = (rows: number, cols: number, fill = 0): Matrix => {
  return Array.from({ length: rows }).map(() => Array.from({ length: cols }).map(() => fill))
}

export const addMatrices = (a: Matrix, b: Matrix): Matrix => {
  return a.map((row, rowIdx) => row.map((value, colIdx) => value + (b[rowIdx]?.[colIdx] ?? 0)))
}

export const multiplyMatrices = (a: Matrix, b: Matrix): Matrix => {
  const rows = a.length
  const cols = b[0]?.length ?? 0
  const common = b.length
  const result = createMatrix(rows, cols)
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      let sum = 0
      for (let k = 0; k < common; k += 1) {
        sum += (a[r]?.[k] ?? 0) * (b[k]?.[c] ?? 0)
      }
      result[r][c] = Number(sum.toFixed(2))
    }
  }
  return result
}

export const transposeMatrix = (matrix: Matrix): Matrix => {
  const rows = matrix.length
  const cols = matrix[0]?.length ?? 0
  return Array.from({ length: cols }).map((_, colIdx) =>
    Array.from({ length: rows }).map((_, rowIdx) => matrix[rowIdx]?.[colIdx] ?? 0)
  )
}

export const determinant = (matrix: Matrix): number => {
  if (matrix.length === 2 && matrix[0]?.length === 2) {
    return Number((matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(2))
  }
  if (matrix.length === 3 && matrix[0]?.length === 3) {
    const [a, b, c] = matrix[0]
    const [d, e, f] = matrix[1]
    const [g, h, i] = matrix[2]
    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
    return Number(det.toFixed(2))
  }
  return 0
}
