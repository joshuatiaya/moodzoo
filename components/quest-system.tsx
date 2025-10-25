"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle } from "lucide-react"

interface Quest {
  id: string
  title: string
  description: string
  reward: string
  rewardType: "skin"
  completed: boolean
  completedAt?: number
}

const QUESTS: Quest[] = [
  {
    id: "first-mood",
    title: "First Feeling",
    description: "Log your first mood",
    reward: "Starter Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "mood-streak-3",
    title: "Consistent Tracker",
    description: "Log moods for 3 consecutive days",
    reward: "Golden Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "mood-streak-7",
    title: "Weekly Warrior",
    description: "Log moods for 7 consecutive days",
    reward: "Royal Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "breathing-5",
    title: "Calm Master",
    description: "Complete 5 breathing exercises",
    reward: "Zen Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "coloring-3",
    title: "Artist",
    description: "Complete 3 coloring activities",
    reward: "Artist Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "game-5",
    title: "Game Master",
    description: "Play the animal game 5 times",
    reward: "Game Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "all-moods",
    title: "Mood Explorer",
    description: "Experience all 8 different moods",
    reward: "Rainbow Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "evolution",
    title: "Evolution Master",
    description: "Evolve your first animal",
    reward: "Evolution Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "premium-user",
    title: "Premium Member",
    description: "Upgrade to Premium",
    reward: "Premium Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "legendary-egg",
    title: "Legendary Finder",
    description: "Hatch a legendary or higher rarity egg",
    reward: "Legendary Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "collection-10",
    title: "Zoo Collector",
    description: "Collect 10 different animals",
    reward: "Collector Skin",
    rewardType: "skin",
    completed: false,
  },
  {
    id: "perfect-week",
    title: "Perfect Week",
    description: "Log moods every day for a week",
    reward: "Perfect Skin",
    rewardType: "skin",
    completed: false,
  },
]

const SKIN_COLORS: Record<string, string> = {
  "first-mood": "bg-blue-500",
  "mood-streak-3": "bg-yellow-500",
  "mood-streak-7": "bg-purple-500",
  "breathing-5": "bg-green-500",
  "coloring-3": "bg-pink-500",
  "game-5": "bg-orange-500",
  "all-moods": "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500",
  evolution: "bg-indigo-500",
  "premium-user": "bg-amber-500",
  "legendary-egg": "bg-rose-500",
  "collection-10": "bg-teal-500",
  "perfect-week": "bg-cyan-500",
}

export function QuestSystem() {
  const [completedQuests, setCompletedQuests] = useState<string[]>([])

  useEffect(() => {
    // Load completed quests from localStorage
    const savedQuests = JSON.parse(localStorage.getItem("completedQuests") || "[]")
    setCompletedQuests(savedQuests)

    // Check quest completion
    checkQuestCompletion()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      checkQuestCompletion()
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [completedQuests])

  const checkQuestCompletion = () => {
    const moodEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]")
    const eggs = JSON.parse(localStorage.getItem("eggs") || "[]")
    const animals = JSON.parse(localStorage.getItem("animals") || "[]")
    const savedQuests = JSON.parse(localStorage.getItem("completedQuests") || "[]")
    const newCompletedQuests = [...savedQuests]

    if ((moodEntries.length > 0 || eggs.length > 0) && !savedQuests.includes("first-mood")) {
      newCompletedQuests.push("first-mood")
    }

    const allMoods = new Set([...moodEntries.map((e: any) => e.mood), ...eggs.map((e: any) => e.mood)])
    if (allMoods.size === 8 && !savedQuests.includes("all-moods")) {
      newCompletedQuests.push("all-moods")
    }

    if (eggs.some((e: any) => e.rarity === "legendary") && !savedQuests.includes("legendary-egg")) {
      newCompletedQuests.push("legendary-egg")
    }

    if (animals.length >= 10 && !savedQuests.includes("collection-10")) {
      newCompletedQuests.push("collection-10")
    }

    const daysInWeek = 7
    const lastWeekMoodEntries = moodEntries.slice(-daysInWeek)
    if (lastWeekMoodEntries.length === daysInWeek && !savedQuests.includes("perfect-week")) {
      newCompletedQuests.push("perfect-week")
    }

    if (newCompletedQuests.length > savedQuests.length) {
      localStorage.setItem("completedQuests", JSON.stringify(newCompletedQuests))
      setCompletedQuests(newCompletedQuests)
    }
  }

  const getCompletedSkins = () => {
    return completedQuests.length
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Quests</h3>
          <Badge variant="secondary">
            {completedQuests.length}/{QUESTS.length} Completed
          </Badge>
        </div>

        <div className="space-y-3">
          {QUESTS.map((quest) => {
            const isCompleted = completedQuests.includes(quest.id)
            return (
              <div
                key={quest.id}
                className={`p-4 rounded-lg border-2 ${
                  isCompleted ? "bg-green-50 border-green-200" : "bg-muted border-muted"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${isCompleted ? "text-green-800" : "text-foreground"}`}>
                        {quest.title}
                      </h4>
                      {isCompleted && <Badge className="bg-green-600 text-white text-xs">Completed</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{quest.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-6 h-6 rounded-full ${SKIN_COLORS[quest.id] || "bg-gray-500"}`}></div>
                      <span className="text-sm font-medium text-foreground">{quest.reward}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="text-center space-y-3">
          <div className="text-4xl">🎨</div>
          <h3 className="font-semibold text-foreground">Skins Collected</h3>
          <p className="text-2xl font-bold text-purple-600">{getCompletedSkins()}</p>
          <p className="text-sm text-muted-foreground">Complete quests to earn cosmetic skins for your animals!</p>
        </div>
      </Card>
    </div>
  )
}
