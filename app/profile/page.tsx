import { UserProfile } from "@/components/user-profile"
import { Header } from "@/components/header"

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-md">
        <UserProfile />
      </main>
    </div>
  )
}
