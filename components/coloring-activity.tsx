"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Palette, RotateCcw, Sparkles, ChevronLeft, ChevronRight, Save } from "lucide-react"

interface ColoringActivityProps {
  onBack: () => void
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
  "#F8C471",
  "#82E0AA",
  "#AED6F1",
  "#D7BDE2",
  "#F9E79F",
  "#A3E4D7",
  "#FFB6C1",
  "#87CEEB",
  "#DDA0DD",
  "#F0E68C",
  "#FF7F50",
  "#40E0D0",
  "#EE82EE",
  "#90EE90",
]

const BRUSH_SIZES = [2, 4, 6, 8]

const COLORING_PAGES = [
  {
    id: "safari",
    title: "Safari Adventure",
    description: "Color the wild safari scene",
    difficulty: "Easy",
    svg: (coloredPaths: Record<string, string>, handlePathClick: (id: string) => void) => (
      <svg viewBox="0 0 400 400" className="w-full h-auto">
        {/* Sky with clouds */}
        <rect
          id="sky"
          x="0"
          y="0"
          width="400"
          height="200"
          fill={coloredPaths.sky || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("sky")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Clouds */}
        <ellipse
          id="cloud1"
          cx="80"
          cy="60"
          rx="25"
          ry="15"
          fill={coloredPaths.cloud1 || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("cloud1")}
          className="cursor-pointer hover:opacity-80"
        />
        <ellipse
          id="cloud2"
          cx="320"
          cy="80"
          rx="30"
          ry="18"
          fill={coloredPaths.cloud2 || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("cloud2")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Ground */}
        <rect
          id="ground"
          x="0"
          y="200"
          width="400"
          height="200"
          fill={coloredPaths.ground || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("ground")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Acacia Tree */}
        <rect
          id="trunk"
          x="320"
          y="150"
          width="15"
          height="50"
          fill={coloredPaths.trunk || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("trunk")}
          className="cursor-pointer hover:opacity-80"
        />
        <ellipse
          id="leaves"
          cx="327"
          cy="140"
          rx="40"
          ry="25"
          fill={coloredPaths.leaves || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("leaves")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Lion */}
        <ellipse
          id="lion-body"
          cx="150"
          cy="280"
          rx="45"
          ry="35"
          fill={coloredPaths["lion-body"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("lion-body")}
          className="cursor-pointer hover:opacity-80"
        />
        <circle
          id="lion-head"
          cx="150"
          cy="230"
          r="30"
          fill={coloredPaths["lion-head"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("lion-head")}
          className="cursor-pointer hover:opacity-80"
        />
        <circle
          id="lion-mane"
          cx="150"
          cy="230"
          r="40"
          fill={coloredPaths["lion-mane"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("lion-mane")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Lion features */}
        <circle cx="140" cy="225" r="3" fill="#333" />
        <circle cx="160" cy="225" r="3" fill="#333" />
        <path d="M 145 235 Q 150 240 155 235" stroke="#333" strokeWidth="2" fill="none" />

        {/* Elephant */}
        <ellipse
          id="elephant-body"
          cx="250"
          cy="300"
          rx="50"
          ry="40"
          fill={coloredPaths["elephant-body"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("elephant-body")}
          className="cursor-pointer hover:opacity-80"
        />
        <circle
          id="elephant-head"
          cx="220"
          cy="250"
          r="35"
          fill={coloredPaths["elephant-head"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("elephant-head")}
          className="cursor-pointer hover:opacity-80"
        />
        <path
          id="elephant-trunk"
          d="M 200 270 Q 180 290 190 320"
          fill="none"
          stroke={coloredPaths["elephant-trunk"] || "#333"}
          strokeWidth="8"
          onClick={() => handlePathClick("elephant-trunk")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Elephant ears */}
        <ellipse
          id="elephant-ear"
          cx="200"
          cy="240"
          rx="20"
          ry="30"
          fill={coloredPaths["elephant-ear"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("elephant-ear")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Sun */}
        <circle
          id="sun"
          cx="350"
          cy="50"
          r="25"
          fill={coloredPaths.sun || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("sun")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Sun rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const x1 = 350 + Math.cos((angle * Math.PI) / 180) * 30
          const y1 = 50 + Math.sin((angle * Math.PI) / 180) * 30
          const x2 = 350 + Math.cos((angle * Math.PI) / 180) * 40
          const y2 = 50 + Math.sin((angle * Math.PI) / 180) * 40
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="2" />
        })}

        {/* Butterflies */}
        <g id="butterfly1" onClick={() => handlePathClick("butterfly1")} className="cursor-pointer hover:opacity-80">
          <ellipse
            cx="80"
            cy="120"
            rx="8"
            ry="12"
            fill={coloredPaths.butterfly1 || "#f8f9fa"}
            stroke="#333"
            strokeWidth="1"
          />
          <ellipse
            cx="92"
            cy="120"
            rx="8"
            ry="12"
            fill={coloredPaths.butterfly1 || "#f8f9fa"}
            stroke="#333"
            strokeWidth="1"
          />
          <line x1="86" y1="110" x2="86" y2="130" stroke="#333" strokeWidth="2" />
        </g>
      </svg>
    ),
  },
  {
    id: "underwater",
    title: "Ocean Paradise",
    description: "Dive into the colorful underwater world",
    difficulty: "Medium",
    svg: (coloredPaths: Record<string, string>, handlePathClick: (id: string) => void) => (
      <svg viewBox="0 0 400 400" className="w-full h-auto">
        {/* Water background */}
        <rect
          id="water"
          x="0"
          y="0"
          width="400"
          height="400"
          fill={coloredPaths.water || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("water")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Ocean floor */}
        <ellipse
          id="sand"
          cx="200"
          cy="380"
          rx="200"
          ry="30"
          fill={coloredPaths.sand || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("sand")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Coral reef */}
        <path
          id="coral1"
          d="M 50 350 Q 60 320 70 350 Q 80 320 90 350"
          fill={coloredPaths.coral1 || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("coral1")}
          className="cursor-pointer hover:opacity-80"
        />
        <path
          id="coral2"
          d="M 320 360 Q 330 330 340 360 Q 350 330 360 360"
          fill={coloredPaths.coral2 || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("coral2")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Fish */}
        <ellipse
          id="fish1-body"
          cx="150"
          cy="200"
          rx="25"
          ry="15"
          fill={coloredPaths["fish1-body"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("fish1-body")}
          className="cursor-pointer hover:opacity-80"
        />
        <path
          id="fish1-tail"
          d="M 125 200 L 110 190 L 110 210 Z"
          fill={coloredPaths["fish1-tail"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("fish1-tail")}
          className="cursor-pointer hover:opacity-80"
        />
        <circle cx="160" cy="195" r="2" fill="#333" />

        {/* Seahorse */}
        <path
          id="seahorse"
          d="M 280 250 Q 285 230 290 250 Q 295 270 290 290 Q 285 310 280 290"
          fill={coloredPaths.seahorse || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("seahorse")}
          className="cursor-pointer hover:opacity-80"
        />
        <circle
          id="seahorse-head"
          cx="285"
          cy="240"
          r="8"
          fill={coloredPaths["seahorse-head"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("seahorse-head")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Jellyfish */}
        <ellipse
          id="jellyfish-body"
          cx="200"
          cy="100"
          rx="30"
          ry="20"
          fill={coloredPaths["jellyfish-body"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("jellyfish-body")}
          className="cursor-pointer hover:opacity-80"
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M ${185 + i * 7} 120 Q ${185 + i * 7} 140 ${180 + i * 7} 160`}
            stroke={coloredPaths[`jellyfish-tentacle${i}`] || "#333"}
            strokeWidth="3"
            fill="none"
            onClick={() => handlePathClick(`jellyfish-tentacle${i}`)}
            className="cursor-pointer hover:opacity-80"
          />
        ))}

        {/* Starfish */}
        <g id="starfish" onClick={() => handlePathClick("starfish")} className="cursor-pointer hover:opacity-80">
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i * 72 * Math.PI) / 180
            const x = 100 + Math.cos(angle) * 20
            const y = 320 + Math.sin(angle) * 20
            return (
              <path
                key={i}
                d={`M 100 320 L ${x} ${y} L ${100 + Math.cos(angle + 0.6) * 10} ${320 + Math.sin(angle + 0.6) * 10} Z`}
                fill={coloredPaths.starfish || "#f8f9fa"}
                stroke="#333"
                strokeWidth="2"
              />
            )
          })}
        </g>

        {/* Bubbles */}
        {[1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            id={`bubble${i}`}
            cx={50 + i * 60}
            cy={50 + i * 30}
            r={5 + i * 2}
            fill={coloredPaths[`bubble${i}`] || "#f8f9fa"}
            stroke="#333"
            strokeWidth="1"
            onClick={() => handlePathClick(`bubble${i}`)}
            className="cursor-pointer hover:opacity-80"
          />
        ))}
      </svg>
    ),
  },
  {
    id: "garden",
    title: "Magical Garden",
    description: "Color the enchanted flower garden",
    difficulty: "Hard",
    svg: (coloredPaths: Record<string, string>, handlePathClick: (id: string) => void) => (
      <svg viewBox="0 0 400 400" className="w-full h-auto">
        {/* Sky */}
        <rect
          id="sky"
          x="0"
          y="0"
          width="400"
          height="250"
          fill={coloredPaths.sky || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("sky")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Ground */}
        <rect
          id="ground"
          x="0"
          y="250"
          width="400"
          height="150"
          fill={coloredPaths.ground || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("ground")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Large sunflower */}
        <circle
          id="sunflower-center"
          cx="200"
          cy="180"
          r="20"
          fill={coloredPaths["sunflower-center"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("sunflower-center")}
          className="cursor-pointer hover:opacity-80"
        />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * 45 * Math.PI) / 180
          const x = 200 + Math.cos(angle) * 35
          const y = 180 + Math.sin(angle) * 35
          return (
            <ellipse
              key={i}
              id={`sunflower-petal${i}`}
              cx={x}
              cy={y}
              rx="12"
              ry="6"
              transform={`rotate(${i * 45} ${x} ${y})`}
              fill={coloredPaths[`sunflower-petal${i}`] || "#f8f9fa"}
              stroke="#333"
              strokeWidth="2"
              onClick={() => handlePathClick(`sunflower-petal${i}`)}
              className="cursor-pointer hover:opacity-80"
            />
          )
        })}
        <rect
          id="sunflower-stem"
          x="195"
          y="220"
          width="10"
          height="80"
          fill={coloredPaths["sunflower-stem"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("sunflower-stem")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Roses */}
        <g id="rose1" onClick={() => handlePathClick("rose1")} className="cursor-pointer hover:opacity-80">
          <circle cx="100" cy="200" r="15" fill={coloredPaths.rose1 || "#f8f9fa"} stroke="#333" strokeWidth="2" />
          <circle cx="100" cy="200" r="10" fill={coloredPaths.rose1 || "#f8f9fa"} stroke="#333" strokeWidth="1" />
          <circle cx="100" cy="200" r="5" fill={coloredPaths.rose1 || "#f8f9fa"} stroke="#333" strokeWidth="1" />
        </g>

        <g id="rose2" onClick={() => handlePathClick("rose2")} className="cursor-pointer hover:opacity-80">
          <circle cx="300" cy="220" r="15" fill={coloredPaths.rose2 || "#f8f9fa"} stroke="#333" strokeWidth="2" />
          <circle cx="300" cy="220" r="10" fill={coloredPaths.rose2 || "#f8f9fa"} stroke="#333" strokeWidth="1" />
          <circle cx="300" cy="220" r="5" fill={coloredPaths.rose2 || "#f8f9fa"} stroke="#333" strokeWidth="1" />
        </g>

        {/* Butterfly garden */}
        <g
          id="butterfly-large"
          onClick={() => handlePathClick("butterfly-large")}
          className="cursor-pointer hover:opacity-80"
        >
          <ellipse
            cx="150"
            cy="120"
            rx="15"
            ry="20"
            fill={coloredPaths["butterfly-large"] || "#f8f9fa"}
            stroke="#333"
            strokeWidth="2"
          />
          <ellipse
            cx="170"
            cy="120"
            rx="15"
            ry="20"
            fill={coloredPaths["butterfly-large"] || "#f8f9fa"}
            stroke="#333"
            strokeWidth="2"
          />
          <ellipse
            cx="150"
            cy="140"
            rx="12"
            ry="15"
            fill={coloredPaths["butterfly-large"] || "#f8f9fa"}
            stroke="#333"
            strokeWidth="2"
          />
          <ellipse
            cx="170"
            cy="140"
            rx="12"
            ry="15"
            fill={coloredPaths["butterfly-large"] || "#f8f9fa"}
            stroke="#333"
            strokeWidth="2"
          />
          <line x1="160" y1="110" x2="160" y2="150" stroke="#333" strokeWidth="3" />
        </g>

        {/* Mushrooms */}
        <ellipse
          id="mushroom1-cap"
          cx="50"
          cy="320"
          rx="20"
          ry="10"
          fill={coloredPaths["mushroom1-cap"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("mushroom1-cap")}
          className="cursor-pointer hover:opacity-80"
        />
        <rect
          id="mushroom1-stem"
          x="45"
          y="320"
          width="10"
          height="25"
          fill={coloredPaths["mushroom1-stem"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("mushroom1-stem")}
          className="cursor-pointer hover:opacity-80"
        />

        {/* Ladybug */}
        <ellipse
          id="ladybug-body"
          cx="250"
          cy="300"
          rx="12"
          ry="8"
          fill={coloredPaths["ladybug-body"] || "#f8f9fa"}
          stroke="#333"
          strokeWidth="2"
          onClick={() => handlePathClick("ladybug-body")}
          className="cursor-pointer hover:opacity-80"
        />
        <circle cx="245" cy="295" r="2" fill="#333" />
        <circle cx="255" cy="295" r="2" fill="#333" />
        <circle
          id="ladybug-spot1"
          cx="245"
          cy="302"
          r="2"
          fill={coloredPaths["ladybug-spot1"] || "#333"}
          onClick={() => handlePathClick("ladybug-spot1")}
          className="cursor-pointer hover:opacity-80"
        />
        <circle
          id="ladybug-spot2"
          cx="255"
          cy="302"
          r="2"
          fill={coloredPaths["ladybug-spot2"] || "#333"}
          onClick={() => handlePathClick("ladybug-spot2")}
          className="cursor-pointer hover:opacity-80"
        />
      </svg>
    ),
  },
]

export function ColoringActivity({ onBack }: ColoringActivityProps) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1])
  const [coloredPaths, setColoredPaths] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [completedPages, setCompletedPages] = useState<string[]>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("coloring-progress")
    if (saved) {
      const data = JSON.parse(saved)
      setColoredPaths(data.coloredPaths || {})
      setCompletedPages(data.completedPages || [])
      setLastSaved(data.lastSaved ? new Date(data.lastSaved) : null)
    }
  }, [])

  useEffect(() => {
    const saveData = {
      coloredPaths,
      completedPages,
      lastSaved: new Date().toISOString(),
    }
    localStorage.setItem("coloring-progress", JSON.stringify(saveData))
    setLastSaved(new Date())
    console.log("[v0] Coloring progress auto-saved:", Object.keys(coloredPaths).length, "colored elements")
  }, [coloredPaths, completedPages])

  const handlePathClick = (pathId: string) => {
    const fullPathId = `${COLORING_PAGES[currentPage].id}-${pathId}`
    setColoredPaths((prev) => ({
      ...prev,
      [fullPathId]: selectedColor,
    }))
  }

  const handleReset = () => {
    const pageId = COLORING_PAGES[currentPage].id
    const newColoredPaths = { ...coloredPaths }
    Object.keys(newColoredPaths).forEach((key) => {
      if (key.startsWith(`${pageId}-`)) {
        delete newColoredPaths[key]
      }
    })
    setColoredPaths(newColoredPaths)
  }

  const handleComplete = () => {
    const pageId = COLORING_PAGES[currentPage].id
    if (!completedPages.includes(pageId)) {
      setCompletedPages((prev) => [...prev, pageId])
      setShowCelebration(true)

      const activityStats = JSON.parse(localStorage.getItem("activity-stats") || "{}")
      activityStats.coloring = (activityStats.coloring || 0) + 1
      localStorage.setItem("activity-stats", JSON.stringify(activityStats))

      setTimeout(() => setShowCelebration(false), 3000)
    }
  }

  const handleManualSave = () => {
    const saveData = {
      coloredPaths,
      completedPages,
      lastSaved: new Date().toISOString(),
    }
    localStorage.setItem("coloring-progress", JSON.stringify(saveData))
    setLastSaved(new Date())

    // Show brief confirmation
    const originalText = document.querySelector("[data-save-button]")?.textContent
    const button = document.querySelector("[data-save-button]")
    if (button) {
      button.textContent = "Saved!"
      setTimeout(() => {
        button.textContent = originalText
      }, 1500)
    }
  }

  const currentPageData = COLORING_PAGES[currentPage]
  const pageColoredPaths = Object.fromEntries(
    Object.entries(coloredPaths)
      .filter(([key]) => key.startsWith(`${currentPageData.id}-`))
      .map(([key, value]) => [key.replace(`${currentPageData.id}-`, ""), value]),
  )

  const getCompletionPercentage = () => {
    const totalElements = Object.keys(pageColoredPaths).length
    const coloredElements = Object.values(pageColoredPaths).filter((color) => color !== "#f8f9fa").length
    return totalElements > 0 ? Math.round((coloredElements / totalElements) * 100) : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Activities
        </Button>

        <div className="flex items-center gap-2">
          {lastSaved && <span className="text-xs text-muted-foreground">Saved {lastSaved.toLocaleTimeString()}</span>}
          <Button variant="outline" size="sm" onClick={handleManualSave} data-save-button>
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {showCelebration && (
        <Card className="p-6 bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
          <div className="text-center space-y-2">
            <Sparkles className="h-8 w-8 mx-auto text-yellow-600" />
            <h3 className="font-bold text-yellow-800">Masterpiece Complete!</h3>
            <p className="text-yellow-700">You've finished coloring this beautiful scene!</p>
          </div>
        </Card>
      )}

      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">{currentPageData.title}</h2>
              <p className="text-muted-foreground">{currentPageData.description}</p>
              <div className="flex items-center gap-2 justify-center">
                <Badge
                  variant={
                    currentPageData.difficulty === "Easy"
                      ? "default"
                      : currentPageData.difficulty === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {currentPageData.difficulty}
                </Badge>
                <Badge variant="outline">{getCompletionPercentage()}% Complete</Badge>
                {completedPages.includes(currentPageData.id) && (
                  <Badge className="bg-green-100 text-green-800">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Finished
                  </Badge>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(COLORING_PAGES.length - 1, currentPage + 1))}
              disabled={currentPage === COLORING_PAGES.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-sm text-foreground mb-2">Color Palette</h3>
            <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color ? "border-foreground scale-110 shadow-lg" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <h3 className="font-semibold text-sm text-foreground mb-2">Brush Size</h3>
            <div className="flex gap-2 justify-center">
              {BRUSH_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    brushSize === size ? "border-foreground bg-muted" : "border-border"
                  }`}
                >
                  <div className="rounded-full bg-foreground" style={{ width: size, height: size }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mx-auto max-w-lg shadow-inner">
          {currentPageData.svg(pageColoredPaths, handlePathClick)}
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear Page
          </Button>
          <Button onClick={handleComplete} variant="default">
            <Sparkles className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>
          <Button onClick={onBack} variant="secondary">
            <Palette className="h-4 w-4 mr-2" />
            Finished
          </Button>
        </div>

        <div className="flex justify-center gap-2">
          {COLORING_PAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentPage
                  ? "bg-primary"
                  : completedPages.includes(COLORING_PAGES[index].id)
                    ? "bg-green-500"
                    : "bg-muted"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
