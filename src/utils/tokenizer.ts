export interface TokenStats {
  tokens: string[]
  uniqueCount: number
  frequency: Record<string, number>
}

const sanitize = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s]/gi, " ")

export const tokenize = (text: string): TokenStats => {
  const cleaned = sanitize(text)
  const tokens = cleaned.split(/\s+/).filter(Boolean)
  const frequency: Record<string, number> = {}
  tokens.forEach((token) => {
    frequency[token] = (frequency[token] ?? 0) + 1
  })
  return { tokens, uniqueCount: Object.keys(frequency).length, frequency }
}

export const splitIntoBigrams = (tokens: string[]): string[] => {
  const pairs: string[] = []
  for (let idx = 0; idx < tokens.length - 1; idx += 1) {
    pairs.push(`${tokens[idx]}_${tokens[idx + 1]}`)
  }
  return pairs
}
