"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react"

interface MiniGameProps {
  onBack: () => void
}

const ANIMALS = ["🦁", "🐢", "🐒", "🐰", "🦋", "🐧"]
const FOODS = ["🥕", "🍃", "🍌", "🥬", "🌸", "🐟"]

export function MiniGame({ onBack }: MiniGameProps) {
  const [score, setScore] = useState(0)
  const [currentAnimal, setCurrentAnimal] = useState("")
  const [currentFood, setCurrentFood] = useState("")
  const [gameState, setGameState] = useState<"playing" | "correct" | "wrong">("playing")
  const [streak, setStreak] = useState(0)

  const animalFoodPairs: Record<string, string> = {
    "🦁": "🥩",
    "🐢": "🥬",
    "🐒": "🍌",
    "🐰": "🥕",
    "🦋": "🌸",
    "🐧": "🐟",
  }

  const generateNewRound = () => {
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
    setCurrentAnimal(randomAnimal)
    setGameState("playing")
  }

  useEffect(() => {
    generateNewRound()
  }, [])

  const handleFoodSelect = (food: string) => {
    setCurrentFood(food)
    const correctFood = animalFoodPairs[currentAnimal]

    if (food === correctFood) {
      setGameState("correct")
      setScore(score + 10)
      setStreak(streak + 1)
      setTimeout(() => {
        generateNewRound()
      }, 1500)
    } else {
      setGameState("wrong")
      setStreak(0)
      setTimeout(() => {
        setGameState("playing")
      }, 1500)
    }
  }

  const handleReset = () => {
    setScore(0)
    setStreak(0)
    generateNewRound()
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Activities
      </Button>

      <Card className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Feed the Animals</h2>
          <p className="text-muted-foreground">Help feed your zoo friends their favorite foods!</p>
        </div>

        {/* Score */}
        <div className="flex justify-center gap-4">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Streak: {streak}</Badge>
        </div>

        {/* Current Animal */}
        <div className="text-center space-y-4">
          <div className="text-8xl">{currentAnimal}</div>
          <p className="text-lg font-medium text-foreground">
            {gameState === "playing" && "What does this animal want to eat?"}
            {gameState === "correct" && "Yummy! Great job! 🎉"}
            {gameState === "wrong" && "Oops! Try again! 😅"}
          </p>
        </div>

        {/* Food Options */}
        {gameState === "playing" && (
          <div className="grid grid-cols-3 gap-4">
            {FOODS.map((food) => (
              <button
                key={food}
                onClick={() => handleFoodSelect(food)}
                className="p-6 text-4xl bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                {food}
              </button>
            ))}
          </div>
        )}

        {/* Game Over / High Score */}
        {score >= 100 && (
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="text-center space-y-2">
              <Trophy className="h-8 w-8 mx-auto text-yellow-600" />
              <h3 className="font-semibold text-foreground">Amazing!</h3>
              <p className="text-sm text-muted-foreground">
                You've reached 100 points! Your animals are very well fed and happy!
              </p>
            </div>
          </Card>
        )}

        <div className="flex gap-4 justify-center">
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            New Game
          </Button>
          <Button onClick={onBack}>Finished Playing</Button>
        </div>
      </Card>
    </div>
  )
}
