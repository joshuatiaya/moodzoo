"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wind, Gamepad2, Palette, Music, Heart } from "lucide-react"
import Link from "next/link"
import { BreathingExercise } from "@/components/breathing-exercise"
import { ColoringActivity } from "@/components/coloring-activity"
import { MiniGame } from "@/components/mini-game"

const ACTIVITIES = [
  {
    id: "breathing",
    title: "Breathing Garden",
    description: "Guided breathing with your animal friends",
    icon: Wind,
    color: "bg-blue-100 text-blue-800",
    duration: "3-5 min",
    mood: "Anxious, Stressed",
  },
  {
    id: "coloring",
    title: "Animal Coloring",
    description: "Color peaceful scenes with your zoo animals",
    icon: Palette,
    color: "bg-purple-100 text-purple-800",
    duration: "5-10 min",
    mood: "Sad, Tired",
  },
  {
    id: "game",
    title: "Feed the Animals",
    description: "A gentle matching game with your zoo friends",
    icon: Gamepad2,
    color: "bg-green-100 text-green-800",
    duration: "3-7 min",
    mood: "Bored, Restless",
  },
  {
    id: "sounds",
    title: "Nature Sounds",
    description: "Relaxing sounds from different habitats",
    icon: Music,
    color: "bg-yellow-100 text-yellow-800",
    duration: "1-15 min",
    mood: "Any",
  },
]

export function ActivitiesHub() {
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null)

  useEffect(() => {
    const triggerBreathing = localStorage.getItem("triggerBreathingExercise")
    if (triggerBreathing === "true") {
      setSelectedActivity("breathing")
      // Clear the trigger
      localStorage.removeItem("triggerBreathingExercise")
    }

    // Keep the existing event listener for other potential triggers
    const handleStartBreathing = () => {
      setSelectedActivity("breathing")
    }

    window.addEventListener("startBreathingExercise", handleStartBreathing)
    return () => window.removeEventListener("startBreathingExercise", handleStartBreathing)
  }, [])

  if (selectedActivity === "breathing") {
    return <BreathingExercise onBack={() => setSelectedActivity(null)} />
  }

  if (selectedActivity === "coloring") {
    return <ColoringActivity onBack={() => setSelectedActivity(null)} />
  }

  if (selectedActivity === "game") {
    return <MiniGame onBack={() => setSelectedActivity(null)} />
  }

  if (selectedActivity === "sounds") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedActivity(null)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Activities
        </Button>
        <Card className="p-8 text-center space-y-6">
          <Music className="h-16 w-16 mx-auto text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Nature Sounds</h2>
          <p className="text-muted-foreground">Coming soon! Relaxing sounds from your favorite habitats.</p>
        </Card>
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
        <Badge variant="outline">
          <Heart className="h-3 w-3 mr-1" />
          Wellness
        </Badge>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground text-balance">Stress Relief Activities</h1>
        <p className="text-muted-foreground text-pretty">
          Take a moment to care for yourself with these calming activities
        </p>
      </div>

      <div className="space-y-4">
        {ACTIVITIES.map((activity) => {
          const IconComponent = activity.icon
          return (
            <Card key={activity.id} className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
              <button onClick={() => setSelectedActivity(activity.id)} className="w-full text-left space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">{activity.title}</h3>
                      <Badge className={activity.color}>{activity.duration}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Best for:</span>
                      <span className="text-xs font-medium text-foreground">{activity.mood}</span>
                    </div>
                  </div>
                </div>
              </button>
            </Card>
          )
        })}
      </div>

      <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <div className="text-center space-y-4">
          <div className="text-4xl">🌱</div>
          <h3 className="font-semibold text-foreground">Daily Wellness Tip</h3>
          <p className="text-sm text-muted-foreground">
            Taking just 3 minutes for breathing exercises can reduce stress hormones by up to 25%. Your zoo animals are
            cheering you on!
          </p>
        </div>
      </Card>
    </div>
  )
}
