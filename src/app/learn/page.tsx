"use client"

import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { StudentDashboard } from "@/components/student/student-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User } from "lucide-react"

export default function LearnPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <div className="text-lg text-gray-300">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-bold text-white">Physics Learning Platform</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <User className="h-4 w-4" />
              <span>Welcome, {user.name}</span>
            </div>

            {user.role === "ADMIN" && (
              <Button
              variant="ghost"
              size="sm"
                onClick={() => router.push("/admin")}
                className="text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main>
        <StudentDashboard />
      </main>
    </div>
  )
}
