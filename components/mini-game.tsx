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
const FOODS = ["🥩", "🥕", "🍃", "🍌", "🥬", "🌸", "🐟"]

export function MiniGame({ onBack }: MiniGameProps) {
  const [score, setScore] = useState(0)
  const [currentAnimal, setCurrentAnimal] = useState("")
  const [currentFood, setCurrentFood] = useState("")
  const [gameState, setGameState] = useState<"playing" | "correct" | "wrong">("playing")
  const [streak, setStreak] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)

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
    setTotalRounds((prev) => prev + 1)
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
      // Play success sound
      playSound("success")
      setTimeout(() => {
        generateNewRound()
      }, 1500)
    } else {
      setGameState("wrong")
      setStreak(0)
      // Play error sound
      playSound("error")
      setTimeout(() => {
        setGameState("playing")
      }, 1500)
    }
  }

  const playSound = (type: "success" | "error") => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    if (type === "success") {
      oscillator.frequency.value = 800
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } else {
      oscillator.frequency.value = 300
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }

  const handleReset = () => {
    setScore(0)
    setStreak(0)
    setTotalRounds(0)
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

        <div className="flex justify-center gap-4">
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="outline">Streak: {streak}</Badge>
          <Badge variant="outline">Round: {totalRounds}</Badge>
        </div>

        <div className="text-center space-y-4">
          <div className="text-8xl animate-bounce">{currentAnimal}</div>
          <p className="text-lg font-medium text-foreground">
            {gameState === "playing" && "What does this animal want to eat?"}
            {gameState === "correct" && "Yummy! Great job! 🎉"}
            {gameState === "wrong" && "Oops! Try again! 😅"}
          </p>
        </div>

        {gameState === "playing" && (
          <div className="grid grid-cols-3 gap-4">
            {FOODS.map((food) => (
              <button
                key={food}
                onClick={() => handleFoodSelect(food)}
                className="p-6 text-4xl bg-muted hover:bg-primary/20 rounded-lg transition-all transform hover:scale-110"
              >
                {food}
              </button>
            ))}
          </div>
        )}

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
