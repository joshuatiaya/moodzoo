"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Brain, TrendingUp } from "lucide-react"
import Link from "next/link"

interface MoodEntry {
  mood: string
  animal: string
  timestamp: number
  explanation?: string
}

export function InsightsPreview() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("moodEntries")
    if (stored) {
      const entries = JSON.parse(stored)
      setMoodEntries(entries)
      setHasData(entries.length > 0)
    }
  }, [])

  if (!hasData) {
    return (
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">AI Insights</h3>
          </div>
          <Link href="/insights">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="text-center py-8 space-y-4">
          <div className="text-4xl">🌱</div>
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Start Your Journey</h4>
            <p className="text-sm text-muted-foreground text-pretty">
              Log a few moods to unlock personalized AI insights about your emotional patterns.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const calculateCurrentStreak = () => {
    const sortedEntries = [...moodEntries].sort((a, b) => b.timestamp - a.timestamp)
    let currentStreak = 0

    const today = new Date().setHours(0, 0, 0, 0)
    const yesterday = today - 24 * 60 * 60 * 1000

    if (sortedEntries.length > 0) {
      const lastEntry = new Date(sortedEntries[0].timestamp).setHours(0, 0, 0, 0)
      if (lastEntry === today || lastEntry === yesterday) {
        currentStreak = 1

        for (let i = 1; i < sortedEntries.length; i++) {
          const currentDay = new Date(sortedEntries[i - 1].timestamp).setHours(0, 0, 0, 0)
          const nextDay = new Date(sortedEntries[i].timestamp).setHours(0, 0, 0, 0)

          if (currentDay - nextDay === 24 * 60 * 60 * 1000) {
            currentStreak++
          } else {
            break
          }
        }
      }
    }

    return currentStreak
  }

  const getRecentMoods = () => {
    return moodEntries.slice(-7).map((entry) => entry.animal)
  }

  const currentStreak = calculateCurrentStreak()
  const recentMoods = getRecentMoods()
  const positiveCount = moodEntries.filter((entry) =>
    ["Happy", "Excited", "Grateful", "Calm"].includes(entry.mood),
  ).length
  const positivePercentage = Math.round((positiveCount / moodEntries.length) * 100)

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">AI Insights</h3>
        </div>
        <Link href="/insights">
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-foreground">{currentStreak}-day streak</span>
          </div>
          <Badge variant="secondary">{positivePercentage}% positive moods</Badge>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Latest Insight</h4>
          <p className="text-sm text-muted-foreground">
            {moodEntries.length >= 7
              ? "Great job maintaining consistent mood tracking! This self-awareness is key to emotional wellbeing."
              : `You've logged ${moodEntries.length} mood${moodEntries.length !== 1 ? "s" : ""}. Keep going to unlock deeper insights!`}
          </p>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {recentMoods.map((animal, index) => (
            <div key={index} className="text-center">
              <div className="text-lg">{animal}</div>
              <div className="w-2 h-2 bg-primary rounded-full mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
