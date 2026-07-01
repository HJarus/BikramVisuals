import { getLenis } from '../hooks/useLenis'

export default function Footer() {
  const scrollTo = (id: string) => {
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

  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://instagram.com/bikramvisuals',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com/bikramvisuals',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com/@bikramvisuals',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="relative w-full bg-[#0A0A0A] border-t border-[#1A1A1A]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button
              onClick={() => scrollTo('hero')}
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-full border border-[#C9A84C] flex items-center justify-center">
                <span className="text-[#C9A84C] font-serif text-xl font-medium">B</span>
              </div>
              <span className="font-serif text-2xl tracking-wide text-[#E5E5E5] group-hover:text-[#C9A84C] transition-colors">
                Bikram Visuals
              </span>
            </button>

            <p className="mt-6 text-[#8A8A8A] font-light leading-relaxed max-w-md">
              Premium wedding photography, videography, and creative visual
              storytelling based in Butwal, Nepal. Capturing moments that last a
              lifetime.
            </p>

            {/* Social Links */}
            <div className="mt-8 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#1A1A1A] flex items-center justify-center text-[#8A8A8A] hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] tracking-[3px] uppercase text-[#C9A84C] font-medium mb-6">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.target}>
                  <button
                    onClick={() => scrollTo(link.target)}
                    className="text-[#8A8A8A] hover:text-[#E5E5E5] transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[11px] tracking-[3px] uppercase text-[#C9A84C] font-medium mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-[#8A8A8A]">
              <li>Butwal-11, Rupandehi</li>
              <li>Lumbini Province, Nepal</li>
              <li className="pt-2">
                <a
                  href="tel:+97798XXXXXXXX"
                  className="hover:text-[#C9A84C] transition-colors"
                >
                  +977 9804440944
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@bikramvisuals.com"
                  className="hover:text-[#C9A84C] transition-colors"
                >
                  bikrambhusal1234@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#1A1A1A] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-[#8A8A8A]">
            &copy; {new Date().getFullYear()} Bikram Visuals. All rights reserved.
          </p>
          <p className="text-[11px] text-[#8A8A8A]/60 tracking-wide">
            Crafted with passion in Butwal, Nepal
          </p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/9779804440944"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/20 hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </footer>
  )
}
