export type ScalingMethod = "min-max" | "standard"

export interface ScalingResult {
  field: string
  raw: number
  scaled: number
}

export const detectNumericFields = (rows: Record<string, unknown>[]) => {
  if (!rows.length) return [] as string[]
  return Object.keys(rows[0]).filter((field) => typeof rows[0][field] === "number")
}

export const minMaxScale = (values: number[]) => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  if (max === min) return values.map(() => 0)
  return values.map((value) => Number(((value - min) / (max - min)).toFixed(3)))
}

export const standardize = (values: number[]) => {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length
  const std = Math.sqrt(variance)
  if (std === 0) return values.map(() => 0)
  return values.map((value) => Number(((value - mean) / std).toFixed(3)))
}

export const applyScaling = (
  rows: Record<string, unknown>[],
  method: ScalingMethod
): { scaledRows: Record<string, number>[]; diagnostics: ScalingResult[] } => {
  const numericFields = detectNumericFields(rows)
  const diagnostics: ScalingResult[] = []
  const scaledRows = rows.map((row) => ({ ...row }))

  numericFields.forEach((field) => {
    const values = rows.map((row) => Number(row[field]))
    const scaledValues = method === "min-max" ? minMaxScale(values) : standardize(values)
    scaledValues.forEach((value, idx) => {
      scaledRows[idx][`${field}_scaled`] = value
      diagnostics.push({ field, raw: values[idx], scaled: value })
    })
  })

  return { scaledRows: scaledRows as Record<string, number>[], diagnostics }
}
