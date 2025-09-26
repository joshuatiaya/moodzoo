"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Crown } from "lucide-react"
import { usePremiumStatus } from "./premium-system"
import Link from "next/link"

const ACHIEVEMENT_DEFINITIONS = [
  {
    id: "first-mood",
    title: "First Steps",
    description: "Logged your first mood",
    icon: "🌱",
    requirement: 1,
    type: "moods",
  },
  {
    id: "week-streak",
    title: "Week Warrior",
    description: "7-day logging streak",
    icon: "🔥",
    requirement: 7,
    type: "streak",
  },
  {
    id: "zoo-keeper",
    title: "Zoo Keeper",
    description: "Collected 10 different animals",
    icon: "🦁",
    requirement: 10,
    type: "animals",
  },
  {
    id: "mindful-master",
    title: "Mindful Master",
    description: "Completed 5 breathing exercises",
    icon: "🧘",
    requirement: 5,
    type: "breathing",
  },
  {
    id: "artist",
    title: "Creative Soul",
    description: "Finished 3 coloring activities",
    icon: "🎨",
    requirement: 3,
    type: "coloring",
  },
  {
    id: "month-streak",
    title: "Monthly Champion",
    description: "30-day logging streak",
    icon: "👑",
    requirement: 30,
    type: "streak",
  },
  {
    id: "premium-member",
    title: "Premium Explorer",
    description: "Unlocked premium features",
    icon: "👑",
    requirement: 1,
    type: "premium",
  },
  {
    id: "evolution-master",
    title: "Evolution Master",
    description: "Evolved 5 animals with premium speed",
    icon: "⚡",
    requirement: 5,
    type: "premium-evolutions",
  },
]

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "settings">("overview")
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [userStats, setUserStats] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const isPremium = usePremiumStatus()

  useEffect(() => {
    const moodEntries = JSON.parse(localStorage.getItem("moodEntries") || "[]")
    const activityStats = JSON.parse(localStorage.getItem("activityStats") || "{}")
    const evolutions = JSON.parse(localStorage.getItem("animalEvolutions") || "{}")

    if (moodEntries.length === 0) {
      setUserStats(null)
      setAchievements([])
      return
    }

    const uniqueAnimals = [...new Set(moodEntries.map((entry: any) => entry.animal))]
    const currentStreak = calculateCurrentStreak(moodEntries)
    const longestStreak = calculateLongestStreak(moodEntries)
    const daysActive = [...new Set(moodEntries.map((entry: any) => entry.date.split("T")[0]))].length

    const premiumEvolutions = Object.values(evolutions).reduce((total: number, moodEvolutions: any) => {
      return (
        total +
        Object.values(moodEvolutions).reduce((moodTotal: number, evolution: any) => {
          return moodTotal + (evolution.count || 0)
        }, 0)
      )
    }, 0)

    const stats = {
      totalMoods: moodEntries.length,
      daysActive,
      favoriteAnimal: getMostFrequentAnimal(moodEntries),
      totalAnimals: uniqueAnimals.length,
      activitiesCompleted: (activityStats.breathing || 0) + (activityStats.coloring || 0) + (activityStats.games || 0),
      currentStreak,
      longestStreak,
      joinDate: getJoinDate(moodEntries),
      premiumEvolutions,
    }

    setUserStats(stats)

    const calculatedAchievements = ACHIEVEMENT_DEFINITIONS.map((def) => {
      let progress = 0
      let unlocked = false

      switch (def.type) {
        case "moods":
          progress = moodEntries.length
          break
        case "streak":
          progress = currentStreak
          break
        case "animals":
          progress = uniqueAnimals.length
          break
        case "breathing":
          progress = activityStats.breathing || 0
          break
        case "coloring":
          progress = activityStats.coloring || 0
          break
        case "premium":
          progress = isPremium ? 1 : 0
          break
        case "premium-evolutions":
          progress = premiumEvolutions
          break
      }

      unlocked = progress >= def.requirement

      return {
        ...def,
        progress,
        unlocked,
        date: unlocked ? getAchievementDate(def.id, moodEntries) : null,
      }
    })

    setAchievements(calculatedAchievements)
  }, [isPremium])

  const calculateCurrentStreak = (entries: any[]) => {
    if (entries.length === 0) return 0

    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let streak = 0
    let currentDate = new Date()

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date).toDateString()
      const checkDate = currentDate.toDateString()

      if (entryDate === checkDate || (i === 0 && entryDate === yesterday && checkDate === today)) {
        streak++
        currentDate = new Date(currentDate.getTime() - 86400000)
      } else {
        break
      }
    }

    return streak
  }

  const calculateLongestStreak = (entries: any[]) => {
    if (entries.length === 0) return 0

    const dates = [...new Set(entries.map((entry) => entry.date.split("T")[0]))].sort()
    let longestStreak = 1
    let currentStreak = 1

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1])
      const currDate = new Date(dates[i])
      const diffTime = currDate.getTime() - prevDate.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      if (diffDays === 1) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 1
      }
    }

    return longestStreak
  }

  const getMostFrequentAnimal = (entries: any[]) => {
    const animalCounts = entries.reduce((acc: any, entry: any) => {
      acc[entry.animal] = (acc[entry.animal] || 0) + 1
      return acc
    }, {})

    return Object.keys(animalCounts).reduce((a, b) => (animalCounts[a] > animalCounts[b] ? a : b), "🦁")
  }

  const getJoinDate = (entries: any[]) => {
    if (entries.length === 0) return "Today"
    const firstEntry = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    const daysSince = Math.floor((Date.now() - new Date(firstEntry.date).getTime()) / (1000 * 60 * 60 * 24))

    if (daysSince === 0) return "Today"
    if (daysSince === 1) return "1 day ago"
    if (daysSince < 7) return `${daysSince} days ago`
    if (daysSince < 14) return "1 week ago"
    if (daysSince < 30) return `${Math.floor(daysSince / 7)} weeks ago`
    return `${Math.floor(daysSince / 30)} months ago`
  }

  const getAchievementDate = (achievementId: string, entries: any[]) => {
    return "Recently"
  }

  const unlockedAchievements = achievements.filter((a) => a.unlocked).length
  const totalAchievements = achievements.length

  if (!userStats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Home
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setActiveTab("settings")}>
            ⚙️
          </Button>
        </div>

        <div className="text-center space-y-6 py-12">
          <div className="text-6xl">🌱</div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Welcome to Your Profile!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your personal stats, achievements, and progress will appear here once you start logging your moods and
              exploring MoodZoo.
            </p>
          </div>
          <Link href="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">🌱 Start Your Journey</Button>
          </Link>
        </div>

        {activeTab === "settings" && (
          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-foreground">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🔔</span>
                    <span className="font-medium text-foreground">Daily Reminders</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Get reminded to log your mood</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🌙</span>
                    <span className="font-medium text-foreground">Dark Mode</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </Card>
        )}
      </div>
    )
  }

  if (activeTab === "achievements") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setActiveTab("overview")}>
            ← Back to Profile
          </Button>
          <Badge variant="outline">
            {unlockedAchievements}/{totalAchievements}
          </Badge>
        </div>

        <div className="text-center space-y-4">
          <div className="text-5xl">🏆</div>
          <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground">Your journey milestones</p>
        </div>

        <div className="space-y-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`p-4 ${achievement.unlocked ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" : "opacity-60"}`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                    {achievement.unlocked && <span className="text-yellow-600">👑</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <Badge variant="secondary" className="text-xs">
                      Unlocked {achievement.date}
                    </Badge>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>
                          {achievement.progress}/{achievement.requirement}
                        </span>
                      </div>
                      <Progress value={(achievement.progress / achievement.requirement) * 100} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (activeTab === "settings") {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setActiveTab("overview")}>
          ← Back to Profile
        </Button>

        <div className="text-center space-y-4">
          <div className="text-5xl">⚙️</div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Customize your MoodZoo experience</p>
        </div>

        <div className="space-y-4">
          {isPremium && (
            <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Premium Member</h3>
                  <p className="text-sm text-yellow-700">Enjoying unlimited features and exclusive habitats</p>
                </div>
                <Badge className="bg-yellow-600 text-white ml-auto">Active</Badge>
              </div>
            </Card>
          )}

          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🔔</span>
                    <span className="font-medium text-foreground">Daily Reminders</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Get reminded to log your mood</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <h3 className="font-semibold text-foreground">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span>🌙</span>
                    <span className="font-medium text-foreground">Dark Mode</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Zoo Customization</h3>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <span className="mr-2">🎨</span>
                Change Zoo Theme
                {isPremium && <Crown className="h-4 w-4 ml-auto text-yellow-600" />}
              </Button>
              <p className="text-xs text-muted-foreground">
                {isPremium ? "Premium themes available" : "Unlock new themes by completing achievements"}
              </p>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Data & Privacy</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Export My Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive bg-transparent">
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">
            ← Home
          </Button>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setActiveTab("settings")}>
          ⚙️
        </Button>
      </div>

      <Card className="p-6 text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">👤</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Zoo Keeper</h1>
            {isPremium && <Crown className="h-5 w-5 text-yellow-600" />}
          </div>
          <p className="text-muted-foreground">Member since {userStats.joinDate}</p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Level {Math.floor(userStats.totalMoods / 10) + 1}</Badge>
            <Badge variant="outline">{userStats.favoriteAnimal} Lover</Badge>
            {isPremium && <Badge className="bg-yellow-600 text-white">Premium</Badge>}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 text-center space-y-2">
          <div className="text-2xl font-bold text-primary">{userStats.currentStreak}</div>
          <div className="text-sm text-muted-foreground">Current Streak</div>
        </Card>
        <Card className="p-4 text-center space-y-2">
          <div className="text-2xl font-bold text-primary">{userStats.totalAnimals}</div>
          <div className="text-sm text-muted-foreground">Animals Collected</div>
        </Card>
        <Card className="p-4 text-center space-y-2">
          <div className="text-2xl font-bold text-primary">{userStats.totalMoods}</div>
          <div className="text-sm text-muted-foreground">Moods Logged</div>
        </Card>
        <Card className="p-4 text-center space-y-2">
          <div className="text-2xl font-bold text-primary">{userStats.activitiesCompleted}</div>
          <div className="text-sm text-muted-foreground">Activities Done</div>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <h3 className="font-semibold text-foreground">Achievements</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab("achievements")}>
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {achievements
            .filter((a) => a.unlocked)
            .slice(0, 3)
            .map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{achievement.title}</div>
                  <div className="text-sm text-muted-foreground">{achievement.description}</div>
                </div>
                <span className="text-yellow-500">⭐</span>
              </div>
            ))}
        </div>

        <div className="text-center">
          <Badge variant="outline">
            {unlockedAchievements} of {totalAchievements} unlocked
          </Badge>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h3 className="font-semibold text-foreground">This Month's Progress</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Daily mood logging</span>
              <span className="text-muted-foreground">{userStats.daysActive}/30 days</span>
            </div>
            <Progress value={(userStats.daysActive / 30) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Wellness activities</span>
              <span className="text-muted-foreground">{userStats.activitiesCompleted}/15 activities</span>
            </div>
            <Progress value={(userStats.activitiesCompleted / 15) * 100} className="h-2" />
          </div>

          {isPremium && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground flex items-center gap-1">
                  Premium evolutions <Crown className="h-3 w-3 text-yellow-600" />
                </span>
                <span className="text-muted-foreground">{userStats.premiumEvolutions}/10 evolved</span>
              </div>
              <Progress value={(userStats.premiumEvolutions / 10) * 100} className="h-2" />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
