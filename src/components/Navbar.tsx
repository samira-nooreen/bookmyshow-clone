"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, Menu, X, User, Ticket, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/movies?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e] border-b border-[#16213e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black">
                <span className="text-[#e94560]">BOOK</span>
                <span className="text-white">MY</span>
                <span className="text-[#0f3460]">SHOW</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors font-medium">
                Home
              </Link>
              <Link href="/movies" className="text-gray-300 hover:text-white transition-colors font-medium">
                Movies
              </Link>
                <Link href="/theaters" className="text-gray-300 hover:text-white transition-colors font-medium">
                  Theaters
                </Link>
                {user && (
                  <>
                    <Link href="/my-tickets" className="text-gray-300 hover:text-white transition-colors font-medium">
                      My Tickets
                    </Link>
                    <Link href="/my-passport" className="text-gray-300 hover:text-white transition-colors font-medium">
                      Passport
                    </Link>
                  </>
                )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-[#16213e] border-[#0f3460] text-white placeholder:text-gray-400 pr-10"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/my-tickets">
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-[#16213e]">
                    <Ticket className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-[#16213e]">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-[#16213e]">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#e94560] hover:bg-[#d63050] text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#16213e]">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#16213e] border-[#0f3460] text-white placeholder:text-gray-400 pr-10"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
            
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-gray-300 hover:text-white py-2 font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/movies" className="text-gray-300 hover:text-white py-2 font-medium" onClick={() => setIsMenuOpen(false)}>
                Movies
              </Link>
              <Link href="/theaters" className="text-gray-300 hover:text-white py-2 font-medium" onClick={() => setIsMenuOpen(false)}>
                Theaters
              </Link>
              {user ? (
                <>
                  <Link href="/my-tickets" className="text-gray-300 hover:text-white py-2 font-medium" onClick={() => setIsMenuOpen(false)}>
                    My Tickets
                  </Link>
                  <Link href="/profile" className="text-gray-300 hover:text-white py-2 font-medium" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-300 hover:text-white py-2 font-medium" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-[#e94560] hover:bg-[#d63050] text-white mt-2" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
