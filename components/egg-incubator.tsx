"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePremiumStatus } from "./premium-system"

interface Egg {
  id: string
  mood: string
  animal: string
  createdAt: number
  hatchTime: number
  isPremium: boolean
  rarity: "common" | "rare" | "legendary" | "mythical" | "godly"
  explanation?: string
}

export function EggIncubator() {
  const [eggs, setEggs] = useState<Egg[]>([])
  const [hatchedAnimals, setHatchedAnimals] = useState<any[]>([])
  const isPremium = usePremiumStatus()

  useEffect(() => {
    // Load eggs from localStorage
    const savedEggs = JSON.parse(localStorage.getItem("eggs") || "[]")
    setEggs(savedEggs)

    // Check for hatched eggs
    const now = Date.now()
    const stillIncubating = savedEggs.filter((egg: Egg) => now < egg.createdAt + egg.hatchTime)
    const hatched = savedEggs.filter((egg: Egg) => now >= egg.createdAt + egg.hatchTime)

    if (hatched.length > 0) {
      setHatchedAnimals(hatched)
      localStorage.setItem("eggs", JSON.stringify(stillIncubating))
      setEggs(stillIncubating)
    }
  }, [])

  // Update egg timers
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const savedEggs = JSON.parse(localStorage.getItem("eggs") || "[]")
      const stillIncubating = savedEggs.filter((egg: Egg) => now < egg.createdAt + egg.hatchTime)
      const hatched = savedEggs.filter((egg: Egg) => now >= egg.createdAt + egg.hatchTime)

      if (hatched.length > 0) {
        setHatchedAnimals(hatched)
        localStorage.setItem("eggs", JSON.stringify(stillIncubating))
        setEggs(stillIncubating)
      }

      setEggs(stillIncubating)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getTimeRemaining = (egg: Egg) => {
    const now = Date.now()
    const remaining = egg.createdAt + egg.hatchTime - now
    if (remaining <= 0) return "Ready to hatch!"

    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "legendary":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "mythical":
        return "bg-pink-100 text-pink-800 border-pink-300"
      case "godly":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (eggs.length === 0 && hatchedAnimals.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {eggs.length > 0 && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Eggs Incubating</h3>
          <div className="grid gap-3">
            {eggs.map((egg) => (
              <div
                key={egg.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 ${getRarityColor(egg.rarity)}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥚</span>
                  <div>
                    <p className="text-sm font-medium">
                      {egg.rarity.charAt(0).toUpperCase() + egg.rarity.slice(1)} Egg
                    </p>
                    <p className="text-xs opacity-75">
                      {egg.isPremium ? "Premium" : "Normal"} - {getTimeRemaining(egg)}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{egg.isPremium ? "5 min" : "10 min"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {hatchedAnimals.length > 0 && (
        <Card className="p-6 space-y-4 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <h3 className="font-semibold text-foreground">Eggs Hatched!</h3>
          <div className="grid gap-3">
            {hatchedAnimals.map((animal) => (
              <div key={animal.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{animal.animal}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Your {animal.animal} has hatched!</p>
                    <p className="text-xs text-muted-foreground">Added to your zoo</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
