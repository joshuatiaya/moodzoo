"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Wind, Gamepad2, Music, Heart } from "lucide-react"
import Link from "next/link"
import { BreathingExercise } from "@/components/breathing-exercise"
import { MiniGame } from "@/components/mini-game"
import React from "react"

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
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [currentSound, setCurrentSound] = useState<OscillatorNode | null>(null)

  useEffect(() => {
    const triggerBreathing = localStorage.getItem("triggerBreathingExercise")
    if (triggerBreathing === "true") {
      setSelectedActivity("breathing")
      localStorage.removeItem("triggerBreathingExercise")
    }

    const handleStartBreathing = () => {
      setSelectedActivity("breathing")
    }

    window.addEventListener("startBreathingExercise", handleStartBreathing)
    return () => window.removeEventListener("startBreathingExercise", handleStartBreathing)
  }, [])

  if (selectedActivity === "breathing") {
    return <BreathingExercise onBack={() => setSelectedActivity(null)} />
  }

  if (selectedActivity === "game") {
    return <MiniGame onBack={() => setSelectedActivity(null)} />
  }

  if (selectedActivity === "sounds") {
    return <NatureSounds onBack={() => setSelectedActivity(null)} />
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

function NatureSounds({ onBack }: { onBack: () => void }) {
  const [selectedSound, setSelectedSound] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const sounds = [
    { id: "forest", name: "Forest Rain", emoji: "🌧️", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/calming-rain-257596-HkKPiCMnwqaXbELXDd5iRwa7EHqlUX.mp3" },
    { id: "ocean", name: "Ocean Waves", emoji: "🌊", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/soothing-ocean-waves-372489-6h2PIUsX1yLkVN7Ef5QwDC2XpV3Ic6.mp3" },
    { id: "birds", name: "Bird Chirping", emoji: "🐦", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eq11433dwac-birds-chirping-9-lTfnlfMFSH9HKfh7lCEs8afTjwidbG.mp3" },
    { id: "stream", name: "Flowing Stream", emoji: "💧", url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/water-stream-river-360596-QuPAmS3eIlIVUH9PXhjLTGZCZNPupI.mp3" },
  ]

  const playSound = (soundId: string) => {
    setSelectedSound(soundId)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const sound = sounds.find((s) => s.id === soundId)
    if (sound) {
      const audio = new Audio(sound.url)
      audioRef.current = audio
      audio.loop = true
      audio.play()
      setIsPlaying(true)
    }
  }

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
    setSelectedSound(null)
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Activities
      </Button>

      <Card className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <Music className="h-16 w-16 mx-auto text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Nature Sounds</h2>
          <p className="text-muted-foreground">Choose a relaxing sound to help you unwind</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {sounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => playSound(sound.id)}
              className={`p-6 rounded-lg border-2 transition-all text-center space-y-2 ${
                selectedSound === sound.id && isPlaying
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary"
              }`}
            >
              <div className="text-4xl">{sound.emoji}</div>
              <p className="font-medium text-foreground">{sound.name}</p>
            </button>
          ))}
        </div>

        {isPlaying && (
          <Button onClick={stopSound} variant="outline" className="w-full bg-transparent">
            Stop Sound
          </Button>
        )}

        <Button onClick={onBack} className="w-full">
          Done Relaxing
        </Button>
      </Card>
    </div>
  )
}
