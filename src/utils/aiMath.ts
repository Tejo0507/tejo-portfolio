export interface LinearPoint {
  x: number
  y: number
}

export interface TrainingState {
  slope: number
  intercept: number
  lossHistory: number[]
}

export const generateLinearData = (count = 20, slope = 3, intercept = 2): LinearPoint[] => {
  return Array.from({ length: count }).map((_, idx) => {
    const x = Number((idx * 0.5 + Math.random() * 0.5).toFixed(2))
    const noise = (Math.random() - 0.5) * 0.8
    const y = Number((slope * x + intercept + noise).toFixed(2))
    return { x, y }
  })
}

export const meanSquaredError = (points: LinearPoint[], slope: number, intercept: number): number => {
  const sum = points.reduce((acc, point) => {
    const pred = slope * point.x + intercept
    return acc + (pred - point.y) ** 2
  }, 0)
  return sum / points.length
}

export const gradientStep = (
  points: LinearPoint[],
  slope: number,
  intercept: number,
  learningRate: number
): { slope: number; intercept: number; loss: number } => {
  const slopeGrad =
    (2 / points.length) *
    points.reduce((sum, point) => sum + point.x * (slope * point.x + intercept - point.y), 0)
  const interceptGrad =
    (2 / points.length) * points.reduce((sum, point) => sum + (slope * point.x + intercept - point.y), 0)
  const nextSlope = slope - learningRate * slopeGrad
  const nextIntercept = intercept - learningRate * interceptGrad
  const loss = meanSquaredError(points, nextSlope, nextIntercept)
  return { slope: nextSlope, intercept: nextIntercept, loss }
}

export const softmax = (values: number[]): number[] => {
  const max = Math.max(...values)
  const exps = values.map((value) => Math.exp(value - max))
  const sum = exps.reduce((acc, value) => acc + value, 0)
  return exps.map((value) => Number((value / sum).toFixed(4)))
}

export const normalizeSeries = (series: number[]): number[] => {
  const min = Math.min(...series)
  const max = Math.max(...series)
  if (max === min) return series.map(() => 0)
  return series.map((value) => Number(((value - min) / (max - min)).toFixed(3)))
}
