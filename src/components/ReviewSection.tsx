"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare, Shield, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { supabase, type Review, type Profile } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"

interface ReviewWithProfile extends Review {
  profiles?: Profile
  is_spoiler: boolean
}

interface ReviewSectionProps {
  movieId: string
  hasTicket?: boolean
}

export function ReviewSection({ movieId, hasTicket = false }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSpoiler, setIsSpoiler] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [unblurredReviews, setUnblurredReviews] = useState<string[]>([])

  useEffect(() => {
    fetchReviews()
  }, [movieId])

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles:user_id (*)
      `)
      .eq("movie_id", movieId)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setReviews(data as ReviewWithProfile[])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error("Please login to post a review")
      return
    }

    if (!comment.trim()) {
      toast.error("Please add a comment")
      return
    }

    setIsSubmitting(true)

    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      movie_id: movieId,
      rating,
      comment,
      is_spoiler: isSpoiler
    })

    if (error) {
      toast.error("Failed to post review")
    } else {
      toast.success("Review posted successfully!")
      setComment("")
      setIsSpoiler(false)
      fetchReviews()
    }
    setIsSubmitting(false)
  }

  const toggleBlur = (reviewId: string) => {
    setUnblurredReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId) 
        : [...prev, reviewId]
    )
  }

  return (
    <div className="mt-16 bg-[#16213e] rounded-2xl p-8 border border-[#0f3460]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#e94560]" />
            Audience Reviews
          </h2>
          <p className="text-gray-400 mt-1">Share your thoughts with the community</p>
        </div>
        {hasTicket && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Verified Watcher
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-12 bg-[#0f0f1a] rounded-xl p-6 border border-[#0f3460]">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-400 font-medium">Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setRating(num)}
                className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
                  rating >= num ? "bg-[#e94560] text-white" : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of the movie? (Keep it respectful)"
          className="w-full bg-[#16213e] border border-[#0f3460] rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e94560]/50 mb-4 h-32 resize-none"
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={isSpoiler}
              onChange={(e) => setIsSpoiler(e.target.checked)}
              className="hidden"
            />
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
              isSpoiler ? "bg-[#e94560] border-[#e94560]" : "bg-transparent border-gray-600 group-hover:border-gray-400"
            }`}>
              {isSpoiler && <Shield className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm ${isSpoiler ? "text-[#e94560] font-medium" : "text-gray-400"}`}>
              Contains Spoilers
            </span>
          </label>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#e94560] hover:bg-[#d63050] text-white px-8"
          >
            {isSubmitting ? "Posting..." : "Post Review"}
          </Button>
        </div>
      </form>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          reviews.map((review) => {
            const isBlurry = review.is_spoiler && !hasTicket && !unblurredReviews.includes(review.id)
            
            return (
              <div key={review.id} className="bg-[#0f0f1a] rounded-xl p-6 border border-[#0f3460] relative overflow-hidden group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#e94560] to-[#0f3460] flex items-center justify-center text-white font-bold">
                      {review.profiles?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">
                        {review.profiles?.username || "Anonymous User"}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {format(new Date(review.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-[#e94560]/10 rounded border border-[#e94560]/20">
                    <Star className="w-4 h-4 text-[#e94560] fill-[#e94560]" />
                    <span className="text-[#e94560] font-bold">{review.rating}</span>
                  </div>
                </div>

                <div className={`relative transition-all duration-300 ${isBlurry ? "blur-md select-none" : ""}`}>
                  <p className="text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {isBlurry && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10 p-6 text-center">
                    <EyeOff className="w-8 h-8 text-[#e94560] mb-3" />
                    <h5 className="text-white font-bold mb-1">Spoiler Alert!</h5>
                    <p className="text-gray-300 text-sm mb-4"> This review contains major spoilers.</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleBlur(review.id)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Reveal Anyway
                      </Button>
                      {!hasTicket && (
                        <p className="text-xs text-gray-400 mt-2 block w-full">
                          (Verified watchers see spoilers automatically)
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {review.is_spoiler && !isBlurry && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-[#e94560] font-medium bg-[#e94560]/10 w-fit px-2 py-1 rounded">
                    <Shield className="w-3 h-3" />
                    Spoiler Content
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
