import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getLenis } from '../hooks/useLenis'

// Shader for image reveal with brush glow
const revealVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const revealFragmentShader = `
  precision highp float;
  uniform vec2 uRatio;
  uniform float uRadius;
  uniform vec3 uColor;
  uniform sampler2D uImage;
  uniform vec2 uImageRes;
  uniform vec2 uRes;
  uniform float uTime;
  uniform float uSpeed;
  uniform sampler2D uBackground;
  uniform sampler2D uBackground2;
  uniform float uMix;
  varying vec2 vUv;

  vec2 getCoverUv(vec2 uv, vec2 resolution, vec2 imageRes) {
    vec2 ratio = vec2(
      min((resolution.x / resolution.y) / (imageRes.x / imageRes.y), 1.0),
      min((resolution.y / resolution.x) / (imageRes.y / imageRes.x), 1.0)
    );
    return vec2(
      uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  }
    float random(vec2 st)
{
    return fract(
        sin(dot(st.xy, vec2(12.9898,78.233)))
        *43758.5453123
    );
}

float noise(vec2 st)
{
    vec2 i=floor(st);
    vec2 f=fract(st);

    float a=random(i);
    float b=random(i+vec2(1.0,0.0));
    float c=random(i+vec2(0.0,1.0));
    float d=random(i+vec2(1.0,1.0));

    vec2 u=f*f*(3.0-2.0*f);

    return mix(a,b,u.x)+
           (c-a)*u.y*(1.0-u.x)+
           (d-b)*u.x*u.y;
}

  void main() {
    vec2 coverUv = getCoverUv(vUv, uRes, uImageRes);

    vec4 image = texture2D(uImage, coverUv);
    vec4 smoke1 =
texture2D(uBackground,coverUv);

vec2 uv2 =
(coverUv-0.5)*1.18+0.5;

uv2.x += sin(uTime*0.03)*0.02;

uv2.y += cos(uTime*0.02)*0.01;

vec4 smoke2 =
texture2D(uBackground2,uv2);
smoke2.rgb =
mix(
vec3(0.0),
smoke2.rgb,
0.7
);
vec4 background =
mix(
smoke1,
smoke2,
uMix
);

    //-------------------------------------------------------
    // Fixed reveal position (NOT mouse)
    //-------------------------------------------------------

    vec2 center = vec2(0.68, 0.50);

    float dist = distance(vUv, center);

    //-------------------------------------------------------
    // Organic edge
    //-------------------------------------------------------

    float n = noise(vUv * 8.0 + uTime * 0.15);

    float radius = uRadius + (n - 0.5) * 0.06;

    float reveal =
        1.0 -
        smoothstep(
            radius - 0.12,
            radius + 0.12,
            dist
        );

    //-------------------------------------------------------
    // Soft cinematic glow
    //-------------------------------------------------------

    float glow =
        exp(-dist * 3.5);

    glow *= 0.65;

    vec3 glowTint = vec3(
        1.0,
        0.80,
        0.35
    );

    vec3 color =
        mix(
            background.rgb,
            glowTint,
            glow
        );

    //-------------------------------------------------------
    // Reveal image
    //-------------------------------------------------------

    color =
        mix(
            color,
            image.rgb,
            reveal
        );

    //-------------------------------------------------------
    // Tiny shimmer
    //-------------------------------------------------------

    float shimmer =
        0.97 +
        0.03 *
        sin(
            uTime * 2.0 +
            dist * 20.0
        );

    color *= shimmer;

    gl_FragColor = vec4(color, 1.0);
}
`
// Background video plane
function BackgroundVideo({ videoTexture }: { videoTexture: THREE.VideoTexture }) {
  const { viewport } = useThree()
  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshBasicMaterial map={videoTexture} toneMapped={false} />
    </mesh>
  )
}

// Brush reveal mesh
function BrushReveal({
  videoTexture,
  videoTexture2,
  revealTexture,
  mousePos,
}: {
  videoTexture: THREE.VideoTexture
  videoTexture2: THREE.VideoTexture
  revealTexture: THREE.Texture
  mousePos: React.MutableRefObject<{ x: number; y: number }>
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport, size } = useThree()

  const uniforms = useMemo(
    () => ({
      uRatio: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: 0.35 },
      uColor: { value: new THREE.Color('#C9A84C') },
      uImage: { value: revealTexture },
      uImageRes: { value: new THREE.Vector2(768, 1024) },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
      uTime: { value: 0 },
      uSpeed: { value: 0.5 },
      uBackground: { value: videoTexture },
      uBackground2: { value: videoTexture2 },
      uMix: { value: 0.35 },
    }),
    [revealTexture, videoTexture, videoTexture2, size]
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uRatio.value.set(
        mousePos.current.x,
        mousePos.current.y
      )
      materialRef.current.uniforms.uRes.value.set(size.width, size.height)

      // Crossfade the two video layers around each one's loop seam.
      // Whichever video is safely mid-clip stays fully visible; whichever
      // is approaching (or just past) its own loop point fades toward the
      // other, so the hard cut of a native video loop is never seen.
      const vidA = videoTexture.image as HTMLVideoElement | undefined
      const vidB = videoTexture2.image as HTMLVideoElement | undefined

      if (vidA && vidB && vidA.duration && vidB.duration) {
        const FADE_WINDOW = 0.75 // seconds either side of a loop seam to crossfade over

        const seamSafety = (video: HTMLVideoElement) => {
          const distToEdge = Math.min(video.currentTime, video.duration - video.currentTime)
          const t = THREE.MathUtils.clamp(distToEdge / FADE_WINDOW, 0, 1)
          return t * t * (3 - 2 * t) // smoothstep for a gentler crossfade curve
        }

        const safeA = seamSafety(vidA)
        const safeB = seamSafety(vidB)
        const total = safeA + safeB

        // mixB is the weight given to video B (uBackground2). Falls back to
        // the resting 0.35 split if both videos somehow report unsafe at once.
        const mixB = total > 0.001 ? safeB / total : 0.35
        materialRef.current.uniforms.uMix.value = mixB
      }
    }
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={revealVertexShader}
        fragmentShader={revealFragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

// Floating particles for atmosphere
function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 80

  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return pos
  })

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i++) {
        posArray[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.0003
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#C9A84C"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

// WebGL Scene
function HeroScene({
  videoTexture,
  videoTexture2,
  revealTexture,
  mousePos,
}: {
  videoTexture: THREE.VideoTexture
  videoTexture2: THREE.VideoTexture
  revealTexture: THREE.Texture
  mousePos: React.MutableRefObject<{ x: number; y: number }>
}) {
  return (
    <>
      <BackgroundVideo videoTexture={videoTexture} />
      <BrushReveal
        videoTexture={videoTexture}
        videoTexture2={videoTexture2}
        revealTexture={revealTexture}
        mousePos={mousePos}
      />
      <FloatingParticles />
    </>
  )
}

export default function Hero() {
  const mousePos = useRef({ x: 0.5, y: 0.5 })
  const targetMouse = useRef({ x: 0.5, y: 0.5 })
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [texturesReady, setTexturesReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const video2Ref = useRef<HTMLVideoElement | null>(null)
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null)
  const videoTexture2Ref = useRef<THREE.VideoTexture | null>(null)
  const revealTextureRef = useRef<THREE.Texture | null>(null)

  useEffect(() => {
    // Create video element
    const video = document.createElement('video')
    video.src = '/videos/hero-bg.mp4'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.crossOrigin = 'anonymous'
    videoRef.current = video

    const video2 = document.createElement('video')

    video2.src = '/videos/hero-bg.mp4'
    video2.loop = true
    video2.muted = true
    video2.playsInline = true
    video2.crossOrigin = 'anonymous'
    // Offset by half the clip length so video2's loop seam always lands
    // while video is safely mid-clip (and vice versa) — this is what makes
    // the crossfade in BrushReveal hide the cut instead of both jumping
    // at the same moment.
    video2.addEventListener('loadedmetadata', () => {
      video2.currentTime = video2.duration / 2
    })
    video2Ref.current = video2

    const videoTexture = new THREE.VideoTexture(video)
    const videoTexture2 = new THREE.VideoTexture(video2)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    videoTexture2.minFilter = THREE.LinearFilter
    videoTexture2.magFilter = THREE.LinearFilter
    videoTextureRef.current = videoTexture
    videoTexture2Ref.current = videoTexture2

    // Load reveal image
    const loader = new THREE.TextureLoader()
    loader.load('./images/hero-reveal-1.jpg', (texture) => {
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      revealTextureRef.current = texture

      Promise.all([
        video.play(),
        video2.play()
      ]).then(() => {

        // Playback speed
        video.playbackRate = 0.6
        video2.playbackRate = 0.52

        setTexturesReady(true)

      }).catch(() => {

        setTexturesReady(true)

      })
    })

    return () => {
      video.pause()
      video.src = ''
      videoTexture.dispose()

      video2.pause()
      video2.src = ''
      videoTexture2.dispose()

      if (revealTextureRef.current) revealTextureRef.current.dispose()
    }
  }, [])

  // Smooth mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      }
    }

    const animateMouse = () => {
      mousePos.current.x += (targetMouse.current.x - mousePos.current.x) * 0.05
      mousePos.current.y += (targetMouse.current.y - mousePos.current.y) * 0.05
      requestAnimationFrame(animateMouse)
    }
    requestAnimationFrame(animateMouse)

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollTo = (id: string) => {
    const lenis = getLenis()
    const el = document.getElementById(id)
    if (lenis && el) {
      lenis.scrollTo(el, { offset: -80 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#0A0A0A] flex"
    >
      {/* Booking Badge */}
      <div className="absolute top-24 left-6 lg:left-12 z-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-full">
          <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
          <span className="text-[11px] font-medium tracking-[2px] uppercase text-[#C9A84C]">
            Now Booking 2025 Weddings
          </span>
        </div>
      </div>

      {/* Left: WebGL Canvas (55%) */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 lg:relative lg:w-[55%] lg:h-screen"
      >
        {texturesReady &&
          videoTextureRef.current &&
          videoTexture2Ref.current &&
          revealTextureRef.current && (
            <Canvas
              camera={{ position: [0, 0, 2], fov: 50 }}
              style={{ position: 'absolute', inset: 0 }}
              gl={{ antialias: true, alpha: false }}
            >
              <HeroScene
                videoTexture={videoTextureRef.current}
                videoTexture2={videoTexture2Ref.current}
                revealTexture={revealTextureRef.current}
                mousePos={mousePos}
              />
            </Canvas>
          )}
        {/* Dark overlay for mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0A0A]/80 lg:to-[#0A0A0A]/60 pointer-events-none" />
      </div>

      {/* Right: Content Panel (45%) */}
      <div className="relative z-10 w-full lg:w-[45%] min-h-screen flex flex-col justify-center px-6 lg:px-16 py-32">
        <div className="max-w-lg">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[96px] font-light leading-[0.95] tracking-[-2px] text-[#E5E5E5] text-balance">
            Every Frame,
            <br />
            <span className="text-[#C9A84C]">A Story</span>
          </h1>

          <p className="mt-8 text-lg lg:text-xl text-[#8A8A8A] font-light leading-relaxed max-w-md">
            Capturing the raw emotion of life&apos;s most fleeting moments through
            cinematic photography and videography in Butwal, Nepal.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => scrollTo('portfolio')}
              className="group relative px-8 py-4 bg-[#C9A84C] text-[#0A0A0A] font-medium text-[13px] tracking-[1.5px] uppercase rounded-full overflow-hidden transition-transform hover:scale-105"
            >
              <span className="absolute inset-0 gold-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">Explore Work</span>
            </button>

            <button
              onClick={() => scrollTo('contact')}
              className="px-8 py-4 border border-[#8A8A8A]/30 text-[#E5E5E5] font-medium text-[13px] tracking-[1.5px] uppercase rounded-full hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all"
            >
              Book a Session
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            {[
              { value: '200+', label: 'Weddings' },
              { value: '50+', label: 'Music Videos' },
              { value: '8+', label: 'Years' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-2xl lg:text-3xl text-[#C9A84C] font-light">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] tracking-[1.5px] uppercase text-[#8A8A8A]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="text-[10px] tracking-[3px] uppercase text-[#8A8A8A]">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#C9A84C] to-transparent animate-pulse" />
      </div>
    </section>
  )
}