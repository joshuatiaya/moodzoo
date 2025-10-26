"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bell, X } from "lucide-react"

interface Reminder {
  id: string
  date: string
  time: string
  message: string
}

export function CalendarReminders() {
  const [date, setDate] = useState<Date>(new Date())
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [newReminder, setNewReminder] = useState({ time: "09:00", message: "" })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    const stored = localStorage.getItem("moodzoo_reminders")
    if (stored) {
      setReminders(JSON.parse(stored))
    }
  }, [])

  const saveReminders = (updated: Reminder[]) => {
    setReminders(updated)
    localStorage.setItem("moodzoo_reminders", JSON.stringify(updated))
  }

  const addReminder = () => {
    if (!selectedDate || !newReminder.message) return

    const reminder: Reminder = {
      id: Date.now().toString(),
      date: selectedDate.toISOString().split("T")[0],
      time: newReminder.time,
      message: newReminder.message,
    }

    saveReminders([...reminders, reminder])
    setNewReminder({ time: "09:00", message: "" })
  }

  const deleteReminder = (id: string) => {
    saveReminders(reminders.filter((r) => r.id !== id))
  }

  const dateReminders = reminders.filter((r) => r.date === selectedDate?.toISOString().split("T")[0])

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <h3 className="font-semibold text-foreground mb-4">Calendar & Reminders</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-blue-200"
            />
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm mb-2">
                {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dateReminders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No reminders for this day</p>
                ) : (
                  dateReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-start justify-between bg-white p-2 rounded border border-blue-100"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{reminder.time}</p>
                        <p className="text-sm text-muted-foreground">{reminder.message}</p>
                      </div>
                      <button
                        onClick={() => deleteReminder(reminder.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  <Bell className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Reminder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Time</label>
                    <input
                      type="time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      value={newReminder.message}
                      onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
                      placeholder="e.g., Log your mood, Take a break..."
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                    />
                  </div>
                  <Button onClick={addReminder} className="w-full bg-blue-500 hover:bg-blue-600">
                    Save Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>
    </div>
  )
}
