import { useEffect, useState, useRef } from 'react'
import { getLenis } from '../hooks/useLenis'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMobileOpen(false)
    const lenis = getLenis()
    const el = document.getElementById(id)
    if (lenis && el) {
      lenis.scrollTo(el, { offset: -80 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { label: 'Home', target: 'hero' },
    { label: 'Work', target: 'portfolio' },
    { label: 'Services', target: 'services' },
    { label: 'Studio', target: 'narrative' },
    { label: 'Contact', target: 'contact' },
  ]

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1A1A1A]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full border border-[#C9A84C] flex items-center justify-center">
            <span className="text-[#C9A84C] font-serif text-lg font-medium">B</span>
          </div>
          <span className="font-serif text-xl tracking-wide text-[#E5E5E5] group-hover:text-[#C9A84C] transition-colors">
            Bikram Visuals
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => scrollTo(link.target)}
              className="nav-link text-[13px] font-medium tracking-[1.5px] uppercase text-[#8A8A8A] hover:text-[#E5E5E5] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-[1.5px] bg-[#E5E5E5] transition-all duration-300 ${
              mobileOpen ? 'rotate-45 translate-y-[4.5px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[1.5px] bg-[#E5E5E5] transition-all duration-300 ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-[1.5px] bg-[#E5E5E5] transition-all duration-300 ${
              mobileOpen ? '-rotate-45 -translate-y-[4.5px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#0A0A0A]/98 backdrop-blur-md border-b border-[#1A1A1A] transition-all duration-500 overflow-hidden ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => scrollTo(link.target)}
              className="text-left text-[13px] font-medium tracking-[1.5px] uppercase text-[#8A8A8A] hover:text-[#C9A84C] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
