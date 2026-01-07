import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Star, Clock, Calendar, MapPin } from "lucide-react"
import { supabase, type Movie, type Show } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

import { ReviewSection } from "@/components/ReviewSection"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getHasTicket(movieId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from("tickets")
    .select("id")
    .eq("user_id", user.id)
    .innerJoin("shows", "show_id", "id")
    .eq("shows.movie_id", movieId)
    .limit(1)
  
  // Alternative check if innerJoin is not supported/easy via simple select
  const { data: tickets } = await supabase
    .from("tickets")
    .select("show_id")
    .eq("user_id", user.id)

  if (!tickets || tickets.length === 0) return false

  const showIds = tickets.map(t => t.show_id)
  const { count } = await supabase
    .from("shows")
    .select("id", { count: 'exact', head: true })
    .in("id", showIds)
    .eq("movie_id", movieId)

  return (count || 0) > 0
}

async function getMovie(id: string) {
  const { data } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single()
  return data as Movie | null
}

async function getShows(movieId: string) {
  const { data } = await supabase
    .from("shows")
    .select(`
      *,
      screen:screens(
        *,
        theater:theaters(*)
      )
    `)
    .eq("movie_id", movieId)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
  
  return (data || []) as (Show & { screen: { theater: { name: string; location: string; city: string } } })[]
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params
  const movie = await getMovie(id)
  
  if (!movie) {
    notFound()
  }

  const hasTicket = await getHasTicket(id)
  const shows = await getShows(id)
  
  const showsByTheater = shows.reduce((acc, show) => {
    const theaterName = show.screen?.theater?.name || "Unknown Theater"
    if (!acc[theaterName]) {
      acc[theaterName] = {
        theater: show.screen?.theater,
        shows: []
      }
    }
    acc[theaterName].shows.push(show)
    return acc
  }, {} as Record<string, { theater: { name: string; location: string; city: string } | undefined; shows: typeof shows }>)

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      
      <main className="pt-16">
        <div className="relative h-[50vh] md:h-[60vh]">
          <Image
            src={movie.backdrop_url || movie.poster_url}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-[#0f0f1a]/70 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-48 md:w-64 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex-grow">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {movie.genre.map((g) => (
                  <Badge key={g} variant="secondary" className="bg-[#e94560]/20 text-[#e94560] border-[#e94560]/30">
                    {g}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
                {movie.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-medium">{movie.rating}/10</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{movie.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{format(new Date(movie.release_date), "MMM d, yyyy")}</span>
                </div>
                <span className="px-3 py-1 bg-[#16213e] rounded-full text-sm">{movie.language}</span>
              </div>
              
              <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-3xl">
                {movie.description}
              </p>

              {movie.is_coming_soon && (
                <div className="bg-[#16213e] rounded-xl p-6 border border-[#0f3460]">
                  <p className="text-[#e94560] font-medium text-lg">Coming Soon</p>
                  <p className="text-gray-400">Release Date: {format(new Date(movie.release_date), "MMMM d, yyyy")}</p>
                </div>
              )}
            </div>
          </div>

          {!movie.is_coming_soon && (
            <section className="mt-12 pb-16">
              <h2 className="text-2xl font-bold text-white mb-6">Select Showtime</h2>
              
              {Object.keys(showsByTheater).length === 0 ? (
                <div className="bg-[#16213e] rounded-xl p-8 text-center">
                  <p className="text-gray-400">No showtimes available for this movie</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(showsByTheater).map(([theaterName, { theater, shows: theaterShows }]) => (
                    <div key={theaterName} className="bg-[#16213e] rounded-xl p-6 border border-[#0f3460]">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{theaterName}</h3>
                          {theater && (
                            <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>{theater.location}, {theater.city}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        {theaterShows.map((show) => (
                          <Link key={show.id} href={`/booking/${show.id}`}>
                            <Button
                              variant="outline"
                              className="border-[#0f3460] text-white hover:bg-[#e94560] hover:border-[#e94560] hover:text-white transition-colors"
                            >
                              <div className="text-center">
                                <div className="font-medium">
                                  {format(new Date(show.start_time), "h:mm a")}
                                </div>
                                <div className="text-xs text-gray-400 group-hover:text-white/70">
                                  ₹{show.price}
                                </div>
                              </div>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
