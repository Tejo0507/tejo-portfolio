import { useEffect, useRef } from "react"

interface ScatterPoint {
  x: number
  y: number
  cluster?: number
}

interface ScatterPlotProps {
  points: ScatterPoint[]
  centroids?: { x: number; y: number }[]
  height?: number
}

const palette = ["#F6F3F0", "#FFCE9E", "#E5B08D", "#C98C6D"]

export function ScatterPlot({ points, centroids = [], height = 220 }: ScatterPlotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, width, h)

    const xs = points.map((point) => point.x)
    const ys = points.map((point) => point.y)
    const minX = Math.min(...xs, 0)
    const maxX = Math.max(...xs, 1)
    const minY = Math.min(...ys, 0)
    const maxY = Math.max(...ys, 1)

    const scaleX = (value: number) => ((value - minX) / (maxX - minX || 1)) * (width - 40) + 20
    const scaleY = (value: number) => h - ((value - minY) / (maxY - minY || 1)) * (h - 40) - 20

    ctx.fillStyle = "rgba(94,75,67,0.2)"
    ctx.fillRect(0, 0, width, h)

    points.forEach((point) => {
      const color = palette[point.cluster ?? 0]
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(scaleX(point.x), scaleY(point.y), 5, 0, Math.PI * 2)
      ctx.fill()
    })

    centroids.forEach((centroid) => {
      ctx.strokeStyle = "#FFEECC"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.rect(scaleX(centroid.x) - 6, scaleY(centroid.y) - 6, 12, 12)
      ctx.stroke()
    })
  }, [points, centroids])

  return <canvas ref={canvasRef} width={420} height={height} className="w-full" aria-hidden="true" />
}
