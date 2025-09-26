"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface MoodEntry {
  mood: string
  animal: string
  timestamp: number
  explanation?: string
}

export function InsightsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<"week" | "month" | "year">("week")
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Home
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground text-balance">AI Insights</h1>
          <p className="text-muted-foreground text-pretty">Discover patterns in your emotional journey</p>
        </div>

        <Card className="p-12 text-center space-y-6">
          <div className="text-6xl">🌱</div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Your Insights Garden is Growing</h3>
            <p className="text-muted-foreground text-pretty max-w-md mx-auto">
              Start logging your moods to unlock personalized AI insights about your emotional patterns and wellbeing
              journey.
            </p>
          </div>
          <Link href="/">
            <Button className="mt-4">🌱 Log Your First Mood</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const calculateInsights = () => {
    const now = Date.now()
    const oneWeek = 7 * 24 * 60 * 60 * 1000
    const oneMonth = 30 * 24 * 60 * 60 * 1000

    let timeframeEntries = moodEntries
    if (selectedTimeframe === "week") {
      timeframeEntries = moodEntries.filter((entry) => now - entry.timestamp < oneWeek)
    } else if (selectedTimeframe === "month") {
      timeframeEntries = moodEntries.filter((entry) => now - entry.timestamp < oneMonth)
    }

    // Calculate mood distribution
    const moodCounts: { [key: string]: number } = {}
    timeframeEntries.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
    })

    const moodDistribution = Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / timeframeEntries.length) * 100),
        color: getMoodColor(mood),
      }))
      .sort((a, b) => b.count - a.count)

    // Calculate streaks
    const sortedEntries = [...moodEntries].sort((a, b) => b.timestamp - a.timestamp)
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    const today = new Date().setHours(0, 0, 0, 0)
    const yesterday = today - 24 * 60 * 60 * 1000

    // Check if logged today or yesterday for current streak
    if (sortedEntries.length > 0) {
      const lastEntry = new Date(sortedEntries[0].timestamp).setHours(0, 0, 0, 0)
      if (lastEntry === today || lastEntry === yesterday) {
        currentStreak = 1

        // Count consecutive days
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

    // Calculate longest streak
    for (let i = 0; i < sortedEntries.length; i++) {
      tempStreak = 1
      for (let j = i + 1; j < sortedEntries.length; j++) {
        const currentDay = new Date(sortedEntries[j - 1].timestamp).setHours(0, 0, 0, 0)
        const nextDay = new Date(sortedEntries[j].timestamp).setHours(0, 0, 0, 0)

        if (currentDay - nextDay === 24 * 60 * 60 * 1000) {
          tempStreak++
        } else {
          break
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak)
    }

    const thisMonthEntries = moodEntries.filter((entry) => now - entry.timestamp < oneMonth)

    return {
      moodDistribution,
      streaks: {
        current: currentStreak,
        longest: longestStreak,
        thisMonth: thisMonthEntries.length,
      },
      weeklyMoods: getWeeklyMoods(timeframeEntries),
    }
  }

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      Happy: "bg-yellow-500",
      Excited: "bg-orange-500",
      Grateful: "bg-pink-500",
      Calm: "bg-green-500",
      Anxious: "bg-purple-500",
      Sad: "bg-blue-500",
      Angry: "bg-red-500",
      Overwhelmed: "bg-gray-500",
    }
    return colors[mood] || "bg-gray-400"
  }

  const getWeeklyMoods = (entries: MoodEntry[]) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weeklyMoods = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayName = days[date.getDay()]

      const dayEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.timestamp)
        return entryDate.toDateString() === date.toDateString()
      })

      if (dayEntries.length > 0) {
        const latestEntry = dayEntries[dayEntries.length - 1]
        weeklyMoods.push({
          day: dayName,
          mood: latestEntry.mood,
          animal: latestEntry.animal,
        })
      } else {
        weeklyMoods.push({
          day: dayName,
          mood: "",
          animal: "🌱",
        })
      }
    }

    return weeklyMoods
  }

  const insights = calculateInsights()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">
            ← Home
          </Button>
        </Link>
        <div className="flex gap-2">
          {(["week", "month", "year"] as const).map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground text-balance">AI Insights</h1>
        <p className="text-muted-foreground text-pretty">Discover patterns in your emotional journey</p>
      </div>

      {/* Mood Streak */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h3 className="font-semibold text-foreground">Mood Tracking Streak</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{insights.streaks.current}</div>
            <div className="text-sm text-muted-foreground">Current</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{insights.streaks.longest}</div>
            <div className="text-sm text-muted-foreground">Longest</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{insights.streaks.thisMonth}</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </div>
        </div>
      </Card>

      {/* Weekly Mood Timeline */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h3 className="font-semibold text-foreground">This Week's Journey</h3>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {insights.weeklyMoods.map((day, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="text-xs text-muted-foreground">{day.day}</div>
              <div className="text-2xl">{day.animal}</div>
              <div className="text-xs font-medium text-foreground">{day.mood || "Not logged"}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Mood Distribution */}
      {insights.moodDistribution.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <h3 className="font-semibold text-foreground">Mood Distribution</h3>
          </div>
          <div className="space-y-3">
            {insights.moodDistribution.map((mood, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{mood.mood}</span>
                  <span className="text-sm text-muted-foreground">
                    {mood.count} times ({mood.percentage}%)
                  </span>
                </div>
                <Progress value={mood.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Simple AI Insights */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧠</span>
          <h3 className="font-semibold text-foreground">AI Insights</h3>
        </div>
        <div className="space-y-4">
          {moodEntries.length >= 7 ? (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Great Progress!</h4>
                <Badge variant="secondary">High confidence</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                You've been consistently tracking your moods. This self-awareness is a key step in emotional wellbeing.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium text-foreground">Building Your Pattern</h4>
              <p className="text-sm text-muted-foreground">
                Keep logging your moods to unlock personalized insights about your emotional patterns.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Mood Goals */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-foreground">This Month's Goals</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Log mood daily</span>
              <span className="text-sm text-muted-foreground">{insights.streaks.thisMonth}/30 days</span>
            </div>
            <Progress value={Math.min((insights.streaks.thisMonth / 30) * 100, 100)} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  )
}
