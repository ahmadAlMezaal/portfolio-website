"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
  Stars,
} from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

// ============================================================================
// FLOATING GEOMETRIC SHAPES
// ============================================================================

function FloatingIcosahedron({
  position,
  color,
  speed = 1,
  distort = 0.3,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
  distort?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={distort}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({
  position,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.8, 0.3, 16, 32]} />
        <MeshWobbleMaterial
          color={color}
          factor={0.3}
          speed={speed}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </Float>
  );
}

function FloatingOctahedron({
  position,
  color,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4 * speed;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.7, 0]} />
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.2}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

// ============================================================================
// CENTRAL MORPHING BLOB
// ============================================================================

function MorphingBlob({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]} scale={2.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={0.4}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

// ============================================================================
// PARTICLE FIELD
// ============================================================================

function ParticleField({ count = 200, color }: { count?: number; color: string }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(points, 3));
    return geo;
  }, [points]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================================================
// SCENE COMPOSITION
// ============================================================================

function Scene() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme-based colors
  const colors = useMemo(
    () => ({
      primary: isDark ? "#7dd3fc" : "#8b5cf6", // Sky blue / Purple
      secondary: isDark ? "#38bdf8" : "#ec4899", // Cyan / Pink
      tertiary: isDark ? "#818cf8" : "#3b82f6", // Indigo / Blue
      blob: isDark ? "#0ea5e9" : "#a855f7", // Sky / Purple
      particles: isDark ? "#7dd3fc" : "#c084fc", // Light sky / Light purple
    }),
    [isDark]
  );

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -5]} intensity={0.4} color={colors.secondary} />

      {/* Central morphing blob */}
      <MorphingBlob color={colors.blob} />

      {/* Floating geometric shapes */}
      <FloatingIcosahedron
        position={[-4, 2, -3]}
        color={colors.primary}
        speed={0.8}
        distort={0.4}
      />
      <FloatingIcosahedron
        position={[4, -1.5, -4]}
        color={colors.secondary}
        speed={1.2}
        distort={0.3}
      />
      <FloatingTorus
        position={[-3, -2, -2]}
        color={colors.tertiary}
        speed={0.6}
      />
      <FloatingTorus
        position={[3.5, 2.5, -5]}
        color={colors.primary}
        speed={0.9}
      />
      <FloatingOctahedron
        position={[5, 0, -3]}
        color={colors.secondary}
        speed={0.7}
      />
      <FloatingOctahedron
        position={[-5, 1, -4]}
        color={colors.tertiary}
        speed={1.1}
      />

      {/* Particle field */}
      <ParticleField count={150} color={colors.particles} />

      {/* Stars in dark mode */}
      {isDark && (
        <Stars
          radius={50}
          depth={50}
          count={1000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      )}
    </>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HeroBackground3D() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
