"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const MOODS = [
  { id: "happy", label: "Happy", animal: "🦁" },
  { id: "excited", label: "Excited", animal: "🐒" },
  { id: "calm", label: "Calm", animal: "🐢" },
  { id: "sad", label: "Sad", animal: "🐧" },
  { id: "anxious", label: "Anxious", animal: "🐰" },
  { id: "angry", label: "Angry", animal: "🐺" },
  { id: "tired", label: "Tired", animal: "🐨" },
  { id: "grateful", label: "Grateful", animal: "🦋" },
]

export function ZooPreview() {
  const [moodEntries, setMoodEntries] = useState<any[]>([])

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]")
    setMoodEntries(entries)
  }, [])

  const getRecentAnimals = () => {
    const uniqueMoods = [...new Set(moodEntries.map((entry) => entry.mood))]
    return uniqueMoods.slice(0, 4).map((moodId) => {
      const mood = MOODS.find((m) => m.id === moodId)
      return mood?.animal || "🌱"
    })
  }

  const recentAnimals = getRecentAnimals()
  const totalAnimals = moodEntries.length

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Your Zoo</h3>
        <Link href="/zoo">
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="grass-border">
        <div className="flex items-end justify-center gap-4 pb-4">
          {recentAnimals.length === 0 ? (
            <div className="text-center py-4">
              <div className="text-6xl mb-2">🌿</div>
              <p className="text-sm text-muted-foreground">Your zoo is waiting for its first animal!</p>
            </div>
          ) : (
            recentAnimals.map((animal, index) => (
              <div key={index} className="text-4xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                {animal}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        {totalAnimals === 0 ? (
          <>
            <p className="text-sm text-muted-foreground">No animals yet</p>
            <p className="text-xs text-muted-foreground">Log your first mood to start your zoo!</p>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{totalAnimals} animals in your zoo</p>
            <p className="text-xs text-muted-foreground">Keep logging moods to discover new species!</p>
          </>
        )}
      </div>
    </Card>
  )
}
