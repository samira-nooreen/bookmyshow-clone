import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { supabase, type Ticket } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Ticket as TicketIcon, Calendar, Clock, MapPin, QrCode, Car, Map as MapIcon, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

async function getTickets(userId: string) {
  const { data } = await supabase
    .from("tickets")
    .select(`
      *,
      show:shows(
        *,
        movie:movies(*),
        screen:screens(
          *,
          theater:theaters(*)
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
  
  return (data || []) as (Ticket & {
    show: {
      start_time: string
      movie: { title: string; poster_url: string }
      screen: {
        screen_number: number
        screen_type: string
        theater: { name: string; location: string; city: string }
      }
    }
  })[]
}

export default async function MyTicketsPage() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/login?redirect=/my-tickets")
  }

  const tickets = await getTickets(user.id)

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <TicketIcon className="w-8 h-8 text-[#e94560]" />
            <h1 className="text-3xl font-bold text-white">My Tickets</h1>
          </div>

          {tickets.length === 0 ? (
            <div className="bg-[#16213e] rounded-xl p-12 text-center border border-[#0f3460]">
              <TicketIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No tickets yet</h2>
              <p className="text-gray-400 mb-6">You haven&apos;t booked any tickets yet. Start exploring movies!</p>
              <Link href="/movies" className="inline-block px-6 py-3 bg-[#e94560] hover:bg-[#d63050] text-white rounded-lg font-medium transition-colors">
                Browse Movies
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="bg-[#16213e] rounded-xl overflow-hidden border border-[#0f3460]">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-40 aspect-[2/3] md:aspect-auto flex-shrink-0">
                      <Image
                        src={ticket.show.movie.poster_url}
                        alt={ticket.show.movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{ticket.show.movie.title}</h3>
                          <Badge className={
                            ticket.booking_status === "confirmed" 
                              ? "bg-green-500/20 text-green-400 border-green-500/30" 
                              : ticket.booking_status === "cancelled"
                              ? "bg-red-500/20 text-red-400 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }>
                            {ticket.booking_status.charAt(0).toUpperCase() + ticket.booking_status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">₹{ticket.total_price}</p>
                          <p className="text-gray-400 text-sm">{ticket.seats_booked.length} seats</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(ticket.show.start_time), "EEE, MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(ticket.show.start_time), "h:mm a")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 col-span-2">
                          <MapPin className="w-4 h-4" />
                          <span>{ticket.show.screen.theater.name}, {ticket.show.screen.theater.city}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#0f3460]">
                        <div>
                          <p className="text-gray-400 text-sm">Seats</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {ticket.seats_booked.sort().map((seat) => (
                              <span key={seat} className="px-2 py-1 bg-[#0f3460] text-white rounded text-sm font-medium">
                                {seat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <QrCode className="w-5 h-5" />
                          <span className="font-mono text-sm">{ticket.booking_code}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
