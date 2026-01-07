import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] border-t border-[#16213e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black">
                <span className="text-[#e94560]">BOOK</span>
                <span className="text-white">MY</span>
                <span className="text-[#0f3460]">SHOW</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Your one-stop destination for booking movie tickets online. Experience cinema like never before.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#e94560] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#e94560] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#e94560] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#e94560] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/theaters" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                  Theaters
                </Link>
              </li>
              <li>
                <Link href="/my-tickets" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                  My Tickets
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#e94560] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Cinema Street, Film City,<br />Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#e94560] flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#e94560] flex-shrink-0" />
                <span className="text-gray-400 text-sm">support@bookmyshow.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#16213e]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} BookMyShow. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                Privacy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                Terms
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#e94560] transition-colors text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
