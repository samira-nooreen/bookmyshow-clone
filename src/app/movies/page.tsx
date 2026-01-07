import { supabase, type Movie } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { MovieCard } from "@/components/MovieCard"
import { MoviesFilter } from "./MoviesFilter"

interface PageProps {
  searchParams: Promise<{ search?: string; filter?: string; genre?: string }>
}

async function getMovies(search?: string, filter?: string, genre?: string) {
  let query = supabase.from("movies").select("*")

  if (filter === "now-showing") {
    query = query.eq("is_now_showing", true)
  } else if (filter === "coming-soon") {
    query = query.eq("is_coming_soon", true)
  }

  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  if (genre && genre !== "all") {
    query = query.contains("genre", [genre])
  }

  const { data } = await query.order("rating", { ascending: false })
  return (data || []) as Movie[]
}

async function getGenres() {
  const { data } = await supabase.from("movies").select("genre")
  const genres = new Set<string>()
  data?.forEach((movie) => {
    movie.genre?.forEach((g: string) => genres.add(g))
  })
  return Array.from(genres).sort()
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const movies = await getMovies(params.search, params.filter, params.genre)
  const genres = await getGenres()

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {params.filter === "coming-soon" ? "Coming Soon" : params.filter === "now-showing" ? "Now Showing" : "All Movies"}
            </h1>
            <p className="text-gray-400">
              {params.search ? `Search results for "${params.search}"` : "Browse all movies and find your next cinema experience"}
            </p>
          </div>

          <MoviesFilter genres={genres} currentFilter={params.filter} currentGenre={params.genre} />

          {movies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No movies found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
