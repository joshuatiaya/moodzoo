"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(3)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const context = canvas.getContext("2d")
    if (context) {
      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, canvas.width, canvas.height)
      setCtx(context)
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.strokeStyle = color
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (ctx) {
      ctx.closePath()
    }
  }

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const downloadDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.href = canvas.toDataURL("image/png")
    link.download = `moodzoo-drawing-${Date.now()}.png`
    link.click()
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <h3 className="font-semibold text-foreground mb-4">Drawing Canvas</h3>

      <div className="space-y-4">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full border-2 border-purple-300 rounded-lg bg-white cursor-crosshair"
          style={{ height: "400px" }}
        />

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Color:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-12 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Brush:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">{brushSize}px</span>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button onClick={clearCanvas} variant="outline" className="gap-2 bg-transparent">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
            <Button onClick={downloadDrawing} className="gap-2 bg-purple-500 hover:bg-purple-600">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
