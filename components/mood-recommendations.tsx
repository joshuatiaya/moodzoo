"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Wind, Smile, RefreshCw } from "lucide-react"

interface MoodRecommendationsProps {
  mood: string
  onStartBreathing: () => void
}

const ANIMAL_JOKES = [
  {
    setup: "Why don't elephants use computers?",
    punchline: "They're afraid of the mouse! 🐘🖱️",
  },
  {
    setup: "What do you call a sleeping bull?",
    punchline: "A bulldozer! 🐂😴",
  },
  {
    setup: "Why don't teddy bears ever order dessert?",
    punchline: "Because they're always stuffed! 🧸🍰",
  },
  {
    setup: "What do you call a fish wearing a crown?",
    punchline: "A king fish! 🐟👑",
  },
  {
    setup: "Why don't cats play poker in the jungle?",
    punchline: "Too many cheetahs! 🐱🐆",
  },
  {
    setup: "What do you call a pig that does karate?",
    punchline: "A pork chop! 🐷🥋",
  },
  {
    setup: "Why do fish live in saltwater?",
    punchline: "Because pepper makes them sneeze! 🐠🧂",
  },
  {
    setup: "What do you call a cow with no legs?",
    punchline: "Ground beef! 🐄",
  },
  {
    setup: "Why don't oysters share?",
    punchline: "Because they're shellfish! 🦪",
  },
  {
    setup: "What do you call a bear with no teeth?",
    punchline: "A gummy bear! 🐻🍬",
  },
  {
    setup: "Why don't penguins like talking to strangers at parties?",
    punchline: "They find it hard to break the ice! 🐧❄️",
  },
  {
    setup: "What do you call a monkey that loves potato chips?",
    punchline: "A chipmunk! 🐒🥔",
  },
]

export function MoodRecommendations({ mood, onStartBreathing }: MoodRecommendationsProps) {
  const [currentJoke, setCurrentJoke] = useState(0)
  const [showPunchline, setShowPunchline] = useState(false)

  const getNextJoke = () => {
    setCurrentJoke((prev) => (prev + 1) % ANIMAL_JOKES.length)
    setShowPunchline(false)
  }

  const joke = ANIMAL_JOKES[currentJoke]

  // Show recommendations for sad mood
  if (mood === "sad") {
    return (
      <Card className="p-6 space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <div className="text-center space-y-2">
          <Heart className="h-8 w-8 mx-auto text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-800">We're here for you 💙</h3>
          <p className="text-blue-700 text-sm">
            It's okay to feel sad sometimes. Here are some things that might help you feel better:
          </p>
        </div>

        <div className="grid gap-4">
          {/* Breathing Exercise Recommendation */}
          <Card className="p-4 bg-white/80 border-blue-100">
            <div className="flex items-start gap-3">
              <Wind className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1 space-y-2">
                <h4 className="font-medium text-blue-800">Try Breathing Exercises</h4>
                <p className="text-sm text-blue-700">
                  Take a few minutes to breathe deeply with your animal friends. It can help calm your mind and reduce
                  stress.
                </p>
                <Button onClick={onStartBreathing} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Wind className="h-4 w-4 mr-2" />
                  Start Breathing Exercise
                </Button>
              </div>
            </div>
          </Card>

          {/* Animal Joke */}
          <Card className="p-4 bg-white/80 border-yellow-100">
            <div className="flex items-start gap-3">
              <Smile className="h-6 w-6 text-yellow-600 mt-1" />
              <div className="flex-1 space-y-3">
                <h4 className="font-medium text-yellow-800">Animal Joke to Brighten Your Day</h4>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-800">{joke.setup}</p>

                  {showPunchline ? (
                    <div className="space-y-2">
                      <p className="text-sm text-yellow-700 font-medium bg-yellow-50 p-2 rounded">{joke.punchline}</p>
                      <Button
                        onClick={getNextJoke}
                        size="sm"
                        variant="outline"
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 bg-transparent"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Another Joke
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowPunchline(true)}
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <Smile className="h-4 w-4 mr-2" />
                      Show Punchline
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center pt-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Remember: Your feelings are valid, and tomorrow is a new day 🌅
          </Badge>
        </div>
      </Card>
    )
  }

  // Show positive reinforcement for other moods
  if (mood === "anxious") {
    return (
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="text-center space-y-2">
          <Wind className="h-6 w-6 mx-auto text-purple-600" />
          <h4 className="font-medium text-purple-800">Feeling Anxious?</h4>
          <p className="text-sm text-purple-700">Try some deep breathing exercises to help calm your mind.</p>
          <Button onClick={onStartBreathing} size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
            <Wind className="h-4 w-4 mr-2" />
            Start Breathing Exercise
          </Button>
        </div>
      </Card>
    )
  }

  if (mood === "angry") {
    return (
      <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
        <div className="text-center space-y-2">
          <Wind className="h-6 w-6 mx-auto text-red-600" />
          <h4 className="font-medium text-red-800">Take a Deep Breath</h4>
          <p className="text-sm text-red-700">
            When we're angry, breathing exercises can help us find our calm center.
          </p>
          <Button onClick={onStartBreathing} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            <Wind className="h-4 w-4 mr-2" />
            Cool Down with Breathing
          </Button>
        </div>
      </Card>
    )
  }

  // For positive moods, show encouragement
  if (["happy", "excited", "grateful"].includes(mood)) {
    return (
      <Card className="p-4 bg-gradient-to-br from-green-50 to-yellow-50 border-green-200">
        <div className="text-center space-y-2">
          <Heart className="h-6 w-6 mx-auto text-green-600" />
          <h4 className="font-medium text-green-800">That's Wonderful!</h4>
          <p className="text-sm text-green-700">
            It's great to see you feeling {mood}! Keep spreading those positive vibes! ✨
          </p>
        </div>
      </Card>
    )
  }

  return null
}
