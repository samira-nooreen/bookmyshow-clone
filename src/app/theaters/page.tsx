import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { supabase, type Theater } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

async function getTheaters() {
  const { data } = await supabase
    .from("theaters")
    .select("*")
    .order("name", { ascending: true })
  
  return (data || []) as Theater[]
}

export default async function TheatersPage() {
  const theaters = await getTheaters()

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Theaters</h1>
            <p className="text-gray-400">Find the perfect cinema near you</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {theaters.map((theater) => (
              <Link 
                key={theater.id} 
                href={`/movies`}
                className="group bg-[#16213e] rounded-xl overflow-hidden border border-[#0f3460] hover:border-[#e94560]/50 transition-colors"
              >
                <div className="relative h-48">
                  <Image
                    src={theater.image_url || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800"}
                    alt={theater.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16213e] to-transparent" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#e94560] transition-colors">
                    {theater.name}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-gray-400">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{theater.location}, {theater.city}</span>
                    </div>
                    {theater.phone && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{theater.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
