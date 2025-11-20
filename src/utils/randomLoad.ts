const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

const randomDelta = (amplitude: number) => (Math.random() * amplitude - amplitude / 2)

export function nextCpuLoad(prev: number) {
  const inertia = prev * 0.7
  const noise = randomDelta(20)
  return clamp(inertia + noise)
}

export function nextRamLoad(prev: number) {
  const inertia = prev * 0.8
  const noise = randomDelta(12)
  return clamp(inertia + noise, 20, 96)
}

export function nextNetworkLoad(prev: number) {
  const inertia = prev * 0.65
  const noise = randomDelta(35)
  return clamp(inertia + noise, 5, 140)
}

export function randomDelay(min = 500, max = 1000) {
  return Math.floor(Math.random() * (max - min)) + min
}
