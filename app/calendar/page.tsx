import { Header } from "@/components/header"
import { CalendarReminders } from "@/components/calendar-reminders"

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <CalendarReminders />
      </div>
    </main>
  )
}
