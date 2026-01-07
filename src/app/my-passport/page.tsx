import { supabase, type Movie } from "@/lib/supabase"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Award, Ticket, Calendar, ShieldCheck, MapPin } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { redirect } from "next/navigation"

async function getPassportData() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: stamps } = await supabase
    .from("user_stamps")
    .select(`
      *,
      movies (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return stamps as any[] || []
}

export default async function MyPassportPage() {
  const stamps = await getPassportData()

  if (stamps === null) {
    redirect("/login?redirect=/my-passport")
  }

  const movieCount = stamps.length
  const uniqueTheaters = new Set(stamps.map(s => s.movies?.theater_id)).size // This is a bit simplified

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#16213e] to-[#0f0f1a] rounded-3xl p-8 border border-[#0f3460] mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#e94560]/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0f3460]/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-[#e94560] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(233,69,96,0.3)] rotate-3">
                <Award className="w-16 h-16 text-white" />
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-white mb-2 font-display tracking-wide">DIGITAL MOVIE PASSPORT</h1>
                <p className="text-gray-400 max-w-xl">
                  Your journey through the world of cinema. Each movie you watch earns you a unique digital stamp. 
                  Collect them all and unlock exclusive rewards.
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-[#e94560]">{movieCount}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Movies Watched</div>
                  </div>
                  <div className="w-px h-10 bg-gray-800 hidden md:block" />
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-blue-400">{Math.floor(movieCount / 5)}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest">Rewards Unlocked</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stamps.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Stamps Yet</h3>
                <p className="text-gray-500 mb-8">Start watching movies to fill up your passport!</p>
                <a href="/movies" className="inline-block bg-[#e94560] text-white px-8 py-3 rounded-full font-bold hover:bg-[#d63050] transition-all">
                  Browse Movies
                </a>
              </div>
            ) : (
              stamps.map((stamp, index) => (
                <div 
                  key={stamp.id} 
                  className="group relative bg-[#16213e] rounded-2xl border border-[#0f3460] overflow-hidden hover:border-[#e94560]/50 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 z-20">
                    <div className="w-10 h-10 bg-[#e94560] rounded-full flex items-center justify-center border-4 border-[#16213e] shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="relative h-48">
                    <Image
                      src={stamp.movies?.backdrop_url || stamp.movies?.poster_url}
                      alt={stamp.movies?.title}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16213e] to-transparent" />
                    
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-[#e94560] transition-colors">
                        {stamp.movies?.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Issued: {format(new Date(stamp.created_at), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0f0f1a]/50 flex items-center justify-between border-t border-[#0f3460]">
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>Verified Visit</span>
                    </div>
                    <div className="text-[#e94560] text-[10px] font-bold tracking-tighter uppercase border border-[#e94560]/30 px-2 py-0.5 rounded">
                      STAMP #{stamps.length - index}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
