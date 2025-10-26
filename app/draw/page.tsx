import { Header } from "@/components/header"
import { DrawingCanvas } from "@/components/drawing-canvas"

export default function DrawPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <DrawingCanvas />
      </div>
    </main>
  )
}
