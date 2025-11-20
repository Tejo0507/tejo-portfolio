export interface KMeansPoint {
  x: number
  y: number
  cluster?: number
}

export interface KMeansResult {
  centroids: { x: number; y: number }[]
  points: KMeansPoint[]
}

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

const randomCentroids = (points: KMeansPoint[], k: number) => {
  const shuffled = [...points].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, k).map((point) => ({ x: point.x, y: point.y }))
}

export const runKMeans = (points: KMeansPoint[], k = 3, iterations = 6): KMeansResult => {
  if (points.length === 0) {
    return { centroids: [], points }
  }
  let centroids = randomCentroids(points, k)

  for (let iter = 0; iter < iterations; iter += 1) {
    // Assign step
    points = points.map((point) => {
      const nearest = centroids.reduce(
        (acc, centroid, idx) => {
          const d = distance(point, centroid)
          return d < acc.distance ? { distance: d, index: idx } : acc
        },
        { distance: Number.POSITIVE_INFINITY, index: 0 }
      )
      return { ...point, cluster: nearest.index }
    })

    // Update centroids
    centroids = centroids.map((centroid, idx) => {
      const clusterPoints = points.filter((point) => point.cluster === idx)
      if (clusterPoints.length === 0) return centroid
      const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length
      const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length
      return { x: Number(avgX.toFixed(2)), y: Number(avgY.toFixed(2)) }
    })
  }

  return { centroids, points }
}

export const generateClusterPoints = (clusterCount = 3, pointsPerCluster = 20): KMeansPoint[] => {
  const clusters: KMeansPoint[] = []
  for (let idx = 0; idx < clusterCount; idx += 1) {
    const baseX = Math.random() * 6 + idx * 2
    const baseY = Math.random() * 6 + idx
    for (let j = 0; j < pointsPerCluster; j += 1) {
      clusters.push({
        x: Number((baseX + Math.random() * 1.5).toFixed(2)),
        y: Number((baseY + Math.random() * 1.5).toFixed(2)),
      })
    }
  }
  return clusters
}
