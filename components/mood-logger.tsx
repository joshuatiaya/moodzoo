"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Crown, Lock } from "lucide-react"
import { usePremiumStatus } from "./premium-system"
import { MoodRecommendations } from "./mood-recommendations"
import { EggIncubator } from "./egg-incubator"

const MOODS = [
  { id: "happy", label: "Happy", animal: "🦁", egg: "🥚", color: "bg-yellow-100 text-yellow-800" },
  { id: "excited", label: "Excited", animal: "🐒", egg: "🥚", color: "bg-orange-100 text-orange-800" },
  { id: "calm", label: "Calm", animal: "🐢", egg: "🥚", color: "bg-green-100 text-green-800" },
  { id: "sad", label: "Sad", animal: "🐧", egg: "🥚", color: "bg-blue-100 text-blue-800" },
  { id: "anxious", label: "Anxious", animal: "🐰", egg: "🥚", color: "bg-purple-100 text-purple-800" },
  { id: "angry", label: "Angry", animal: "🐺", egg: "🥚", color: "bg-red-100 text-red-800" },
  { id: "tired", label: "Tired", animal: "🐨", egg: "🥚", color: "bg-gray-100 text-gray-800" },
  { id: "grateful", label: "Grateful", animal: "🦋", egg: "🥚", color: "bg-pink-100 text-pink-800" },
]

const FREE_DAILY_LIMIT = 5

export function MoodLogger() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [explanation, setExplanation] = useState("")
  const [todayLogged, setTodayLogged] = useState(false)
  const [dailyCount, setDailyCount] = useState(0)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const isPremium = usePremiumStatus()
  const router = useRouter()

  useEffect(() => {
    // Check today's mood count
    const today = new Date().toDateString()
    const existingEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]")
    const todayEntries = existingEntries.filter((entry: any) => entry.date === today)
    setDailyCount(todayEntries.length)
  }, [])

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId)
  }

  const canLogMood = isPremium || dailyCount < FREE_DAILY_LIMIT

  const handleLogMood = () => {
    if (selectedMood && canLogMood) {
      const eggId = Date.now().toString()
      const mood = MOODS.find((m) => m.id === selectedMood)

      const rarityRoll = Math.random()
      let rarity: "common" | "rare" | "legendary" | "mythical" | "godly"
      if (rarityRoll < 0.6) rarity = "common"
      else if (rarityRoll < 0.85) rarity = "rare"
      else if (rarityRoll < 0.95) rarity = "legendary"
      else if (rarityRoll < 0.99) rarity = "mythical"
      else rarity = "godly"

      const egg = {
        id: eggId,
        mood: selectedMood,
        animal: mood?.animal,
        egg: mood?.egg,
        createdAt: Date.now(),
        hatchTime: isPremium ? 5 * 60 * 1000 : 10 * 60 * 1000,
        isPremium: isPremium,
        rarity: rarity,
        explanation: explanation,
      }

      // Get existing eggs from localStorage
      const existingEggs = JSON.parse(localStorage.getItem("eggs") || "[]")
      existingEggs.push(egg)
      localStorage.setItem("eggs", JSON.stringify(existingEggs))

      const moodEntry = {
        id: eggId,
        mood: selectedMood,
        explanation: explanation,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString(),
      }
      const existingEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]")
      existingEntries.push(moodEntry)
      localStorage.setItem("moodEntries", JSON.stringify(existingEntries))

      setTodayLogged(true)
      setDailyCount((prev) => prev + 1)
      setShowRecommendations(true)
    }
  }

  const handleStartBreathing = () => {
    localStorage.setItem("triggerBreathingExercise", "true")
    router.push("/activities")
  }

  if (todayLogged) {
    const mood = MOODS.find((m) => m.id === selectedMood)
    return (
      <div className="space-y-4">
        <Card className="p-6 text-center space-y-4">
          <div className="text-6xl">🥚</div>
          <h3 className="text-xl font-semibold text-foreground">Egg Created!</h3>
          <p className="text-muted-foreground">
            Your egg is incubating. It will hatch in {isPremium ? "5 minutes" : "10 minutes"}!
          </p>
          <Badge className={mood?.color}>{mood?.label}</Badge>
          {explanation && (
            <div className="p-3 bg-muted rounded-lg text-left">
              <p className="text-sm text-muted-foreground italic">"{explanation}"</p>
            </div>
          )}

          {!isPremium && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-yellow-700 text-sm">
                <span>
                  {dailyCount}/{FREE_DAILY_LIMIT} daily moods used
                </span>
                {dailyCount >= FREE_DAILY_LIMIT && <Lock className="h-4 w-4" />}
              </div>
            </div>
          )}
        </Card>

        {showRecommendations && selectedMood && (
          <MoodRecommendations mood={selectedMood} onStartBreathing={handleStartBreathing} />
        )}

        <EggIncubator />
      </div>
    )
  }

  if (!canLogMood) {
    return (
      <Card className="p-6 text-center space-y-4 border-2 border-dashed border-yellow-300">
        <Lock className="h-12 w-12 mx-auto text-yellow-600" />
        <h3 className="text-xl font-semibold text-yellow-800">Daily Limit Reached</h3>
        <p className="text-yellow-700">
          You've logged {FREE_DAILY_LIMIT} moods today. Upgrade to Premium for unlimited mood logging!
        </p>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">How are you feeling?</h2>
        <p className="text-muted-foreground">Choose your mood to create an egg</p>

        {!isPremium && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>
              {dailyCount}/{FREE_DAILY_LIMIT} daily moods used
            </span>
            <Crown className="h-4 w-4 text-yellow-600" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            className={`mood-card p-4 text-center space-y-2 rounded-lg transition-all ${
              selectedMood === mood.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
          >
            <div className="text-3xl">{mood.egg}</div>
            <div className="text-sm font-medium text-foreground">{mood.label}</div>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="explanation">Why are you feeling this way? (optional)</Label>
            <Textarea
              id="explanation"
              placeholder="Share what's making you feel this way..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <Button onClick={handleLogMood} className="w-full" size="lg">
            Create Egg
          </Button>
        </div>
      )}
    </Card>
  )
}
