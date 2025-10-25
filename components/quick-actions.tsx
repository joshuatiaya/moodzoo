import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, BarChart3, Trophy } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold text-foreground text-center">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/activities">
          <Button variant="outline" className="w-full h-16 flex-col gap-2 bg-transparent">
            <Heart className="h-5 w-5" />
            <span className="text-sm">Activities</span>
          </Button>
        </Link>

        <Link href="/insights">
          <Button variant="outline" className="w-full h-16 flex-col gap-2 bg-transparent">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm">Insights</span>
          </Button>
        </Link>

        <Link href="/eggs">
          <Button variant="outline" className="w-full h-16 flex-col gap-2 bg-transparent">
            <div className="text-lg">🥚</div>
            <span className="text-sm">Eggs</span>
          </Button>
        </Link>

        <Link href="/zoo">
          <Button variant="outline" className="w-full h-16 flex-col gap-2 bg-transparent">
            <div className="text-lg">🦁</div>
            <span className="text-sm">My Zoo</span>
          </Button>
        </Link>

        <Link href="/profile">
          <Button variant="outline" className="w-full h-16 flex-col gap-2 bg-transparent">
            <Trophy className="h-5 w-5" />
            <span className="text-sm">Profile</span>
          </Button>
        </Link>
      </div>
    </Card>
  )
}
