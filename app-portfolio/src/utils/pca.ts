export interface PCAResult {
  projected: { x: number; y: number }[]
  components: number[][]
}

const vectorNormalize = (vector: number[]): number[] => {
  const length = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0))
  if (length === 0) return vector
  return vector.map((value) => value / length)
}

const dot = (a: number[], b: number[]) => a.reduce((sum, value, idx) => sum + value * b[idx], 0)

const outerProduct = (vector: number[]): number[][] => {
  return vector.map((valueI) => vector.map((valueJ) => valueI * valueJ))
}

const subtractMatrix = (a: number[][], b: number[][]): number[][] => {
  return a.map((row, rowIdx) => row.map((value, colIdx) => value - b[rowIdx][colIdx]))
}

const powerIteration = (matrix: number[][], iterations = 32): { eigenvalue: number; eigenvector: number[] } => {
  let vector = vectorNormalize(Array.from({ length: matrix.length }).map(() => Math.random()))
  for (let iter = 0; iter < iterations; iter += 1) {
    const next = matrix.map((row) => dot(row, vector))
    vector = vectorNormalize(next)
  }
  const eigenvalue = dot(vector, matrix.map((row) => dot(row, vector)))
  return { eigenvalue, eigenvector: vector }
}

const getColumn = (rows: number[][], col: number) => rows.map((row) => row[col])

export const runPCA = (data: number[][]): PCAResult => {
  if (data.length === 0) return { projected: [], components: [] }
  const featureCount = data[0].length
  const means = Array.from({ length: featureCount }).map((_, idx) => {
    const column = getColumn(data, idx)
    return column.reduce((sum, value) => sum + value, 0) / data.length
  })
  const centered = data.map((row) => row.map((value, idx) => value - means[idx]))

  const covariance = Array.from({ length: featureCount }).map((_, rowIdx) => {
    return Array.from({ length: featureCount }).map((_, colIdx) => {
      const sum = centered.reduce((acc, row) => acc + row[rowIdx] * row[colIdx], 0)
      return sum / (data.length - 1)
    })
  })

  const components: number[][] = []
  let workingMatrix = covariance
  for (let comp = 0; comp < Math.min(2, featureCount); comp += 1) {
    const { eigenvalue, eigenvector } = powerIteration(workingMatrix)
    components.push(eigenvector)
    const deflated = outerProduct(eigenvector).map((row) => row.map((value) => value * eigenvalue))
    workingMatrix = subtractMatrix(workingMatrix, deflated)
  }

  const projected = centered.map((row) => ({
    x: dot(row, components[0] ?? row),
    y: components[1] ? dot(row, components[1]) : 0,
  }))

  return { projected, components }
}
