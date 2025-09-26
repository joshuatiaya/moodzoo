"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Info, Heart, MessageSquare, Calendar, Crown } from "lucide-react"
import Link from "next/link"
import { EvolutionSystem } from "./evolution-system"
import { usePremiumStatus } from "./premium-system"

const HABITATS = [
  {
    id: "savanna",
    name: "Sunny Savanna",
    description: "Where happy and excited animals roam free",
    moods: ["Happy", "Excited", "Confident"],
    background: "bg-gradient-to-b from-yellow-200 to-orange-200",
    ground: "bg-yellow-600",
    premium: false,
  },
  {
    id: "forest",
    name: "Peaceful Forest",
    description: "A calm retreat for gentle souls",
    moods: ["Calm", "Grateful", "Content"],
    background: "bg-gradient-to-b from-green-200 to-green-300",
    ground: "bg-green-700",
    premium: false,
  },
  {
    id: "arctic",
    name: "Cool Arctic",
    description: "A quiet space for reflection",
    moods: ["Sad", "Lonely"],
    background: "bg-gradient-to-b from-blue-200 to-blue-300",
    ground: "bg-blue-600",
    premium: false,
  },
  {
    id: "burrow",
    name: "Cozy Burrow",
    description: "Safe spaces for anxious moments",
    moods: ["Anxious", "Tired", "Angry"],
    background: "bg-gradient-to-b from-purple-200 to-purple-300",
    ground: "bg-purple-600",
    premium: false,
  },
  {
    id: "mystic-garden",
    name: "Mystic Garden",
    description: "A magical realm for evolved souls",
    moods: ["Happy", "Grateful", "Calm"],
    background: "bg-gradient-to-b from-pink-200 via-purple-200 to-indigo-200",
    ground: "bg-gradient-to-r from-pink-600 to-purple-600",
    premium: true,
  },
  {
    id: "crystal-cave",
    name: "Crystal Cave",
    description: "Where legendary animals gather",
    moods: ["Excited", "Anxious", "Angry"],
    background: "bg-gradient-to-b from-cyan-200 via-blue-200 to-indigo-200",
    ground: "bg-gradient-to-r from-cyan-600 to-blue-600",
    premium: true,
  },
  {
    id: "sky-palace",
    name: "Sky Palace",
    description: "The ultimate sanctuary in the clouds",
    moods: ["Sad", "Tired"],
    background: "bg-gradient-to-b from-white via-blue-100 to-purple-100",
    ground: "bg-gradient-to-r from-blue-500 to-purple-500",
    premium: true,
  },
]

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

export function ZooHabitat() {
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null)
  const [moodEntries, setMoodEntries] = useState<any[]>([])
  const [showExplanations, setShowExplanations] = useState(false)
  const [evolutions, setEvolutions] = useState<any>({})
  const [refreshKey, setRefreshKey] = useState(0)
  const isPremium = usePremiumStatus()

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem("moodEntries") || "[]")
    const savedEvolutions = JSON.parse(localStorage.getItem("animalEvolutions") || "{}")
    setMoodEntries(entries)
    setEvolutions(savedEvolutions)
  }, [refreshKey])

  const getAnimalsForHabitat = (habitat: any) => {
    const animals: any[] = []

    habitat.moods.forEach((moodLabel: string) => {
      const mood = MOODS.find((m) => m.label === moodLabel)
      if (!mood) return

      const basicCount = moodEntries.filter((entry) => entry.mood === mood.id).length

      const moodEvolutions = evolutions[mood.id] || {}

      for (let tier = 1; tier <= 4; tier++) {
        let count = 0
        if (tier === 1) {
          count = basicCount
        } else {
          count = moodEvolutions[tier]?.count || 0
        }

        if (count > 0) {
          const evolvedAnimal = EVOLVED_ANIMALS[mood.id as keyof typeof EVOLVED_ANIMALS]
          if (evolvedAnimal) {
            const animalData = evolvedAnimal[tier as keyof typeof evolvedAnimal]

            const lastEntry = moodEntries
              .filter((entry) => entry.mood === mood.id)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]

            let lastSeen = "Never"
            if (lastEntry) {
              const lastSeenDate = new Date(lastEntry.timestamp)
              const today = new Date()
              const diffTime = Math.abs(today.getTime() - lastSeenDate.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

              lastSeen = "Today"
              if (diffDays === 1) lastSeen = "Yesterday"
              else if (diffDays > 1) lastSeen = `${diffDays} days ago`
            }

            animals.push({
              emoji: animalData.emoji,
              mood: animalData.name,
              count,
              lastSeen,
              tier,
              originalMood: mood.label,
            })
          }
        }
      }
    })

    return animals.sort((a, b) => b.tier - a.tier)
  }

  const getExplanationsForMood = (moodLabel: string) => {
    const moodId = MOODS.find((m) => m.label === moodLabel)?.id
    if (!moodId) return []

    const basicExplanations = moodEntries
      .filter((entry) => entry.mood === moodId && entry.explanation)
      .map((entry) => ({
        explanation: entry.explanation,
        timestamp: entry.timestamp,
        source: "basic",
      }))

    // Get explanations from evolved animals
    const evolvedExplanations: any[] = []
    const moodEvolutions = evolutions[moodId] || {}

    Object.values(moodEvolutions).forEach((evolution: any) => {
      if (evolution.notes) {
        evolution.notes.forEach((note: any) => {
          evolvedExplanations.push({
            explanation: note.explanation,
            timestamp: note.timestamp,
            source: "evolved",
          })
        })
      }
    })

    // Combine and sort by timestamp
    return [...basicExplanations, ...evolvedExplanations].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  }

  const handleAnimalClick = (animal: any) => {
    setSelectedAnimal(animal)
    setShowExplanations(true)
  }

  const totalAnimals = moodEntries.length

  const handleEvolutionComplete = () => {
    setRefreshKey((prev) => prev + 1)
  }

  if (selectedAnimal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedAnimal(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Zoo
          </Button>
        </div>

        <Card className="p-8 text-center space-y-6">
          <div className="text-8xl">{selectedAnimal.emoji}</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">{selectedAnimal.mood} Animal</h2>
            <Badge variant="secondary">Population: {selectedAnimal.count}</Badge>
          </div>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Last seen: {selectedAnimal.lastSeen}</span>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                This animal represents your {selectedAnimal.originalMood.toLowerCase()} moments. Each time you log this
                mood, another one joins your zoo!
              </p>
            </div>
          </div>
        </Card>

        <Dialog open={showExplanations} onOpenChange={setShowExplanations}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="text-3xl">{selectedAnimal?.emoji}</span>
                {selectedAnimal?.mood} Moments
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4" />
                Population: {selectedAnimal?.count}
              </div>

              {(() => {
                const explanations = getExplanationsForMood(selectedAnimal?.originalMood)
                if (explanations.length === 0) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No explanations yet for this mood.</p>
                      <p className="text-sm">Add notes when logging your mood!</p>
                    </div>
                  )
                }

                return (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {explanations.map((entry, index) => (
                      <div key={entry.id} className="p-3 bg-muted rounded-lg space-y-2">
                        <p className="text-sm italic">"{entry.explanation}"</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (selectedHabitat) {
    const habitat = HABITATS.find((h) => h.id === selectedHabitat)
    if (!habitat) return null

    const habitatAnimals = getAnimalsForHabitat(habitat)

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedHabitat(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Zoo
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className={`${habitat.background} p-6 text-center space-y-4`}>
            <h2 className="text-2xl font-bold text-foreground">{habitat.name}</h2>
            <p className="text-muted-foreground">{habitat.description}</p>
          </div>

          <div className="relative">
            <div className="h-8 bg-gradient-to-b from-green-400 to-green-500 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-500 to-green-400"></div>
            </div>

            <div className={`${habitat.ground} p-6 space-y-4`}>
              {habitatAnimals.length === 0 ? (
                <div className="text-center py-8 text-white/70">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="text-lg">This habitat is waiting for its first resident!</p>
                  <p className="text-sm">Log moods to discover animals that belong here.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {habitatAnimals.map((animal, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnimalClick(animal)}
                      className="bg-black/20 rounded-lg p-4 flex items-center gap-4 hover:bg-black/30 transition-colors"
                    >
                      <div className="text-4xl">{animal.emoji}</div>
                      <div className="flex-1 text-left">
                        <div className="text-white font-medium">{animal.mood}</div>
                        <div className="text-white/70 text-sm">Population: {animal.count}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-white/50" />
                        <div className="text-white/50 text-xs">{animal.lastSeen}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        <Dialog open={showExplanations} onOpenChange={setShowExplanations}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="text-3xl">{selectedAnimal?.emoji}</span>
                {selectedAnimal?.mood} Moments
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4" />
                Population: {selectedAnimal?.count}
              </div>

              {(() => {
                const explanations = getExplanationsForMood(selectedAnimal?.originalMood)
                if (explanations.length === 0) {
                  return (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No explanations yet for this mood.</p>
                      <p className="text-sm">Add notes when logging your mood!</p>
                    </div>
                  )
                }

                return (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {explanations.map((entry, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg space-y-2">
                        <p className="text-sm italic">"{entry.explanation}"</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(entry.timestamp).toLocaleDateString()} at{" "}
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Home
          </Button>
        </Link>
        <Badge variant="outline">{totalAnimals} Animals</Badge>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground text-balance">Your Personal Zoo</h1>
        <p className="text-muted-foreground text-pretty">Explore different habitats where your mood animals live</p>
      </div>

      {moodEntries.length === 0 ? (
        <Card className="p-8 text-center space-y-6">
          <div className="text-8xl">🌿</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Your Zoo Awaits</h2>
            <p className="text-muted-foreground">
              Start logging your moods to discover amazing animals that will populate your personal zoo!
            </p>
          </div>
          <Link href="/">
            <Button>Log Your First Mood</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {HABITATS.map((habitat) => {
            if (habitat.premium && !isPremium) {
              return (
                <Card key={habitat.id} className="overflow-hidden border-2 border-dashed border-yellow-300">
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        <div>
                          <h3 className="font-semibold text-yellow-800">{habitat.name}</h3>
                          <p className="text-sm text-yellow-700">{habitat.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-600 text-white">Premium</Badge>
                    </div>
                    <div className="mt-3 text-center">
                      <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Unlock with Premium
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            }

            const habitatAnimals = getAnimalsForHabitat(habitat)
            const animalCount = habitatAnimals.reduce((sum, animal) => sum + animal.count, 0)

            return (
              <Card key={habitat.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <button onClick={() => setSelectedHabitat(habitat.id)} className="w-full text-left">
                  <div className={`${habitat.background} p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {habitat.premium && <Crown className="h-4 w-4 text-yellow-600" />}
                        <div>
                          <h3 className="font-semibold text-foreground">{habitat.name}</h3>
                          <p className="text-sm text-muted-foreground">{habitat.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {habitat.premium && <Badge className="bg-yellow-600 text-white text-xs">Premium</Badge>}
                        <Badge variant="secondary">{animalCount}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-card">
                    {habitatAnimals.length === 0 ? (
                      <div className="text-center text-muted-foreground text-sm py-2">
                        No animals yet - log moods to discover them!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {habitatAnimals.slice(0, 4).map((animal, index) => (
                          <div key={index} className="text-2xl">
                            {animal.emoji}
                          </div>
                        ))}
                        {habitatAnimals.length > 4 && (
                          <div className="text-sm text-muted-foreground">+{habitatAnimals.length - 4} more</div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="p-6 text-center space-y-4">
        <Info className="h-8 w-8 mx-auto text-muted-foreground" />
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Keep Growing Your Zoo</h3>
          <p className="text-sm text-muted-foreground">
            Log your moods daily to discover new animals and expand your habitats
          </p>
        </div>
      </Card>

      <EvolutionSystem onEvolutionComplete={handleEvolutionComplete} />
    </div>
  )
}
