"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Star, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Movie } from "@/lib/supabase"

interface HeroCarouselProps {
  movies: Movie[]
}

export function HeroCarousel({ movies }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (movieId: string) => {
    setImageErrors(prev => ({ ...prev, [movieId]: true }))
  }

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
  }, [movies.length])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
  }

  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, movies.length, nextSlide])

  if (movies.length === 0) {
    return (
      <div className="relative h-[70vh] bg-[#1a1a2e] flex items-center justify-center">
        <p className="text-gray-400">No featured movies available</p>
      </div>
    )
  }

  const currentMovie = movies[currentIndex]

  return (
    <div 
      className="relative h-[70vh] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={movie.backdrop_url || movie.poster_url}
            alt={movie.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f1a] via-[#0f0f1a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1a] via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4 animate-fade-in">
            {currentMovie.genre.slice(0, 3).map((g) => (
              <Badge key={g} variant="secondary" className="bg-[#e94560]/20 text-[#e94560] border-[#e94560]/30">
                {g}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-delay-1">
            {currentMovie.title}
          </h1>
          
          <div className="flex items-center gap-6 text-gray-300 mb-4 animate-fade-in-delay-2">
            {currentMovie.rating > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-lg font-medium">{currentMovie.rating}/10</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{currentMovie.duration} min</span>
            </div>
            <span className="px-3 py-1 bg-[#16213e] rounded-full text-sm">{currentMovie.language}</span>
          </div>
          
          <p className="text-gray-400 text-lg mb-8 line-clamp-3 animate-fade-in-delay-3">
            {currentMovie.description}
          </p>
          
          <div className="flex items-center gap-4 animate-fade-in-delay-3">
            <Link href={`/movies/${currentMovie.id}`}>
              <Button size="lg" className="bg-[#e94560] hover:bg-[#d63050] text-white px-8">
                Book Tickets
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 gap-2"
            >
              <Play className="w-5 h-5" />
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex 
                ? "w-8 bg-[#e94560]" 
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )
}
