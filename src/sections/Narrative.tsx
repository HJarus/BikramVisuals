import { useEffect, useRef } from 'react'

export default function Narrative() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

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

    if (contentRef.current) observer.observe(contentRef.current)
    if (imageRef.current) observer.observe(imageRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="narrative"
      ref={sectionRef}
      className="relative w-full py-32 lg:py-[200px] bg-[#0A0A0A] overflow-hidden"
    >
      {/* Subtle radial glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(201,168,76,0.08) 0%, rgba(10,10,10,0) 70%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <div ref={contentRef} className="section-fade-in">
            <span className="text-[11px] tracking-[3px] uppercase text-[#C9A84C] font-medium">
              Our Story
            </span>

            <h2 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-[72px] font-light leading-[1.1] tracking-[-1.5px] text-[#E5E5E5]">
              We don&apos;t just
              <br />
              capture images;
              <br />
              <span className="text-[#C9A84C]">we weave narratives.</span>
            </h2>

            <div className="mt-8 space-y-6 text-lg text-[#8A8A8A] font-light leading-relaxed max-w-lg">
              <p>
                Based in the heart of{' '}
                <strong className="text-[#E5E5E5] font-normal">Butwal, Nepal</strong>,
                Bikram Visuals is a passionate team of storytellers dedicated to
                preserving your most precious memories through the art of
                photography and filmmaking.
              </p>
              <p>
                Our lens focuses on the unseen details — the quiet glances, the
                roaring laughter, the unscripted joy that makes each moment
                uniquely yours. Every frame we create is a chapter in your story.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-6">
              <div className="w-16 h-[1px] bg-[#C9A84C]" />
              <span className="text-[13px] tracking-[1.5px] uppercase text-[#8A8A8A]">
                Est. 2017 — Butwal, Nepal
              </span>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="section-fade-in relative">
            <div className="relative aspect-[16/10] lg:aspect-[16/12] overflow-hidden rounded-sm">
              <img
                src="./images/narrative.jpg"
                alt="Professional photographer capturing golden hour moments in Nepal"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/40 via-transparent to-transparent" />
            </div>

            {/* Decorative frame corner */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-[#C9A84C]/30" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-[#C9A84C]/30" />

            {/* Floating badge */}
            <div className="absolute -bottom-6 left-8 bg-[#111111] border border-[#1A1A1A] px-6 py-4 rounded-sm">
              <div className="font-serif text-3xl text-[#C9A84C]">8+</div>
              <div className="text-[11px] tracking-[1.5px] uppercase text-[#8A8A8A] mt-1">
                Years of Excellence
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
