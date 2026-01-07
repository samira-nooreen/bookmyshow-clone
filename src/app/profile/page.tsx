"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase, type Profile } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { toast } from "sonner"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push("/login?redirect=/profile")
        return
      }

      setUser(authUser)

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single()
      
      if (profileData) {
        setProfile(profileData)
        setFullName(profileData.full_name || "")
      }
      
      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        updated_at: new Date().toISOString()
      })

    if (error) {
      toast.error("Failed to update profile")
    } else {
      toast.success("Profile updated successfully")
    }

    setIsSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully")
    router.push("/")
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e94560]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <User className="w-8 h-8 text-[#e94560]" />
            <h1 className="text-3xl font-bold text-white">Profile</h1>
          </div>

          <div className="bg-[#16213e] rounded-xl p-8 border border-[#0f3460]">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#0f3460]">
              <div className="w-20 h-20 rounded-full bg-[#e94560] flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{fullName || "User"}</h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="pl-10 bg-[#0f0f1a] border-[#0f3460] text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-[#0f0f1a] border-[#0f3460] text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-[#e94560] hover:bg-[#d63050] text-white"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-[#0f3460] text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {profile?.role === "admin" && (
            <div className="mt-6 p-4 bg-[#e94560]/10 border border-[#e94560]/30 rounded-xl">
              <p className="text-[#e94560] font-medium">Admin Account</p>
              <p className="text-gray-400 text-sm mt-1">You have admin privileges.</p>
              <Button
                onClick={() => router.push("/admin")}
                variant="outline"
                className="mt-4 border-[#e94560] text-[#e94560] hover:bg-[#e94560] hover:text-white"
              >
                Go to Admin Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
