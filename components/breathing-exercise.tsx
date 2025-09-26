"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react"

interface BreathingExerciseProps {
  onBack: () => void
}

export function BreathingExercise({ onBack }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycle, setCycle] = useState(0)
  const [totalCycles] = useState(6)

  const phaseConfig = {
    inhale: { duration: 4, next: "hold", text: "Breathe In", color: "bg-blue-500" },
    hold: { duration: 2, next: "exhale", text: "Hold", color: "bg-yellow-500" },
    exhale: { duration: 6, next: "inhale", text: "Breathe Out", color: "bg-green-500" },
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      const currentPhase = phaseConfig[phase]
      const nextPhase = currentPhase.next as keyof typeof phaseConfig

      if (phase === "exhale") {
        setCycle(cycle + 1)
        if (cycle + 1 >= totalCycles) {
          setIsActive(false)
          return
        }
      }

      setPhase(nextPhase)
      setTimeLeft(phaseConfig[nextPhase].duration)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeLeft, phase, cycle, totalCycles])

  const handleStart = () => {
    setIsActive(true)
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimeLeft(4)
    setCycle(0)
  }

  const currentConfig = phaseConfig[phase]
  const progress = ((currentConfig.duration - timeLeft) / currentConfig.duration) * 100
  const overallProgress = (cycle / totalCycles) * 100

  if (cycle >= totalCycles) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Activities
        </Button>

        <Card className="p-8 text-center space-y-6">
          <div className="text-6xl">🌸</div>
          <h2 className="text-2xl font-bold text-foreground">Well Done!</h2>
          <p className="text-muted-foreground">
            You've completed your breathing exercise. Your zoo animals are proud of you for taking care of yourself!
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleReset} variant="outline">
              Do Another Round
            </Button>
            <Button onClick={onBack}>Back to Activities</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Activities
      </Button>

      <Card className="p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Breathing Garden</h2>
        <p className="text-muted-foreground">Follow the rhythm and breathe with your animal friends</p>

        {/* Breathing Circle */}
        <div className="relative w-48 h-48 mx-auto">
          <div
            className={`absolute inset-0 rounded-full ${currentConfig.color} opacity-20 transition-all duration-1000 ${
              isActive ? "scale-110" : "scale-100"
            }`}
          />
          <div
            className={`absolute inset-4 rounded-full ${currentConfig.color} opacity-40 transition-all duration-1000 ${
              phase === "inhale" && isActive ? "scale-110" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="text-4xl">🐢</div>
              <div className="text-lg font-semibold text-foreground">{currentConfig.text}</div>
              <div className="text-3xl font-bold text-primary">{timeLeft}</div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current breath</span>
              <span className="text-foreground">{currentConfig.text}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="text-foreground">
                {cycle}/{totalCycles} cycles
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          {!isActive ? (
            <Button onClick={handleStart} size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={handlePause} size="lg" variant="outline">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} size="lg" variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>
    </div>
  )
}
