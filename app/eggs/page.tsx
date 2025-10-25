"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Zap } from "lucide-react"
import Link from "next/link"

const RARITY_COLORS = {
  common: "bg-gray-100 text-gray-800 border-gray-300",
  rare: "bg-blue-100 text-blue-800 border-blue-300",
  legendary: "bg-purple-100 text-purple-800 border-purple-300",
  mythical: "bg-pink-100 text-pink-800 border-pink-300",
  godly: "bg-yellow-100 text-yellow-800 border-yellow-300",
}

const RARITY_LABELS = {
  common: "Common",
  rare: "Rare",
  legendary: "Legendary",
  mythical: "Mythical",
  godly: "Godly",
}

const MOOD_LABELS: Record<string, string> = {
  happy: "Happy",
  excited: "Excited",
  calm: "Calm",
  sad: "Sad",
  anxious: "Anxious",
  angry: "Angry",
  tired: "Tired",
  grateful: "Grateful",
}

export default function EggsPage() {
  const [eggs, setEggs] = useState<any[]>([])
  const [hatchedAnimals, setHatchedAnimals] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const loadEggs = () => {
      const allEggs = JSON.parse(localStorage.getItem("eggs") || "[]")
      const now = Date.now()

      const incubating = allEggs.filter((egg: any) => now - egg.createdAt < egg.hatchTime)
      const hatched = allEggs.filter((egg: any) => now - egg.createdAt >= egg.hatchTime)

      setEggs(incubating)
      setHatchedAnimals(hatched)
    }

    loadEggs()
    const interval = setInterval(loadEggs, 1000)
    return () => clearInterval(interval)
  }, [refreshKey])

  const getTimeRemaining = (egg: any) => {
    const now = Date.now()
    const elapsed = now - egg.createdAt
    const remaining = Math.max(0, egg.hatchTime - elapsed)

    if (remaining === 0) return "Ready to hatch!"

    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)

    return `${minutes}m ${seconds}s`
  }

  const getProgressPercentage = (egg: any) => {
    const now = Date.now()
    const elapsed = now - egg.createdAt
    return Math.min(100, (elapsed / egg.hatchTime) * 100)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Your Eggs</h1>
          <p className="text-muted-foreground">Watch your eggs incubate and hatch into amazing animals</p>
        </div>

        {/* Incubating Eggs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Incubating ({eggs.length})</h2>
          </div>

          {eggs.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">🥚</div>
              <p className="text-muted-foreground">No eggs currently incubating</p>
              <p className="text-sm text-muted-foreground mt-2">Log a mood to create an egg!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {eggs.map((egg) => (
                <Card key={egg.id} className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🥚</div>
                      <div>
                        <Badge className={`${RARITY_COLORS[egg.rarity as keyof typeof RARITY_COLORS]} border`}>
                          {RARITY_LABELS[egg.rarity as keyof typeof RARITY_LABELS]}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{MOOD_LABELS[egg.mood]}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="font-mono text-sm font-semibold">{getTimeRemaining(egg)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-1000"
                      style={{ width: `${getProgressPercentage(egg)}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Hatched Animals */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-500" />
            <h2 className="text-xl font-semibold text-foreground">Hatched ({hatchedAnimals.length})</h2>
          </div>

          {hatchedAnimals.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">🐣</div>
              <p className="text-muted-foreground">No hatched animals yet</p>
              <p className="text-sm text-muted-foreground mt-2">Your eggs will appear here when they hatch!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {hatchedAnimals.map((animal) => (
                <Card
                  key={animal.id}
                  className="p-6 space-y-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">🐣</div>
                      <div>
                        <Badge className={`${RARITY_COLORS[animal.rarity as keyof typeof RARITY_COLORS]} border`}>
                          {RARITY_LABELS[animal.rarity as keyof typeof RARITY_LABELS]}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{MOOD_LABELS[animal.mood]}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Ready!</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This egg has hatched! Check your zoo to see your new animal.
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
