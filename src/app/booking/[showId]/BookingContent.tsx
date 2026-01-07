"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { MapPin, Calendar, Clock, Monitor, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase, type Show, type Movie } from "@/lib/supabase"
import { toast } from "sonner"

interface BookingContentProps {
  show: Show & {
    movie: Movie
    screen: {
      screen_number: number
      capacity: number
      screen_type: string
      theater: {
        name: string
        location: string
        city: string
      }
    }
  }
  bookedSeats: string[]
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const SEATS_PER_ROW = 15
const PREMIUM_ROWS = ["I", "J"]

export function BookingContent({ show, bookedSeats }: BookingContentProps) {
  const router = useRouter()
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [isBooking, setIsBooking] = useState(false)

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat)) return
    
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    )
  }

  const getSeatPrice = (row: string) => {
    return PREMIUM_ROWS.includes(row) ? show.price * 1.5 : show.price
  }

  const totalPrice = selectedSeats.reduce((sum, seat) => {
    const row = seat.charAt(0)
    return sum + getSeatPrice(row)
  }, 0)

  const handleBooking = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error("Please login to book tickets")
      router.push("/login?redirect=/booking/" + show.id)
      return
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat")
      return
    }

    setIsBooking(true)

    const bookingCode = `BMS${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    const { error } = await supabase.from("tickets").insert({
      user_id: user.id,
      show_id: show.id,
      seats_booked: selectedSeats,
      total_price: totalPrice,
      booking_code: bookingCode,
      booking_status: "confirmed"
    })

    if (error) {
      toast.error("Failed to book tickets. Please try again.")
      setIsBooking(false)
      return
    }

    toast.success("Tickets booked successfully!")
    router.push("/my-tickets")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-[#16213e] rounded-xl p-6 mb-6 border border-[#0f3460]">
            <div className="flex items-start gap-4">
              <div className="relative w-24 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={show.movie.poster_url}
                  alt={show.movie.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{show.movie.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{show.screen.theater.name}, {show.screen.theater.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(show.start_time), "EEE, MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{format(new Date(show.start_time), "h:mm a")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Monitor className="w-4 h-4" />
                    <span>Screen {show.screen.screen_number} • {show.screen.screen_type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#16213e] rounded-xl p-6 border border-[#0f3460]">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Select Your Seats</h2>
            
            <div className="mb-8">
              <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-[#e94560] to-transparent rounded-full mb-2" />
              <p className="text-center text-gray-400 text-sm">SCREEN</p>
            </div>

            <div className="overflow-x-auto pb-4">
              <div className="min-w-[600px] space-y-2">
                {ROWS.map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="w-6 text-gray-400 text-sm font-medium">{row}</span>
                    <div className="flex gap-1 flex-1 justify-center">
                      {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                        const seatNumber = i + 1
                        const seatId = `${row}${seatNumber}`
                        const isBooked = bookedSeats.includes(seatId)
                        const isSelected = selectedSeats.includes(seatId)
                        const isPremium = PREMIUM_ROWS.includes(row)

                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            disabled={isBooked}
                            className={`
                              w-7 h-7 rounded-t-lg text-xs font-medium transition-all
                              ${isBooked ? "seat-booked" : isSelected ? "seat-selected text-white" : isPremium ? "seat-premium" : "seat-available"}
                            `}
                            title={`${seatId} - ₹${getSeatPrice(row)}`}
                          >
                            {seatNumber}
                          </button>
                        )
                      })}
                    </div>
                    <span className="w-6 text-gray-400 text-sm font-medium">{row}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-[#0f3460]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-t-lg seat-available" />
                <span className="text-gray-400 text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-t-lg seat-selected" />
                <span className="text-gray-400 text-sm">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-t-lg seat-booked" />
                <span className="text-gray-400 text-sm">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-t-lg seat-premium" />
                <span className="text-gray-400 text-sm">Premium</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#16213e] rounded-xl p-6 border border-[#0f3460] sticky top-24">
            <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-400">
                <span>Movie</span>
                <span className="text-white font-medium">{show.movie.title}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Date</span>
                <span className="text-white">{format(new Date(show.start_time), "MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Time</span>
                <span className="text-white">{format(new Date(show.start_time), "h:mm a")}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Screen</span>
                <span className="text-white">{show.screen.screen_type}</span>
              </div>
            </div>

            <div className="border-t border-[#0f3460] pt-4 mb-6">
              <div className="flex justify-between text-gray-400 mb-2">
                <span>Selected Seats</span>
                <span className="text-white">{selectedSeats.length}</span>
              </div>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedSeats.sort().map((seat) => (
                    <span
                      key={seat}
                      className="px-2 py-1 bg-[#e94560]/20 text-[#e94560] rounded text-sm font-medium flex items-center gap-1"
                    >
                      {seat}
                      <button onClick={() => toggleSeat(seat)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mb-4">No seats selected</p>
              )}
            </div>

            <div className="border-t border-[#0f3460] pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-2xl font-bold text-white">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || isBooking}
              className="w-full bg-[#e94560] hover:bg-[#d63050] text-white py-6 text-lg font-semibold"
            >
              {isBooking ? (
                "Processing..."
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Confirm Booking
                </>
              )}
            </Button>

            <p className="text-center text-gray-500 text-xs mt-4">
              By confirming, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
