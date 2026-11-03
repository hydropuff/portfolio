import React, { useMemo, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export const MODEL_URL = '/assets/3d/studio-kitchen.web.glb'
// Original file kept untouched at: /assets/3d/studio%20sketchupppp.glb
// (the .web copy only converts the legacy SpecularGlossiness materials so textures show in three.js)

// Camera stops: azimuth°, elevation°, distance (x radius), target height offset
const BASE = 145
const STOPS = [
  { az: BASE + 45, el: 28, d: 1.7, ty: 0.0 },   // overview
  { az: BASE, el: 16, d: 1.05, ty: 0.05 },      // materials
  { az: BASE - 38, el: 10, d: 0.8, ty: 0.1 },   // storage
  { az: BASE + 62, el: 16, d: 0.9, ty: 0.0 },   // breakfast counter
  { az: BASE, el: 78, d: 1.45, ty: -0.1 },      // plan
]
const sm = (t) => t * t * (3 - 2 * t)

function Model({ progress, free, onReady }) {
  const { scene } = useGLTF(MODEL_URL)
  const group = useRef()
  const { camera } = useThree()
  const info = useMemo(() => {
    const box = new THREE.Box3()
    scene.updateMatrixWorld(true)
    scene.traverse((o) => {
      if (!o.isMesh) return
      const b = new THREE.Box3().setFromObject(o)
      const s = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3())
      const mats = Array.isArray(o.material) ? o.material : [o.material]
      // the SketchUp file contains a flat human cut-out floating outside the room: hide it
      const stray = mats.some((m) => m.name?.startsWith('Sree')) || (c.x < -2 && Math.max(s.x, s.y, s.z) < 3)
      if (stray) { o.visible = false; return }
      mats.forEach((m) => { m.side = THREE.FrontSide; m.needsUpdate = true })
      o.matrixAutoUpdate = false; o.updateMatrix()
      box.union(b)
    })
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    return { center, size, R: Math.max(size.x, size.z) * 0.62 }
  }, [scene])

  useEffect(() => { onReady?.() }, [onReady])
  const tgt = useRef(new THREE.Vector3()), pos = useRef(new THREE.Vector3(0, 8, 14))

  useFrame(() => {
    const g = group.current
    const p = progress.current
    const entr = sm(Math.min(1, p / 0.07))
    g.scale.setScalar(0.88 + 0.12 * entr)
    g.rotation.y = (1 - entr) * 0.5
    if (free) return
    const s = Math.min(STOPS.length - 1 - 1e-6, p * (STOPS.length - 1))
    const i = Math.floor(s), t = sm(s - i), A = STOPS[i], B = STOPS[i + 1]
    const L = (k) => A[k] + (B[k] - A[k]) * t
    const az = THREE.MathUtils.degToRad(L('az')), el = THREE.MathUtils.degToRad(L('el')), d = L('d') * info.R
    const c = info.center
    const want = new THREE.Vector3(c.x + Math.sin(az) * Math.cos(el) * d, c.y + Math.sin(el) * d, c.z + Math.cos(az) * Math.cos(el) * d)
    pos.current.lerp(want, 0.07)
    tgt.current.set(c.x, c.y + L('ty') * info.size.y, c.z)
    camera.position.copy(pos.current)
    camera.lookAt(tgt.current)
  })

  return (
    <>
      <group ref={group}><primitive object={scene} /></group>
      {free && <OrbitControls target={info.center} enableDamping maxPolarAngle={Math.PI * 0.49} minDistance={2} maxDistance={info.R * 3} />}
      <directionalLight position={[info.center.x + 6, 11, info.center.z + 5]} intensity={2.1} color="#fff1dc" />
    </>
  )
}

export default function Kitchen3D({ progress, free, onReady, active = true }) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 1.25]} camera={{ fov: 38, near: 0.1, far: 200, position: [8, 8, 14] }}
      gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
      <color attach="background" args={['#E8DED0']} />
      <fog attach="fog" args={['#E8DED0', 30, 70]} />
      <hemisphereLight args={['#fff6e8', '#b5a495', 0.7]} />
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2.5} color="#fff3e0" position={[0, 6, 4]} scale={[14, 8, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#e8ddd0" position={[-8, 3, -2]} rotation-y={Math.PI / 2} scale={[10, 5, 1]} />
        <Lightformer form="ring" intensity={1} color="#ffd9a8" position={[6, 4, -6]} scale={6} />
      </Environment>
      <React.Suspense fallback={null}><Model progress={progress} free={free} onReady={onReady} /></React.Suspense>
    </Canvas>
  )
}
