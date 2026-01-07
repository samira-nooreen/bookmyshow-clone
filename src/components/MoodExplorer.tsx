"use client"

import { useState } from "react"
import { Sparkles, Search, Loader2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MovieCard } from "./MovieCard"
import { type Movie, supabase } from "@/lib/supabase"

export function MoodExplorer() {
  const [mood, setMood] = useState("")
  const [recommendations, setRecommendations] = useState<Movie[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleMoodSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mood.trim()) return

    setIsAnalyzing(true)
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const moodKeywords = mood.toLowerCase().split(/\s+/)
    
    const { data: movies } = await supabase
      .from("movies")
      .select("*")
      .eq("is_now_showing", true)

    if (movies) {
      // Basic AI matching simulation
      const matched = movies.filter(movie => {
        const searchText = (movie.title + " " + movie.description + " " + movie.genre.join(" ")).toLowerCase()
        return moodKeywords.some(keyword => {
          if (keyword.length < 3) return false
          return searchText.includes(keyword)
        })
      }).sort((a, b) => {
        // Boost matches based on frequency of keywords
        const aMatches = moodKeywords.filter(k => (a.title + " " + a.description).toLowerCase().includes(k)).length
        const bMatches = moodKeywords.filter(k => (b.title + " " + b.description).toLowerCase().includes(k)).length
        return bMatches - aMatches
      })

      setRecommendations(matched.slice(0, 3))
    }
    
    setIsAnalyzing(false)
  }

  return (
    <section className="bg-gradient-to-r from-[#e94560]/10 via-[#0f3460]/10 to-[#16213e]/10 py-16 border-y border-[#e94560]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e94560]/20 text-[#e94560] text-sm font-bold mb-4 border border-[#e94560]/30 animate-pulse">
            <Sparkles className="w-4 h-4" />
            AI MOOD EXPLORER
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">How are you feeling today?</h2>
          <p className="text-gray-400 text-lg">
            Tell us your vibe, and our AI will handpick the perfect movie for your current mood.
          </p>
        </div>

        <form onSubmit={handleMoodSearch} className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <Input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g. 'I want something heart-wrenching and epic' or 'Need a brainless action flick'"
              className="w-full h-16 bg-[#16213e] border-[#0f3460] text-white text-lg pl-6 pr-32 rounded-2xl focus:ring-[#e94560]/50 transition-all group-hover:border-[#e94560]/30"
            />
            <Button 
              type="submit"
              disabled={isAnalyzing || !mood.trim()}
              className="absolute right-2 top-2 bottom-2 bg-[#e94560] hover:bg-[#d63050] text-white px-6 rounded-xl font-bold transition-all"
            >
              {isAnalyzing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Analyze
                  <Play className="w-4 h-4 ml-2 fill-current" />
                </>
              )}
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["Adrenaline Rush", "Total Tear-jerker", "Deeply Philosophical", "Mind-bending Sci-fi", "Cozy & Feel-good"].map((suggested) => (
              <button
                key={suggested}
                type="button"
                onClick={() => setMood(suggested)}
                className="text-xs text-gray-500 hover:text-[#e94560] transition-colors"
              >
                #{suggested}
              </button>
            ))}
          </div>
        </form>

        {recommendations.length > 0 && (
          <div className="animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e94560]" />
              AI Recommendations for your mood:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((movie) => (
                <div key={movie.id} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#e94560] to-[#0f3460] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                  <MovieCard movie={movie} />
                  <div className="absolute top-4 right-4 bg-[#e94560] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase tracking-widest z-20 pointer-events-none">
                    Mood Match
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button 
                variant="ghost" 
                onClick={() => setRecommendations([])}
                className="text-gray-500 hover:text-white"
              >
                Clear results
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
