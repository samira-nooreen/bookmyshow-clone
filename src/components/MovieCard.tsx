"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, Clock, Play } from "lucide-react"
import type { Movie } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

interface MovieCardProps {
  movie: Movie
  variant?: "default" | "featured"
}

export function MovieCard({ movie, variant = "default" }: MovieCardProps) {
  const [imgSrc, setImgSrc] = useState(variant === "featured" ? (movie.backdrop_url || movie.poster_url) : movie.poster_url)

  if (variant === "featured") {
    return (
      <Link href={`/movies/${movie.id}`} className="group relative block overflow-hidden rounded-xl">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={imgSrc}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgSrc("https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=1280&q=80")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-2 mb-2">
              {movie.genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="secondary" className="bg-[#e94560]/20 text-[#e94560] border-[#e94560]/30">
                  {g}
                </Badge>
              ))}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{movie.title}</h3>
            <div className="flex items-center gap-4 text-gray-300 text-sm">
              {movie.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{movie.rating}/10</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{movie.duration} min</span>
              </div>
              <span>{movie.language}</span>
            </div>
            <div className="absolute right-6 bottom-6">
              <div className="w-12 h-12 rounded-full bg-[#e94560] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-white fill-white ml-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/movies/${movie.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-[#16213e]">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={imgSrc}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgSrc("https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {movie.rating > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-medium">{movie.rating}</span>
            </div>
          )}
          {movie.is_coming_soon && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-[#e94560] hover:bg-[#e94560] text-white">Coming Soon</Badge>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-white text-sm">
              <Clock className="w-4 h-4" />
              <span>{movie.duration} min</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-white font-semibold text-lg truncate group-hover:text-[#e94560] transition-colors">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {movie.genre.slice(0, 2).map((g) => (
            <span key={g} className="text-gray-400 text-sm">
              {g}
            </span>
          ))}
          <span className="text-gray-500 text-sm">• {movie.language}</span>
        </div>
      </div>
    </Link>
  )
}
