// npm i @tensorflow/tfjs
import { useEffect, useMemo, useRef, useState } from "react"
import { Camera, ImageUp } from "lucide-react"
import { ToolContainer } from "@/components/AiLab/ToolContainer"
import { HowItWorks } from "@/components/AiLab/HowItWorks"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const LABELS = ["Bright outdoors", "Leafy greens", "Cozy shadows"]

export default function ImageClassifierTool() {
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState("Load an image to begin")
  const [result, setResult] = useState<{ label: string; confidence: number } | null>(null)
  const tfRef = useRef<typeof import("@tensorflow/tfjs") | null>(null)
  const modelRef = useRef<import("@tensorflow/tfjs").LayersModel | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const tf = await import("@tensorflow/tfjs")
      tfRef.current = tf
      const model = tf.sequential()
      model.add(tf.layers.dense({ inputShape: [3], units: 4, activation: "relu" }))
      model.add(tf.layers.dense({ units: LABELS.length, activation: "softmax" }))
      const dense1Kernel = tf.tensor2d(
        [
          0.9, 0.1, 0.2, -0.4,
          0.2, 0.8, 0.1, -0.3,
          -0.3, 0.2, 0.9, 0.4,
        ],
        [3, 4]
      )
      const dense1Bias = tf.tensor1d([0.1, -0.1, 0.2, 0])
      const dense2Kernel = tf.tensor2d(
        [
          1.2, -0.6, 0.1,
          -0.4, 0.9, 0.2,
          0.1, 0.3, 1.0,
          -0.2, 0.5, 0.3,
        ],
        [4, LABELS.length]
      )
      const dense2Bias = tf.tensor1d([0, 0.1, 0.05])
      model.setWeights([dense1Kernel, dense1Bias, dense2Kernel, dense2Bias])
      if (mounted) {
        modelRef.current = model
        setStatus("Model ready. Upload an image")
      } else {
        model.dispose()
      }
    }
    load()
    return () => {
      mounted = false
      modelRef.current?.dispose()
    }
  }, [])

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setStatus("Load an image to begin")
    setResult(null)
  }

  const handleFile = (file?: File | null) => {
    if (!file) return
    if (preview) URL.revokeObjectURL(preview)
    const nextUrl = URL.createObjectURL(file)
    setPreview(nextUrl)
    classify(nextUrl)
  }

  const classify = async (url: string) => {
    if (!modelRef.current || !tfRef.current) return
    setStatus("Analyzing pixels...")
    const features = await extractFeatures(url)
    const tf = tfRef.current
    const tensor = tf.tensor2d([[features.avgR, features.avgG, features.avgB]])
  const prediction = modelRef.current.predict(tensor) as import("@tensorflow/tfjs").Tensor
  const raw = (await prediction.data()) as Float32Array
  const data = Array.from(raw)
    tensor.dispose()
    prediction.dispose()
    const max = Math.max(...data)
    const labelIndex = data.findIndex((score) => score === max)
    setResult({ label: LABELS[labelIndex], confidence: Number((max * 100).toFixed(1)) })
    setStatus("Prediction complete")
  }

  const steps = useMemo(
    () => [
      "Upload any JPG or PNG. The tool downsamples it to a compact 32×32 grid.",
      "We compute average RGB channels and feed them through a two-layer TFJS model with handcrafted weights.",
      "The softmax output maps to three friendly labels so you can see how a classifier works without a server.",
    ],
    []
  )

  return (
    <ToolContainer toolId="image-classification" title="Image Classification" description="Tiny TensorFlow.js model that maps colors to playful labels." onReset={reset}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Upload</CardTitle>
            <CardDescription>Select an image to classify</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label
              htmlFor="image-classifier-input"
              className="flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#5E4B43]/50 p-6 text-sm text-[#d8cdc6]/80"
            >
              <ImageUp className="mr-2 h-5 w-5" />
              Drop an image or browse
            </label>
            <Input id="image-classifier-input" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
            <p className="text-xs text-[#d8cdc6]/70">{status}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#2E1F1B]/60">
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Live prediction</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="h-48 w-full rounded-2xl border border-[#5E4B43]/50 bg-[#1f1412]/60 p-2">
              {preview ? (
                <img src={preview} alt="Uploaded" className="h-full w-full rounded-2xl object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#d8cdc6]/70">
                  <Camera className="mr-2 h-5 w-5" /> No image yet
                </div>
              )}
            </div>
            {result ? (
              <div className="w-full rounded-2xl bg-[#5E4B43]/20 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-[#d8cdc6]/70">Prediction</p>
                <p className="text-2xl font-semibold text-[#F6F3F0]">{result.label}</p>
                <p className="text-sm text-[#f0e5db]/80">Confidence {result.confidence}%</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <HowItWorks steps={steps} />
    </ToolContainer>
  )
}

function extractFeatures(url: string): Promise<{ avgR: number; avgG: number; avgB: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = url
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 32
      canvas.height = 32
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, 32, 32)
      const pixels = ctx.getImageData(0, 0, 32, 32).data
      let r = 0
      let g = 0
      let b = 0
      const total = pixels.length / 4
      for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i]
        g += pixels[i + 1]
        b += pixels[i + 2]
      }
      resolve({ avgR: r / total / 255, avgG: g / total / 255, avgB: b / total / 255 })
    }
  })
}
