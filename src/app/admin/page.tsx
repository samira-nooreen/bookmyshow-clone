"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Film, Theater, Calendar, Users, Plus, Pencil, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase, type Movie, type Theater as TheaterType, type Profile } from "@/lib/supabase"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeTab, setActiveTab] = useState<"movies" | "theaters" | "shows">("movies")
  const [movies, setMovies] = useState<Movie[]>([])
  const [theaters, setTheaters] = useState<TheaterType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)

  const [movieForm, setMovieForm] = useState({
    title: "",
    description: "",
    duration: "",
    genre: "",
    poster_url: "",
    backdrop_url: "",
    release_date: "",
    rating: "",
    language: "English",
    is_now_showing: true,
    is_coming_soon: false
  })

  useEffect(() => {
    const loadData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push("/login?redirect=/admin")
        return
      }

      setUser(authUser)

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single()
      
      if (!profileData || profileData.role !== "admin") {
        toast.error("Access denied. Admin privileges required.")
        router.push("/")
        return
      }

      setProfile(profileData)

      const { data: moviesData } = await supabase.from("movies").select("*").order("created_at", { ascending: false })
      const { data: theatersData } = await supabase.from("theaters").select("*").order("name")
      
      setMovies(moviesData || [])
      setTheaters(theatersData || [])
      setIsLoading(false)
    }

    loadData()
  }, [router])

  const resetMovieForm = () => {
    setMovieForm({
      title: "",
      description: "",
      duration: "",
      genre: "",
      poster_url: "",
      backdrop_url: "",
      release_date: "",
      rating: "",
      language: "English",
      is_now_showing: true,
      is_coming_soon: false
    })
    setEditingMovie(null)
  }

  const handleSaveMovie = async () => {
    if (!movieForm.title || !movieForm.duration) {
      toast.error("Title and duration are required")
      return
    }

    const movieData = {
      title: movieForm.title,
      description: movieForm.description,
      duration: parseInt(movieForm.duration),
      genre: movieForm.genre.split(",").map(g => g.trim()).filter(Boolean),
      poster_url: movieForm.poster_url,
      backdrop_url: movieForm.backdrop_url,
      release_date: movieForm.release_date || null,
      rating: parseFloat(movieForm.rating) || 0,
      language: movieForm.language,
      is_now_showing: movieForm.is_now_showing,
      is_coming_soon: movieForm.is_coming_soon
    }

    if (editingMovie) {
      const { error } = await supabase
        .from("movies")
        .update(movieData)
        .eq("id", editingMovie.id)
      
      if (error) {
        toast.error("Failed to update movie")
        return
      }
      toast.success("Movie updated successfully")
    } else {
      const { error } = await supabase.from("movies").insert(movieData)
      
      if (error) {
        toast.error("Failed to add movie")
        return
      }
      toast.success("Movie added successfully")
    }

    const { data: moviesData } = await supabase.from("movies").select("*").order("created_at", { ascending: false })
    setMovies(moviesData || [])
    setIsMovieDialogOpen(false)
    resetMovieForm()
  }

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie)
    setMovieForm({
      title: movie.title,
      description: movie.description || "",
      duration: movie.duration.toString(),
      genre: movie.genre.join(", "),
      poster_url: movie.poster_url || "",
      backdrop_url: movie.backdrop_url || "",
      release_date: movie.release_date || "",
      rating: movie.rating?.toString() || "",
      language: movie.language || "English",
      is_now_showing: movie.is_now_showing,
      is_coming_soon: movie.is_coming_soon
    })
    setIsMovieDialogOpen(true)
  }

  const handleDeleteMovie = async (id: string) => {
    if (!confirm("Are you sure you want to delete this movie?")) return

    const { error } = await supabase.from("movies").delete().eq("id", id)
    
    if (error) {
      toast.error("Failed to delete movie")
      return
    }

    setMovies(movies.filter(m => m.id !== id))
    toast.success("Movie deleted successfully")
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
      <div className="bg-[#1a1a2e] border-b border-[#16213e] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={() => router.push("/")} className="border-[#0f3460] text-gray-300">
            Back to Site
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#16213e] rounded-xl p-6 border border-[#0f3460]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e94560]/20 rounded-lg flex items-center justify-center">
                <Film className="w-6 h-6 text-[#e94560]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Movies</p>
                <p className="text-2xl font-bold text-white">{movies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#16213e] rounded-xl p-6 border border-[#0f3460]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0f3460]/50 rounded-lg flex items-center justify-center">
                <Theater className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Theaters</p>
                <p className="text-2xl font-bold text-white">{theaters.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#16213e] rounded-xl p-6 border border-[#0f3460]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Now Showing</p>
                <p className="text-2xl font-bold text-white">{movies.filter(m => m.is_now_showing).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === "movies" ? "default" : "outline"}
            onClick={() => setActiveTab("movies")}
            className={activeTab === "movies" ? "bg-[#e94560] hover:bg-[#d63050]" : "border-[#0f3460] text-gray-300"}
          >
            <Film className="w-4 h-4 mr-2" />
            Movies
          </Button>
          <Button
            variant={activeTab === "theaters" ? "default" : "outline"}
            onClick={() => setActiveTab("theaters")}
            className={activeTab === "theaters" ? "bg-[#e94560] hover:bg-[#d63050]" : "border-[#0f3460] text-gray-300"}
          >
            <Theater className="w-4 h-4 mr-2" />
            Theaters
          </Button>
        </div>

        {activeTab === "movies" && (
          <div className="bg-[#16213e] rounded-xl border border-[#0f3460]">
            <div className="p-6 border-b border-[#0f3460] flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Movies</h2>
              <Button 
                onClick={() => { resetMovieForm(); setIsMovieDialogOpen(true) }}
                className="bg-[#e94560] hover:bg-[#d63050]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Movie
              </Button>
            </div>
            <div className="divide-y divide-[#0f3460]">
              {movies.map((movie) => (
                <div key={movie.id} className="p-4 flex items-center gap-4">
                  <div className="relative w-16 aspect-[2/3] rounded overflow-hidden flex-shrink-0">
                    <Image src={movie.poster_url} alt={movie.title} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-white font-medium">{movie.title}</h3>
                    <p className="text-gray-400 text-sm">{movie.genre.join(", ")} • {movie.duration} min</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${movie.is_now_showing ? "bg-green-500/20 text-green-400" : movie.is_coming_soon ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {movie.is_now_showing ? "Now Showing" : movie.is_coming_soon ? "Coming Soon" : "Not Showing"}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => handleEditMovie(movie)} className="text-gray-400 hover:text-white">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteMovie(movie.id)} className="text-gray-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "theaters" && (
          <div className="bg-[#16213e] rounded-xl border border-[#0f3460]">
            <div className="p-6 border-b border-[#0f3460]">
              <h2 className="text-xl font-semibold text-white">Theaters</h2>
            </div>
            <div className="divide-y divide-[#0f3460]">
              {theaters.map((theater) => (
                <div key={theater.id} className="p-4 flex items-center gap-4">
                  <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0">
                    <Image src={theater.image_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800"} alt={theater.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-white font-medium">{theater.name}</h3>
                    <p className="text-gray-400 text-sm">{theater.location}, {theater.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isMovieDialogOpen} onOpenChange={setIsMovieDialogOpen}>
        <DialogContent className="bg-[#16213e] border-[#0f3460] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Title *</Label>
                <Input
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="bg-[#0f0f1a] border-[#0f3460] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Duration (min) *</Label>
                <Input
                  type="number"
                  value={movieForm.duration}
                  onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                  className="bg-[#0f0f1a] border-[#0f3460] text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={movieForm.description}
                onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                className="bg-[#0f0f1a] border-[#0f3460] text-white"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Genres (comma separated)</Label>
                <Input
                  value={movieForm.genre}
                  onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                  placeholder="Action, Drama, Sci-Fi"
                  className="bg-[#0f0f1a] border-[#0f3460] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Language</Label>
                <Input
                  value={movieForm.language}
                  onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                  className="bg-[#0f0f1a] border-[#0f3460] text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Poster URL</Label>
                <Input
                  value={movieForm.poster_url}
                  onChange={(e) => setMovieForm({ ...movieForm, poster_url: e.target.value })}
                  className="bg-[#0f0f1a] border-[#0f3460] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Backdrop URL</Label>
                <Input
                  value={movieForm.backdrop_url}
                  onChange={(e) => setMovieForm({ ...movieForm, backdrop_url: e.target.value })}
                  className="bg-[#0f0f1a] border-[#0f3460] text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Release Date</Label>
                <Input
                  type="date"
                  value={movieForm.release_date}
                  onChange={(e) => setMovieForm({ ...movieForm, release_date: e.target.value })}
                  className="bg-[#0f0f1a] border-[#0f3460] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Rating (0-10)</Label>
                <Input
                  type="number"
                  step="0.1"
                  max="10"
                  min="0"
                  value={movieForm.rating}
                  onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                  className="bg-[#0f0f1a] border-[#0f3460] text-white"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={movieForm.is_now_showing}
                  onChange={(e) => setMovieForm({ ...movieForm, is_now_showing: e.target.checked, is_coming_soon: e.target.checked ? false : movieForm.is_coming_soon })}
                  className="rounded border-[#0f3460]"
                />
                <span className="text-gray-300">Now Showing</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={movieForm.is_coming_soon}
                  onChange={(e) => setMovieForm({ ...movieForm, is_coming_soon: e.target.checked, is_now_showing: e.target.checked ? false : movieForm.is_now_showing })}
                  className="rounded border-[#0f3460]"
                />
                <span className="text-gray-300">Coming Soon</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsMovieDialogOpen(false)} className="border-[#0f3460] text-gray-300">
              Cancel
            </Button>
            <Button onClick={handleSaveMovie} className="bg-[#e94560] hover:bg-[#d63050]">
              {editingMovie ? "Update" : "Add"} Movie
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
