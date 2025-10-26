"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Moon, TrendingUp, Calendar } from "lucide-react"

interface SleepEntry {
  date: string
  hours: number
  quality: "poor" | "fair" | "good" | "excellent"
  timestamp: string
}

export function SleepTracker() {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [hours, setHours] = useState(7)
  const [quality, setQuality] = useState<"good">("good")

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("sleepEntries") || "[]")
    setSleepEntries(saved)
  }, [])

  const saveSleep = () => {
    const today = new Date().toISOString().split("T")[0]
    const newEntry: SleepEntry = {
      date: today,
      hours,
      quality,
      timestamp: new Date().toISOString(),
    }

    const updated = [newEntry, ...sleepEntries.filter((e) => e.date !== today)]
    setSleepEntries(updated)
    localStorage.setItem("sleepEntries", JSON.stringify(updated))
    setShowDialog(false)
    setHours(7)
    setQuality("good")
  }

  const todayEntry = sleepEntries.find((e) => e.date === new Date().toISOString().split("T")[0])
  const avgSleep =
    sleepEntries.length > 0 ? (sleepEntries.reduce((sum, e) => sum + e.hours, 0) / sleepEntries.length).toFixed(1) : 0

  const getQualityColor = (q: string) => {
    switch (q) {
      case "poor":
        return "bg-red-100 text-red-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "excellent":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-6 w-6 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-foreground">Sleep Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor your rest</p>
              </div>
            </div>
            <Button onClick={() => setShowDialog(true)} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              Log Sleep
            </Button>
          </div>

          {todayEntry && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-indigo-600">{todayEntry.hours}h</div>
                <div className="text-xs text-muted-foreground">Tonight</div>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <Badge className={getQualityColor(todayEntry.quality)}>{todayEntry.quality}</Badge>
              </div>
            </div>
          )}

          {sleepEntries.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">
                Average: <span className="font-semibold text-foreground">{avgSleep}h</span> per night
              </span>
            </div>
          )}

          {sleepEntries.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground">Recent Sleep</div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {sleepEntries.slice(0, 5).map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm bg-white rounded p-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.hours}h</span>
                      <Badge variant="outline" className={getQualityColor(entry.quality)}>
                        {entry.quality}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Your Sleep</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Hours Slept</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={hours}
                  onChange={(e) => setHours(Number.parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-indigo-600 w-12 text-right">{hours}h</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Sleep Quality</label>
              <div className="grid grid-cols-4 gap-2">
                {(["poor", "fair", "good", "excellent"] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      quality === q
                        ? `${getQualityColor(q)} ring-2 ring-offset-2`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {q.charAt(0).toUpperCase() + q.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={saveSleep} className="w-full bg-indigo-600 hover:bg-indigo-700">
              Save Sleep Log
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
