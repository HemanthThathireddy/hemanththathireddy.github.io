// portfolio/src/components/sections/HeroScene.tsx
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdditiveBlending } from 'three';
import type { Points } from 'three';

/* ─────────────────────────────────────────────
   This file is loaded via React.lazy() from Hero.tsx
   so its (~150kb gzipped) Three.js dependency stays
   out of the initial bundle. Default export only —
   that's what lazy() expects.
   ───────────────────────────────────────────── */

interface ParticleFieldProps {
  count?: number;
  color?: string;
  size?: number;
  /** Inner radius of the spherical shell. */
  radius?: number;
  /** Random additional radius applied per particle as a fraction of `radius`. */
  spread?: number;
  opacity?: number;
  /** Y-axis rotation speed in radians/second. */
  rotateY?: number;
  /** X-axis rotation speed in radians/second. */
  rotateX?: number;
}

function ParticleField({
  count = 1100,
  color = '#ffffff',
  size = 0.022,
  radius = 3.6,
  spread = 0.6,
  opacity = 0.7,
  rotateY = 0.04,
  rotateX = 0.012,
}: ParticleFieldProps) {
  const ref = useRef<Points>(null);

  // Build a spherical-shell distribution once, in a typed array R3F can hand
  // straight to a BufferAttribute without copying.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      // Inverse-CDF for uniform distribution on a sphere
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + Math.random() * radius * spread;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius, spread]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * rotateY;
    ref.current.rotation.x += delta * rotateX;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

interface CameraRigProps {
  /** Maximum lateral camera offset in world units. */
  strength: number;
}

/**
 * Lerps the camera toward the normalized pointer position. R3F exposes
 * `state.pointer` as (-1..1, -1..1) so this naturally degrades to a
 * static camera when the pointer hasn't moved (mobile/touch).
 */
function CameraRig({ strength }: CameraRigProps) {
  useFrame((state) => {
    const { pointer, camera } = state;
    const targetX = pointer.x * strength;
    const targetY = pointer.y * strength;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface HeroSceneProps {
  /**
   * 0 disables parallax. Larger values push the camera further when the
   * pointer reaches the edges — keep below ~0.6 or the parallax becomes
   * disorienting against the slowly rotating field.
   */
  parallaxStrength?: number;
  /** Total particle count budget — lower on mid-tier devices. */
  density?: number;
}

export default function HeroScene({
  parallaxStrength = 0.4,
  density = 1200,
}: HeroSceneProps) {
  // Split the budget across three layers — main field gets the lion's share,
  // accents are sparse so they read as highlights, not noise.
  const mainCount = Math.round(density * 0.9);
  const violetCount = Math.round(density * 0.06);
  const tealCount = Math.round(density * 0.04);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 50 }}
      dpr={[1, 1.6]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'transparent' }}
      // The hero scene has zero interactive 3D elements — disable raycasting
      // entirely so we don't waste a frame on it.
      raycaster={{ enabled: false } as never}
    >
      <CameraRig strength={parallaxStrength} />
      {/* Core: dense, neutral, slow */}
      <ParticleField
        count={mainCount}
        color="#ffffff"
        size={0.02}
        radius={3.6}
        spread={0.6}
        opacity={0.7}
      />
      {/* Accent: sparse violet, bigger, rotates slightly differently */}
      <ParticleField
        count={violetCount}
        color="#6c63ff"
        size={0.06}
        radius={4.0}
        spread={0.8}
        opacity={0.85}
        rotateY={0.06}
        rotateX={-0.01}
      />
      {/* Distant teal: smallest count, deeper shell, near-black blending */}
      <ParticleField
        count={tealCount}
        color="#0fffc1"
        size={0.045}
        radius={5.2}
        spread={0.5}
        opacity={0.55}
        rotateY={-0.025}
        rotateX={0.018}
      />
    </Canvas>
  );
}
