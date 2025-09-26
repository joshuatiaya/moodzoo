"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, ArrowRight } from "lucide-react"
import { usePremiumStatus } from "./premium-system"

// Evolution tiers with enhanced animals
const EVOLUTION_TIERS = {
  1: { name: "Basic", prefix: "", suffix: "" },
  2: { name: "Evolved", prefix: "✨", suffix: "" },
  3: { name: "Super", prefix: "⭐", suffix: " King/Queen" },
  4: { name: "Legendary", prefix: "👑", suffix: " Legend" },
}

const EVOLVED_ANIMALS = {
  // Happy animals (Lion evolution line)
  happy: {
    1: { emoji: "🦁", name: "Lion" },
    2: { emoji: "🦁", name: "Golden Lion" },
    3: { emoji: "🦁", name: "Lion King" },
    4: { emoji: "🦁", name: "Legendary Lion" },
  },
  // Excited animals (Monkey evolution line)
  excited: {
    1: { emoji: "🐒", name: "Monkey" },
    2: { emoji: "🐵", name: "Wise Monkey" },
    3: { emoji: "🙈", name: "Monkey King" },
    4: { emoji: "🙉", name: "Legendary Monkey" },
  },
  // Calm animals (Turtle evolution line)
  calm: {
    1: { emoji: "🐢", name: "Turtle" },
    2: { emoji: "🐢", name: "Ancient Turtle" },
    3: { emoji: "🐢", name: "Turtle Sage" },
    4: { emoji: "🐢", name: "Legendary Turtle" },
  },
  // Sad animals (Penguin evolution line)
  sad: {
    1: { emoji: "🐧", name: "Penguin" },
    2: { emoji: "🐧", name: "Emperor Penguin" },
    3: { emoji: "🐧", name: "Penguin King" },
    4: { emoji: "🐧", name: "Legendary Penguin" },
  },
  // Anxious animals (Rabbit evolution line)
  anxious: {
    1: { emoji: "🐰", name: "Rabbit" },
    2: { emoji: "🐇", name: "Swift Rabbit" },
    3: { emoji: "🐰", name: "Rabbit King" },
    4: { emoji: "🐰", name: "Legendary Rabbit" },
  },
  // Angry animals (Wolf evolution line)
  angry: {
    1: { emoji: "🐺", name: "Wolf" },
    2: { emoji: "🐺", name: "Alpha Wolf" },
    3: { emoji: "🐺", name: "Wolf King" },
    4: { emoji: "🐺", name: "Legendary Wolf" },
  },
  // Tired animals (Koala evolution line)
  tired: {
    1: { emoji: "🐨", name: "Koala" },
    2: { emoji: "🐨", name: "Sleepy Koala" },
    3: { emoji: "🐨", name: "Koala King" },
    4: { emoji: "🐨", name: "Legendary Koala" },
  },
  // Grateful animals (Butterfly evolution line)
  grateful: {
    1: { emoji: "🦋", name: "Butterfly" },
    2: { emoji: "🦋", name: "Rainbow Butterfly" },
    3: { emoji: "🦋", name: "Butterfly Queen" },
    4: { emoji: "🦋", name: "Legendary Butterfly" },
  },
}

interface EvolutionSystemProps {
  onEvolutionComplete?: () => void
}

export function EvolutionSystem({ onEvolutionComplete }: EvolutionSystemProps) {
  const [moodEntries, setMoodEntries] = useState<any[]>([])
  const [evolutions, setEvolutions] = useState<any>({})
  const [showEvolutionDialog, setShowEvolutionDialog] = useState(false)
  const [selectedEvolution, setSelectedEvolution] = useState<any>(null)
  const isPremium = usePremiumStatus()

  const evolutionRequirement = isPremium ? 2 : 3

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
        if (evolutions[mood][tier].count) {
          counts[mood][Number.parseInt(tier)] = evolutions[mood][tier].count
        }
      })
    })

    return counts
  }

  const canEvolve = (mood: string, tier: number) => {
    const counts = getAnimalCounts()
    return counts[mood] && counts[mood][tier] >= evolutionRequirement
  }

  const handleEvolution = (mood: string, fromTier: number, toTier: number) => {
    const newEvolutions = { ...evolutions }

    if (!newEvolutions[mood]) {
      newEvolutions[mood] = {}
    }

    let preservedNotes: any[] = []

    if (fromTier === 1) {
      const entriesToRemove = moodEntries.filter((entry) => entry.mood === mood).slice(0, evolutionRequirement)

      preservedNotes = entriesToRemove
        .filter((entry) => entry.explanation)
        .map((entry) => ({
          explanation: entry.explanation,
          timestamp: entry.timestamp,
        }))

      const entriesToRemoveIds = entriesToRemove.map((entry) => entry.id)
      const updatedEntries = moodEntries.filter((entry) => !entriesToRemoveIds.includes(entry.id))
      setMoodEntries(updatedEntries)
      localStorage.setItem("moodEntries", JSON.stringify(updatedEntries))
    } else {
      const existingEvolution = newEvolutions[mood][fromTier]
      if (existingEvolution && existingEvolution.notes) {
        preservedNotes = [...existingEvolution.notes]
      }

      newEvolutions[mood][fromTier] = {
        count: (existingEvolution?.count || 0) - evolutionRequirement,
        notes: existingEvolution?.notes || [],
      }

      if (newEvolutions[mood][fromTier].count <= 0) {
        delete newEvolutions[mood][fromTier]
      }
    }

    // Add 1 animal to next tier with preserved notes
    if (!newEvolutions[mood][toTier]) {
      newEvolutions[mood][toTier] = { count: 0, notes: [] }
    }

    newEvolutions[mood][toTier] = {
      count: (newEvolutions[mood][toTier].count || 0) + 1,
      notes: [...(newEvolutions[mood][toTier].notes || []), ...preservedNotes],
    }

    setEvolutions(newEvolutions)
    localStorage.setItem("animalEvolutions", JSON.stringify(newEvolutions))

    // Show evolution animation
    const animal = EVOLVED_ANIMALS[mood as keyof typeof EVOLVED_ANIMALS]
    setSelectedEvolution({
      mood,
      fromTier,
      toTier,
      animal: animal[toTier as keyof typeof animal],
    })
    setShowEvolutionDialog(true)

    if (onEvolutionComplete) {
      onEvolutionComplete()
    }
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
    <>
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-foreground">Evolution Available!</h3>
          {isPremium && <Badge className="bg-yellow-600 text-white text-xs">Premium: 2 needed</Badge>}
        </div>

        <p className="text-sm text-muted-foreground">
          You can merge {evolutionRequirement} of the same animals to create evolved versions! Your notes will be
          preserved.
        </p>

        <div className="space-y-3">
          {evolvableAnimals.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{item.animal.emoji}</div>
                <div>
                  <div className="font-medium text-sm">
                    {EVOLUTION_TIERS[item.tier as keyof typeof EVOLUTION_TIERS].prefix}
                    {item.animal.name}
                    {EVOLUTION_TIERS[item.tier as keyof typeof EVOLUTION_TIERS].suffix}
                  </div>
                  <div className="text-xs text-muted-foreground">Available: {item.count}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl">{item.nextAnimal.emoji}</div>
                <Button size="sm" onClick={() => handleEvolution(item.mood, item.tier, item.tier + 1)} className="ml-2">
                  Evolve
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={showEvolutionDialog} onOpenChange={setShowEvolutionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Evolution Complete!</DialogTitle>
          </DialogHeader>

          {selectedEvolution && (
            <div className="text-center space-y-6 py-4">
              <div className="text-8xl animate-bounce">{selectedEvolution.animal.emoji}</div>

              <div className="space-y-2">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  {EVOLUTION_TIERS[selectedEvolution.toTier].name} Tier
                </Badge>
                <h3 className="text-xl font-bold text-foreground">
                  {EVOLUTION_TIERS[selectedEvolution.toTier].prefix}
                  {selectedEvolution.animal.name}
                  {EVOLUTION_TIERS[selectedEvolution.toTier].suffix}
                </h3>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Your {selectedEvolution.animal.name} has evolved! This powerful creature represents your growth in
                  managing {selectedEvolution.mood} emotions. All your previous notes have been preserved.
                </p>
              </div>

              <Button onClick={() => setShowEvolutionDialog(false)} className="w-full">
                Amazing!
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
