"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MoviesFilterProps {
  genres: string[]
  currentFilter?: string
  currentGenre?: string
}

export function MoviesFilter({ genres, currentFilter, currentGenre }: MoviesFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/movies?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      <div className="flex gap-2">
        <Button
          variant={!currentFilter ? "default" : "outline"}
          onClick={() => updateFilter("filter", "")}
          className={!currentFilter ? "bg-[#e94560] hover:bg-[#d63050]" : "border-[#1f2937] text-gray-300 hover:bg-[#16213e]"}
        >
          All
        </Button>
        <Button
          variant={currentFilter === "now-showing" ? "default" : "outline"}
          onClick={() => updateFilter("filter", "now-showing")}
          className={currentFilter === "now-showing" ? "bg-[#e94560] hover:bg-[#d63050]" : "border-[#1f2937] text-gray-300 hover:bg-[#16213e]"}
        >
          Now Showing
        </Button>
        <Button
          variant={currentFilter === "coming-soon" ? "default" : "outline"}
          onClick={() => updateFilter("filter", "coming-soon")}
          className={currentFilter === "coming-soon" ? "bg-[#e94560] hover:bg-[#d63050]" : "border-[#1f2937] text-gray-300 hover:bg-[#16213e]"}
        >
          Coming Soon
        </Button>
      </div>

      <Select value={currentGenre || "all"} onValueChange={(value) => updateFilter("genre", value)}>
        <SelectTrigger className="w-[180px] bg-[#16213e] border-[#1f2937] text-white">
          <SelectValue placeholder="Select Genre" />
        </SelectTrigger>
        <SelectContent className="bg-[#16213e] border-[#1f2937]">
          <SelectItem value="all" className="text-white hover:bg-[#0f3460]">All Genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre} value={genre} className="text-white hover:bg-[#0f3460]">
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
