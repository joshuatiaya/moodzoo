import { ActivitiesHub } from "@/components/activities-hub"
import { Header } from "@/components/header"

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <ActivitiesHub />
      </main>
    </div>
  )
}
