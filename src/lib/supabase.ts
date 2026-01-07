import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Movie = {
  id: string
  title: string
  description: string
  duration: number
  genre: string[]
  poster_url: string
  backdrop_url: string
  release_date: string
  rating: number
  language: string
  is_now_showing: boolean
  is_coming_soon: boolean
  trailer_url: string
  created_at: string
  updated_at: string
}

export type Theater = {
  id: string
  name: string
  location: string
  city: string
  address: string
  phone: string
  image_url: string
  created_at: string
}

export type Screen = {
  id: string
  theater_id: string
  screen_number: number
  capacity: number
  screen_type: string
  created_at: string
  theater?: Theater
}

export type Show = {
  id: string
  movie_id: string
  screen_id: string
  start_time: string
  end_time: string
  price: number
  available_seats: number
  created_at: string
  movie?: Movie
  screen?: Screen & { theater?: Theater }
}

export type Ticket = {
  id: string
  user_id: string
  show_id: string
  seats_booked: string[]
  total_price: number
  booking_status: 'pending' | 'confirmed' | 'cancelled'
  booking_code: string
  created_at: string
  show?: Show
}

export type Review = {
  id: string
  user_id: string
  movie_id: string
  rating: number
  comment: string
  created_at: string
}

export type Profile = {
  id: string
  username: string
  full_name: string
  avatar_url: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}
