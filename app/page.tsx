import { MoodLogger } from "@/components/mood-logger"
import { ZooPreview } from "@/components/zoo-preview"
import { Header } from "@/components/header"
import { InsightsPreview } from "@/components/insights-preview"
import { QuickActions } from "@/components/quick-actions"
import { EvolutionPreview } from "@/components/evolution-preview"
import { PremiumSystem } from "@/components/premium-system"
import { QuestSystem } from "@/components/quest-system"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground text-balance">Welcome to MoodZoo</h1>
            <p className="text-muted-foreground text-pretty">
              Transform your emotions into adorable animals and watch your personal zoo grow
            </p>
          </div>

          <MoodLogger />
          <PremiumSystem />
          <QuestSystem />
          <EvolutionPreview />
          <ZooPreview />
          <InsightsPreview />
          <QuickActions />
        </div>
      </main>
    </div>
  )
}
