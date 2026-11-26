import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { describeShells, neutrons } from './elements.ts'
import type { Element } from './types.ts'

interface Props {
  element: Element
}

/** Small deterministic random numbers, so an atom looks the same every time. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

/** Points packed inside a sphere, nearest the centre first, for the nucleus. */
function nucleonPositions(count: number, seed: number): THREE.Vector3[] {
  const random = rng(seed)
  const radius = 0.16 * Math.cbrt(count)
  const points: THREE.Vector3[] = []
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt((i + 0.5) / count)
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    points.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)))
  }
  return points
}

/**
 * A colour token from the stylesheet as a Three.js colour. The tokens are
 * OKLCH, which Three.js cannot parse, so the browser paints one pixel and we
 * read back its sRGB value.
 */
function token(name: string): THREE.Color {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#888'
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  if (!ctx) return new THREE.Color(0x888888)
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace)
}

/**
 * A Bohr model of the element: protons and neutrons in the nucleus, and each
 * shell's electrons orbiting on a ring. It is the textbook simplification, not
 * how electrons really behave, and the caption says so.
 */
export default function BohrModel({ element }: Props) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      el.dataset.failed = 'true'
      return
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    const shellRadius = (i: number) => 1.1 + i * 0.62
    const outer = shellRadius(element.shells.length - 1)
    camera.position.set(0, outer * 0.9, outer * 3.1)

    scene.add(new THREE.AmbientLight(0xffffff, 1.4))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(3, 5, 4)
    scene.add(key)

    const disposables: { dispose(): void }[] = []
    const keep = <T extends { dispose(): void }>(thing: T) => (disposables.push(thing), thing)

    // Nucleus: one instanced mesh, coloured per instance.
    const z = element.number
    const n = neutrons(element)
    const nucleons = nucleonPositions(z + n, z)
    const nucleus = new THREE.InstancedMesh(
      keep(new THREE.SphereGeometry(0.075, 16, 12)),
      keep(new THREE.MeshStandardMaterial({ roughness: 0.45 })),
      nucleons.length,
    )
    const proton = token('--proton')
    const neutron = token('--neutron')
    const order = rng(z * 7 + 3)
    // Shuffle which slots are protons so the colours mix evenly.
    const isProton = nucleons.map((_, i) => i < z).sort(() => order() - 0.5)
    const m = new THREE.Matrix4()
    nucleons.forEach((p, i) => {
      nucleus.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z))
      nucleus.setColorAt(i, isProton[i] ? proton : neutron)
    })
    scene.add(nucleus)

    // Shells: a thin ring per shell, each tilted a little so they read as 3D.
    const atom = new THREE.Group()
    scene.add(atom)
    const ringMaterial = keep(new THREE.LineBasicMaterial({ color: token('--orbit'), transparent: true, opacity: 0.55 }))
    // Every electron shares one geometry and one material.
    const electron = token('--electron')
    const electronGeometry = keep(new THREE.SphereGeometry(0.06, 12, 8))
    const electronMaterial = keep(new THREE.MeshStandardMaterial({ color: electron, emissive: electron, emissiveIntensity: 0.35 }))
    const shells = element.shells.map((count, i) => {
      const group = new THREE.Group()
      group.rotation.set(0.35 + i * 0.42, i * 0.9, 0)
      const radius = shellRadius(i)
      const ring = keep(new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 128 }, (_, k) => {
          const a = (k / 128) * Math.PI * 2
          return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0)
        }),
      ))
      group.add(new THREE.LineLoop(ring, ringMaterial))
      const electrons = new THREE.InstancedMesh(electronGeometry, electronMaterial, count)
      group.add(electrons)
      atom.add(group)
      // Inner electrons move faster, as in the Bohr picture.
      return { electrons, count, radius, speed: 0.9 / (i + 1) }
    })

    const place = (time: number) => {
      for (const s of shells) {
        for (let k = 0; k < s.count; k++) {
          const a = (k / s.count) * Math.PI * 2 + time * s.speed
          s.electrons.setMatrixAt(k, m.makeTranslation(Math.cos(a) * s.radius, Math.sin(a) * s.radius, 0))
        }
        s.electrons.instanceMatrix.needsUpdate = true
      }
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = !still
    controls.enablePan = false
    controls.minDistance = outer * 1.4
    controls.maxDistance = outer * 6
    controls.autoRotate = !still
    controls.autoRotateSpeed = 0.6

    const resize = () => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(el)
    resize()

    const start = performance.now()
    let frame = 0
    const draw = () => {
      controls.update()
      renderer.render(scene, camera)
    }
    if (still) {
      // Reduced motion: no orbits and no spin, but dragging still turns the atom.
      place(0)
      draw()
      controls.addEventListener('change', draw)
    } else {
      const loop = () => {
        frame = requestAnimationFrame(loop)
        if (document.hidden) return
        place((performance.now() - start) / 1000)
        draw()
      }
      loop()
    }

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      disposables.forEach((d) => d.dispose())
      nucleus.dispose()
      shells.forEach((s) => s.electrons.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [element])

  return (
    <figure className="bohr">
      <div ref={host} className="bohr__canvas" role="img" aria-label={describeShells(element)} />
      <figcaption>
        <span>
          <i className="dot dot--proton" /> {element.number} protons
        </span>
        <span>
          <i className="dot dot--neutron" /> about {neutrons(element)} neutrons
        </span>
        <span>
          <i className="dot dot--electron" /> {element.shells.join(' · ')} electrons by shell
        </span>
      </figcaption>
    </figure>
  )
}
