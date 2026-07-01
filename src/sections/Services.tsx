import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getLenis } from '../hooks/useLenis'

// Fibonacci sphere distribution
function fibonacciSphere(
  count: number,
  radius: number,
  offset: [number, number, number]
) {
  const points: { x: number; y: number; z: number }[] = []
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = phi * i
    const x = Math.cos(theta) * radiusAtY
    const z = Math.sin(theta) * radiusAtY
    points.push({
      x: x * radius + offset[0],
      y: y * radius + offset[1],
      z: z * radius + offset[2],
    })
  }
  return points
}

// Ring configuration
const RING_CONFIG = [
  { count: 5, radius: 2, speed: 0.3 },
  { count: 8, radius: 4, speed: 0.2 },
  { count: 12, radius: 6, speed: 0.15 },
]

const portfolioImages = [
  '/images/portfolio-1.jpg',
  '/images/portfolio-2.jpg',
  '/images/portfolio-3.jpg',
  '/images/portfolio-4.jpg',
  '/images/portfolio-5.jpg',
  '/images/portfolio-6.jpg',
  '/images/portfolio-7.jpg',
  '/images/portfolio-8.jpg',
  '/images/portfolio-9.jpg',
  '/images/portfolio-10.jpg',
]

// Single image plane in the helix
function ImagePlane({
  position,
  imageUrl,
  ringIndex,
  index,
}: {
  position: { x: number; y: number; z: number }
  imageUrl: string
  ringIndex: number
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.load(imageUrl, (tex) => {
      tex.minFilter = THREE.LinearFilter
      tex.magFilter = THREE.LinearFilter
      setTexture(tex)
    })
  }, [imageUrl])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.lookAt(0, 0, 8)
      // Subtle floating animation
      meshRef.current.position.y +=
        Math.sin(state.clock.elapsedTime * 0.5 + index + ringIndex) * 0.001
    }
  })

  if (!texture) return null

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
      <planeGeometry args={[1.2, 1.6]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}

// Ring component
function Ring({
  config,
  images,
  ringIndex,
}: {
  config: (typeof RING_CONFIG)[0]
  images: string[]
  ringIndex: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const positions = useMemo(
    () => fibonacciSphere(config.count, config.radius, [0, 0, 0]),
    [config]
  )

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += config.speed * 0.005
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <ImagePlane
          key={`${ringIndex}-${i}`}
          position={pos}
          imageUrl={images[i % images.length]}
          ringIndex={ringIndex}
          index={i}
        />
      ))}
    </group>
  )
}

// 3D Scene
function HelixScene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 0, 10]} intensity={0.5} />
      {RING_CONFIG.map((config, i) => (
        <Ring
          key={i}
          config={config}
          images={portfolioImages}
          ringIndex={i}
        />
      ))}
    </>
  )
}

const services = [
  {
    title: 'Wedding Photography',
    description:
      'Complete coverage of your special day — from preparation to reception. Candid moments, staged portraits, and everything in between.',
    price: 'Starting from NPR 75,000',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: 'Music Video Production',
    description:
      'Cinematic music videos with professional color grading, creative storytelling, and high-quality production value for artists.',
    price: 'Starting from NPR 50,000',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    title: 'Event Coverage',
    description:
      'Professional documentation of corporate events, cultural programs, birthdays, and special occasions with full editing.',
    price: 'Starting from NPR 25,000',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: 'Custom Photo Session',
    description:
      'Personalized portrait sessions — family, maternity, pre-wedding, or creative conceptual shoots tailored to your vision.',
    price: 'Starting from NPR 15,000',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
      </svg>
    ),
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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
    if (cardsRef.current) observer.observe(cardsRef.current)

    return () => observer.disconnect()
  }, [])

  const scrollToContact = () => {
    const lenis = getLenis()
    const el = document.getElementById('contact')
    if (lenis && el) {
      lenis.scrollTo(el, { offset: -80 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full py-32 lg:py-[200px] bg-[#0A0A0A] overflow-hidden"
    >
      {/* 3D Helix Background */}
      <div className="absolute inset-0 opacity-40">
        <Canvas
          camera={{ position: [0, 0, 14], fov: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <HelixScene />
        </Canvas>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A] pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div ref={headingRef} className="section-fade-in text-center mb-20">
          <span className="text-[11px] tracking-[3px] uppercase text-[#C9A84C] font-medium">
            What We Offer
          </span>
          <h2 className="mt-6 font-serif text-4xl sm:text-5xl lg:text-[72px] font-light leading-[1.1] tracking-[-1.5px] text-[#E5E5E5]">
            Signature
            <br />
            <span className="text-[#C9A84C]">Collection</span>
          </h2>
          <p className="mt-6 text-lg text-[#8A8A8A] font-light max-w-xl mx-auto">
            Tailored packages designed to capture every moment that matters to you
          </p>
        </div>

        {/* Center Typography Lockup */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 hidden lg:block">
          <p
            className="text-[13px] tracking-[4px] uppercase text-[#E5E5E5]/20 whitespace-nowrap"
            style={{ mixBlendMode: 'difference' }}
          >
            Wedding &bull; Event &bull; Portrait &bull; Commercial
          </p>
        </div>

        {/* Service Cards */}
        <div
          ref={cardsRef}
          className="section-fade-in grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, i) => (
            <div
              key={service.title}
              className="group relative bg-[#111111]/80 backdrop-blur-sm border border-[#1A1A1A] rounded-sm p-8 hover:border-[#C9A84C]/30 transition-all duration-500 hover:-translate-y-1"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] group-hover:bg-[#C9A84C]/10 transition-all">
                {service.icon}
              </div>

              <h3 className="mt-6 font-serif text-2xl text-[#E5E5E5] group-hover:text-[#C9A84C] transition-colors">
                {service.title}
              </h3>

              <p className="mt-4 text-[15px] text-[#8A8A8A] leading-relaxed">
                {service.description}
              </p>

              <div className="mt-6 pt-6 border-t border-[#1A1A1A]">
                <p className="text-[13px] tracking-[1px] text-[#C9A84C]">
                  {service.price}
                </p>
              </div>

              <button
                onClick={scrollToContact}
                className="mt-6 text-[12px] tracking-[1.5px] uppercase text-[#8A8A8A] hover:text-[#C9A84C] transition-colors flex items-center gap-2 group/btn"
              >
                Get Quote
                <svg
                  className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
