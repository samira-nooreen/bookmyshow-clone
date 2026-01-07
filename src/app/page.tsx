import { supabase, type Movie } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { MovieCard } from "@/components/MovieCard"
import { MoodExplorer } from "@/components/MoodExplorer"
import { HeroCarousel } from "./HeroCarousel"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

async function getMovies() {
  const { data: nowShowing } = await supabase
    .from("movies")
    .select("*")
    .eq("is_now_showing", true)
    .order("rating", { ascending: false })

  const { data: comingSoon } = await supabase
    .from("movies")
    .select("*")
    .eq("is_coming_soon", true)
    .order("release_date", { ascending: true })

  return {
    nowShowing: (nowShowing || []) as Movie[],
    comingSoon: (comingSoon || []) as Movie[],
  }
}

export default async function HomePage() {
  const { nowShowing, comingSoon } = await getMovies()

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      
      <main className="pt-16">
        <HeroCarousel movies={nowShowing.slice(0, 4)} />

        <MoodExplorer />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Now Showing</h2>
              <p className="text-gray-400 mt-1">Currently in theaters near you</p>
            </div>
            <Link 
              href="/movies?filter=now-showing" 
              className="flex items-center gap-1 text-[#e94560] hover:text-[#d63050] transition-colors font-medium"
            >
              View All
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {nowShowing.slice(0, 5).map((movie, index) => (
              <div key={movie.id} className={`animate-fade-in-delay-${index % 4}`}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </section>

        {comingSoon.length > 0 && (
          <section className="bg-[#1a1a2e]/50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white">Coming Soon</h2>
                  <p className="text-gray-400 mt-1">Upcoming movies to look forward to</p>
                </div>
                <Link 
                  href="/movies?filter=coming-soon" 
                  className="flex items-center gap-1 text-[#e94560] hover:text-[#d63050] transition-colors font-medium"
                >
                  View All
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {comingSoon.slice(0, 5).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#e94560]/20 to-[#0f3460]/20 rounded-2xl p-8 border border-[#e94560]/20">
              <div className="w-14 h-14 bg-[#e94560] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Easy Booking</h3>
              <p className="text-gray-400">Book your favorite movies in just a few clicks. Select seats, pay securely, and get instant confirmation.</p>
            </div>
            <div className="bg-gradient-to-br from-[#0f3460]/20 to-[#16213e]/40 rounded-2xl p-8 border border-[#0f3460]/20">
              <div className="w-14 h-14 bg-[#0f3460] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Multiple Theaters</h3>
              <p className="text-gray-400">Find showtimes at theaters near you. Compare prices and amenities to choose the perfect cinema experience.</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-[#16213e]/40 rounded-2xl p-8 border border-amber-500/20">
              <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Best Prices</h3>
              <p className="text-gray-400">Get exclusive deals and discounts. Enjoy special offers on weekdays and earn reward points with every booking.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
