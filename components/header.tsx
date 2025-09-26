import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="w-full bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-md">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl">🦁</div>
          <span className="font-bold text-xl text-foreground">MoodZoo</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/activities">
            <Button variant="ghost" size="icon">
              <span className="text-lg">💚</span>
            </Button>
          </Link>
          <Link href="/insights">
            <Button variant="ghost" size="icon">
              <span className="text-lg">📊</span>
            </Button>
          </Link>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <span className="text-lg">👤</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <span className="text-lg">☰</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
