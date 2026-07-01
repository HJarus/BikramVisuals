import { useEffect, useRef, useState } from 'react'

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    if (headingRef.current) observer.observe(headingRef.current)
    if (formRef.current) observer.observe(formRef.current)

    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-32 lg:py-[200px] bg-[#0A0A0A] overflow-hidden"
    >
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(201,168,76,0.06) 0%, rgba(10,10,10,0) 70%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headingRef} className="section-fade-in text-center mb-16">
          <span className="text-[11px] tracking-[3px] uppercase text-[#C9A84C] font-medium">
            Get In Touch
          </span>
          <h2 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-[72px] font-light leading-[1.1] tracking-[-1.5px] text-[#E5E5E5]">
            Book Your
            <br />
            <span className="text-[#C9A84C]">Session</span>
          </h2>
          <p className="mt-6 text-lg text-[#8A8A8A] font-light max-w-lg mx-auto">
            Ready to tell your story? Let&apos;s create something beautiful together.
            Reach out and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Form */}
          <div ref={formRef} className="section-fade-in">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="w-full bg-transparent border-b border-[#8A8A8A]/30 pb-3 text-[#E5E5E5] placeholder:text-[#8A8A8A]/50 focus:border-[#C9A84C] focus:outline-none transition-colors text-lg font-light"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number"
                  className="w-full bg-transparent border-b border-[#8A8A8A]/30 pb-3 text-[#E5E5E5] placeholder:text-[#8A8A8A]/50 focus:border-[#C9A84C] focus:outline-none transition-colors text-lg font-light"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address"
                  className="w-full bg-transparent border-b border-[#8A8A8A]/30 pb-3 text-[#E5E5E5] placeholder:text-[#8A8A8A]/50 focus:border-[#C9A84C] focus:outline-none transition-colors text-lg font-light"
                />
              </div>

              {/* Service Type */}
              <div className="relative">
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-[#8A8A8A]/30 pb-3 text-[#E5E5E5] focus:border-[#C9A84C] focus:outline-none transition-colors text-lg font-light appearance-none cursor-pointer"
                  style={{ backgroundColor: '#0A0A0A' }}
                >
                  <option value="" disabled className="bg-[#0A0A0A] text-[#8A8A8A]">
                    Select Service Type
                  </option>
                  <option value="wedding" className="bg-[#0A0A0A]">
                    Wedding Photography & Videography
                  </option>
                  <option value="music" className="bg-[#0A0A0A]">
                    Music Video Production
                  </option>
                  <option value="event" className="bg-[#0A0A0A]">
                    Special Events Coverage
                  </option>
                  <option value="custom" className="bg-[#0A0A0A]">
                    Custom Photo/Video Session
                  </option>
                </select>
                <svg
                  className="absolute right-0 bottom-4 w-5 h-5 text-[#8A8A8A] pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us about your vision..."
                  className="w-full bg-transparent border-b border-[#8A8A8A]/30 pb-3 text-[#E5E5E5] placeholder:text-[#8A8A8A]/50 focus:border-[#C9A84C] focus:outline-none transition-colors text-lg font-light resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="group relative px-10 py-4 bg-[#C9A84C] text-[#0A0A0A] font-medium text-[13px] tracking-[1.5px] uppercase rounded-full overflow-hidden transition-transform hover:scale-105 w-full sm:w-auto"
                >
                  <span className="absolute inset-0 gold-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">
                    {submitted ? 'Message Sent!' : 'Send Message'}
                  </span>
                </button>
              </div>
            </form>

            {/* WhatsApp CTA */}
            <div className="mt-12 pt-8 border-t border-[#1A1A1A]">
              <p className="text-[#8A8A8A] text-sm mb-4">
                Prefer a quick chat? Message us on WhatsApp
              </p>
              <a
                href="https://wa.me/9779804440944"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[#25D366]/10 border border-[#25D366]/30 rounded-full text-[#25D366] hover:bg-[#25D366]/20 transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-[13px] font-medium tracking-[1px] uppercase">
                  Chat on WhatsApp
                </span>
              </a>
            </div>
          </div>

          {/* Right Column - Info & Map */}
          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  label: 'Phone',
                  value: '+977 9804440944',
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  ),
                },
                {
                  label: 'Email',
                  value: 'bikrambhusal1234@gmail.com',
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[#111111]/60 border border-[#1A1A1A] rounded-sm p-6 hover:border-[#C9A84C]/20 transition-all"
                >
                  <div className="text-[#C9A84C]">{item.icon}</div>
                  <div className="mt-4 text-[11px] tracking-[2px] uppercase text-[#8A8A8A]">
                    {item.label}
                  </div>
                  <div className="mt-2 text-[#E5E5E5] text-sm">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#1A1A1A]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56507.08932727869!2d83.36422765!3d27.6955021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3996842749a492b7%3A0x33b3d75705585308!2sButwal%2C%20Nepal!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bikram Visuals Studio Location - Butwal, Nepal"
              />
            </div>

            {/* Studio Address */}
            <div className="bg-[#111111]/60 border border-[#1A1A1A] rounded-sm p-6">
              <div className="flex items-start gap-4">
                <div className="text-[#C9A84C] mt-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[11px] tracking-[2px] uppercase text-[#8A8A8A] mb-2">
                    Studio Address
                  </div>
                  <p className="text-[#E5E5E5]">
                    Butwal-11, Rupandehi
                    <br />
                    Lumbini Province, Nepal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
