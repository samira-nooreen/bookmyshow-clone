import { notFound } from "next/navigation"
import { supabase, type Show, type Movie } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { BookingContent } from "./BookingContent"

interface PageProps {
  params: Promise<{ showId: string }>
}

async function getShowDetails(showId: string) {
  const { data } = await supabase
    .from("shows")
    .select(`
      *,
      movie:movies(*),
      screen:screens(
        *,
        theater:theaters(*)
      )
    `)
    .eq("id", showId)
    .single()
  
  return data as (Show & { 
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
  }) | null
}

async function getBookedSeats(showId: string) {
  const { data } = await supabase
    .from("tickets")
    .select("seats_booked")
    .eq("show_id", showId)
    .eq("booking_status", "confirmed")
  
  const bookedSeats: string[] = []
  data?.forEach(ticket => {
    ticket.seats_booked?.forEach((seat: string) => bookedSeats.push(seat))
  })
  return bookedSeats
}

export default async function BookingPage({ params }: PageProps) {
  const { showId } = await params
  const show = await getShowDetails(showId)
  
  if (!show) {
    notFound()
  }

  const bookedSeats = await getBookedSeats(showId)

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      <main className="pt-20 pb-16">
        <BookingContent show={show} bookedSeats={bookedSeats} />
      </main>
      <Footer />
    </div>
  )
}
