import { Canvas, useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import * as THREE from "three"

const images = [
  "/images/portfolio-1.jpg",
  "/images/portfolio-2.jpg",
  "/images/portfolio-3.jpg",
  "/images/portfolio-4.jpg",
  "/images/portfolio-5.jpg",
  "/images/portfolio-6.jpg",
  "/images/portfolio-7.jpg",
  "/images/portfolio-8.jpg",
  "/images/portfolio-9.jpg",
  "/images/portfolio-10.jpg",
  "/images/portfolio-11.jpg",
  "/images/portfolio-12.jpg",
]

const RADIUS = 5

function Cylinder() {
  const group = useRef<THREE.Group>(null)

  const scroll = useRef(0)
  const targetScroll = useRef(0)
  const lastY = useRef(0)

  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader()

    return images.map((img) => {
      const tex = loader.load(img)
      tex.colorSpace = THREE.SRGBColorSpace
      return tex
    })
  }, [])

  /* -----------------------------
     SCROLL DRIVER (SMOOTH + LOOP)
  ------------------------------*/
  useFrame(() => {
    const currentY = window.scrollY
    const delta = currentY - lastY.current
    lastY.current = currentY

    targetScroll.current += delta * 0.002

    scroll.current += (targetScroll.current - scroll.current) * 0.08

    if (group.current) {
      group.current.rotation.y = scroll.current
    }
  })

  return (
    <group ref={group}>
      {textures.map((texture, i) => {
        const angle = (i / textures.length) * Math.PI * 2

        return (
          <mesh
            key={i}
            position={[
              Math.sin(angle) * RADIUS,
              0,
              Math.cos(angle) * RADIUS,
            ]}
            rotation={[0, -angle, 0]}
          >
            <planeGeometry args={[2.2, 3]} />
            <meshBasicMaterial map={texture} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function ScrollCylinder() {
  return (
    <div className="h-[300vh] bg-black">
      <div className="sticky top-0 h-screen">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={1} />
          <Cylinder />
        </Canvas>
      </div>
    </div>
  )
}