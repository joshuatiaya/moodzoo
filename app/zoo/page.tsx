import { ZooHabitat } from "@/components/zoo-habitat"
import { Header } from "@/components/header"

export default function ZooPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <ZooHabitat />
      </main>
    </div>
  )
}
