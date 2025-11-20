import { useEffect, useRef } from "react"

interface LineChartProps {
  data: number[]
  color?: string
  height?: number
}

export function LineChart({ data, color = "#F6F3F0", height = 160 }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const width = canvas.width
    const chartHeight = canvas.height
    ctx.clearRect(0, 0, width, chartHeight)

    ctx.strokeStyle = "rgba(94,75,67,0.4)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, chartHeight - 20)
    ctx.lineTo(width, chartHeight - 20)
    ctx.stroke()

    if (!data.length) return
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const step = width / Math.max(data.length - 1, 1)

    ctx.strokeStyle = color
    ctx.lineWidth = 2.5
    ctx.beginPath()
    data.forEach((value, idx) => {
      const x = idx * step
      const y = chartHeight - ((value - min) / range) * (chartHeight - 30) - 10
      if (idx === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  }, [data, color])

  return <canvas ref={canvasRef} width={360} height={height} className="w-full" aria-hidden="true" />
}
