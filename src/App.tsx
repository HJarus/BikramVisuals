import { useLenisInit } from './hooks/useLenis'
import Navbar from './sections/Navbar'
import Hero from './sections/Hero'
import Narrative from './sections/Narrative'
import Services from './sections/Services'
import Portfolio from './sections/Portfolio'
import Testimonials from './sections/Testimonials'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  useLenisInit()

  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <main>
        <Hero />
        <Narrative />
        <Services />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
