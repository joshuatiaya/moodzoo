"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

const EVOLVED_ANIMALS = {
  happy: {
    1: { emoji: "🦁", name: "Lion" },
    2: { emoji: "🦁", name: "Golden Lion" },
    3: { emoji: "🦁", name: "Lion King" },
    4: { emoji: "🦁", name: "Legendary Lion" },
  },
  excited: {
    1: { emoji: "🐒", name: "Monkey" },
    2: { emoji: "🐵", name: "Wise Monkey" },
    3: { emoji: "🙈", name: "Monkey King" },
    4: { emoji: "🙉", name: "Legendary Monkey" },
  },
  calm: {
    1: { emoji: "🐢", name: "Turtle" },
    2: { emoji: "🐢", name: "Ancient Turtle" },
    3: { emoji: "🐢", name: "Turtle Sage" },
    4: { emoji: "🐢", name: "Legendary Turtle" },
  },
  sad: {
    1: { emoji: "🐧", name: "Penguin" },
    2: { emoji: "🐧", name: "Emperor Penguin" },
    3: { emoji: "🐧", name: "Penguin King" },
    4: { emoji: "🐧", name: "Legendary Penguin" },
  },
  anxious: {
    1: { emoji: "🐰", name: "Rabbit" },
    2: { emoji: "🐇", name: "Swift Rabbit" },
    3: { emoji: "🐰", name: "Rabbit King" },
    4: { emoji: "🐰", name: "Legendary Rabbit" },
  },
  angry: {
    1: { emoji: "🐺", name: "Wolf" },
    2: { emoji: "🐺", name: "Alpha Wolf" },
    3: { emoji: "🐺", name: "Wolf King" },
    4: { emoji: "🐺", name: "Legendary Wolf" },
  },
  tired: {
    1: { emoji: "🐨", name: "Koala" },
    2: { emoji: "🐨", name: "Sleepy Koala" },
    3: { emoji: "🐨", name: "Koala King" },
    4: { emoji: "🐨", name: "Legendary Koala" },
  },
  grateful: {
    1: { emoji: "🦋", name: "Butterfly" },
    2: { emoji: "🦋", name: "Rainbow Butterfly" },
    3: { emoji: "🦋", name: "Butterfly Queen" },
    4: { emoji: "🦋", name: "Legendary Butterfly" },
  },
}

export function EvolutionPreview() {
  const [moodEntries, setMoodEntries] = useState<any[]>([])
  const [evolutions, setEvolutions] = useState<any>({})

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]")
    const savedEvolutions = JSON.parse(localStorage.getItem("animalEvolutions") || "{}")
    setMoodEntries(entries)
    setEvolutions(savedEvolutions)
  }, [])

  const getAnimalCounts = () => {
    const counts: any = {}

    // Count basic animals from mood entries
    moodEntries.forEach((entry) => {
      if (!counts[entry.mood]) {
        counts[entry.mood] = { 1: 0, 2: 0, 3: 0, 4: 0 }
      }
      counts[entry.mood][1]++
    })

    // Add evolved animals from storage
    Object.keys(evolutions).forEach((mood) => {
      if (!counts[mood]) {
        counts[mood] = { 1: 0, 2: 0, 3: 0, 4: 0 }
      }
      Object.keys(evolutions[mood]).forEach((tier) => {
        counts[mood][Number.parseInt(tier)] = evolutions[mood][tier]
      })
    })

    return counts
  }

  const canEvolve = (mood: string, tier: number) => {
    const counts = getAnimalCounts()
    return counts[mood] && counts[mood][tier] >= 3
  }

  const getEvolvableAnimals = () => {
    const counts = getAnimalCounts()
    const evolvable: any[] = []

    Object.keys(counts).forEach((mood) => {
      for (let tier = 1; tier <= 3; tier++) {
        if (canEvolve(mood, tier)) {
          const animal = EVOLVED_ANIMALS[mood as keyof typeof EVOLVED_ANIMALS]
          if (animal) {
            evolvable.push({
              mood,
              tier,
              count: counts[mood][tier],
              animal: animal[tier as keyof typeof animal],
              nextAnimal: animal[(tier + 1) as keyof typeof animal],
            })
          }
        }
      }
    })

    return evolvable
  }

  const evolvableAnimals = getEvolvableAnimals()

  if (evolvableAnimals.length === 0) {
    return null
  }

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <h3 className="font-semibold text-foreground">Evolution Ready!</h3>
        </div>
        <Badge variant="secondary">{evolvableAnimals.length}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">You can merge animals to create evolved versions!</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {evolvableAnimals.slice(0, 3).map((item, index) => (
            <div key={index} className="text-xl">
              {item.animal.emoji}
            </div>
          ))}
          {evolvableAnimals.length > 3 && (
            <span className="text-sm text-muted-foreground">+{evolvableAnimals.length - 3}</span>
          )}
        </div>

        <Link href="/zoo">
          <Button size="sm">
            Evolve Now
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  )
}
