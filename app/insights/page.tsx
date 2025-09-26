import { InsightsDashboard } from "@/components/insights-dashboard"
import { Header } from "@/components/header"

export default function InsightsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <InsightsDashboard />
      </main>
    </div>
  )
}
