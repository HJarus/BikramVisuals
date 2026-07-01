import { useEffect, useRef, useState } from 'react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Bride',
    text: 'Bikram and his team captured our wedding with such grace and artistry. Every photograph tells a story — the emotion, the colors, the little details we missed in the moment. Looking through our album still brings tears to my eyes.',
    location: 'Butwal, Nepal',
  },
  {
    name: 'Ramesh Adhikari',
    role: 'Groom',
    text: 'We hired Bikram Visuals for our pre-wedding shoot and the results were beyond our imagination. The cinematic quality, the creative angles, and the way they made us feel comfortable — truly world-class work right here in Nepal.',
    location: 'Kathmandu, Nepal',
  },
  {
    name: 'Sunita Gurung',
    role: 'Event Organizer',
    text: 'As an event planner, I have worked with many photographers over the years. Bikram Visuals stands out for their professionalism, creativity, and ability to capture candid moments that others miss. My clients always love the results.',
    location: 'Pokhara, Nepal',
  },
  {
    name: 'Amit KC',
    role: 'Music Artist',
    text: 'The music video they produced for my single was phenomenal. The storytelling, the cinematography, the color grading — everything was cinema-quality. They understood my vision and elevated it beyond what I imagined.',
    location: 'Lumbini, Nepal',
  },
  {
    name: 'Deepa and Raj',
    role: 'Anniversary Couple',
    text: 'For our 25th anniversary, we wanted something special. Bikram created a beautiful photo session that honored our journey together. The images are timeless — our grandchildren will treasure them forever.',
    location: 'Bhairahawa, Nepal',
  },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.2 }
    )

    if (headingRef.current) observer.observe(headingRef.current)

    return () => observer.disconnect()
  }, [])

  // Scroll snap observer
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.offsetWidth * 0.85
      const newIndex = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.max(0, Math.min(newIndex, testimonials.length - 1)))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative w-full py-32 lg:py-[200px] bg-[#0A0A0A] overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(201,168,76,0.06) 0%, rgba(10,10,10,0) 70%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headingRef} className="section-fade-in text-center mb-16">
          <span className="text-[11px] tracking-[3px] uppercase text-[#C9A84C] font-medium">
            Client Stories
          </span>
          <h2 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-[72px] font-light leading-[1.1] tracking-[-1.5px] text-[#E5E5E5]">
            The
            <br />
            <span className="text-[#C9A84C]">Experience</span>
          </h2>
        </div>

        {/* Horizontal Scroll Testimonials */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[85vw] sm:w-[60vw] lg:w-[45vw] snap-center"
            >
              <div className="h-full bg-[#111111]/60 backdrop-blur-sm border border-[#1A1A1A] rounded-sm p-8 lg:p-12 hover:border-[#C9A84C]/20 transition-all duration-500">
                {/* Quote icon */}
                <div className="text-[#C9A84C]/20 font-serif text-6xl leading-none">
                  &ldquo;
                </div>

                <p className="mt-4 text-lg lg:text-xl text-[#E5E5E5] font-light leading-relaxed italic">
                  {testimonial.text}
                </p>

                <div className="mt-8 pt-6 border-t border-[#1A1A1A] flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C9A84C]/30 to-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                    <span className="font-serif text-lg text-[#C9A84C]">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <div className="font-medium text-[#E5E5E5]">
                      {testimonial.name}
                    </div>
                    <div className="text-[13px] text-[#8A8A8A]">
                      {testimonial.role} — {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const container = scrollContainerRef.current
                if (container) {
                  const cardWidth = container.offsetWidth * 0.85
                  container.scrollTo({
                    left: cardWidth * i,
                    behavior: 'smooth',
                  })
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 bg-[#C9A84C]'
                  : 'bg-[#8A8A8A]/30 hover:bg-[#8A8A8A]/50'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
