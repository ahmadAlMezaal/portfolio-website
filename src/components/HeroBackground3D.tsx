"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

// ============================================================================
// MOUSE TRACKING
// ============================================================================

function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
}

// ============================================================================
// INTERACTIVE PARTICLE FIELD
// ============================================================================

function InteractiveParticles({
  count = 100,
  color,
  mouseInfluence = 0.3,
}: {
  count?: number;
  color: string;
  mouseInfluence?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition();

  const { positions, originalPositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const origPos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Spread wider horizontally (full viewport width)
      const x = (Math.random() - 0.5) * 25;
      const y = (Math.random() - 0.5) * 14;
      const z = (Math.random() - 0.5) * 6 - 3;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      origPos[i * 3] = x;
      origPos[i * 3 + 1] = y;
      origPos[i * 3 + 2] = z;
    }
    return { positions: pos, originalPositions: origPos };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const origX = originalPositions[i3];
      const origY = originalPositions[i3 + 1];
      const origZ = originalPositions[i3 + 2];

      // Gentle floating motion
      const floatX = Math.sin(time * 0.3 + i * 0.1) * 0.2;
      const floatY = Math.cos(time * 0.2 + i * 0.15) * 0.3;

      // Mouse influence
      const dx = mouse.x * 3 - origX;
      const dy = mouse.y * 3 - origY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / 5) * mouseInfluence;

      positionAttr.setXYZ(
        i,
        origX + floatX + dx * influence * 0.3,
        origY + floatY + dy * influence * 0.3,
        origZ
      );
    }
    positionAttr.needsUpdate = true;

    // Slow rotation
    pointsRef.current.rotation.z = time * 0.02;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================================================
// GLOWING ORB - Positioned at edges, away from center text
// ============================================================================

function GlowingOrb({
  position,
  color,
  size = 1,
  pulseSpeed = 1,
  opacity = 0.1,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  pulseSpeed?: number;
  opacity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Gentle pulsing
    const pulse = 1 + Math.sin(time * pulseSpeed) * 0.08;
    meshRef.current.scale.setScalar(size * pulse);

    // Very subtle mouse following (reduced)
    const targetX = position[0] + mouse.x * 0.15;
    const targetY = position[1] + mouse.y * 0.15;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.01;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.01;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ============================================================================
// FLOWING LINES - Spread across full width
// ============================================================================

function FlowingLine({
  index,
  count,
  color,
}: {
  index: number;
  count: number;
  color: string;
}) {
  const lineRef = useRef<THREE.Line>(null);

  const initialGeometry = useMemo(() => {
    const yOffset = (index - count / 2) * 2.5;
    const points: THREE.Vector3[] = [];
    for (let j = 0; j <= 60; j++) {
      const t = j / 60;
      // Wider spread (30 units)
      const x = (t - 0.5) * 30;
      const y = yOffset + Math.sin(t * Math.PI * 2 + index) * 0.4;
      const z = -6 + index * 0.3;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [index, count]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const time = state.clock.elapsedTime;
    const positionAttr = lineRef.current.geometry.attributes.position;
    const yOffset = (index - count / 2) * 2.5;

    for (let j = 0; j <= 60; j++) {
      const t = j / 60;
      const baseY = yOffset + Math.sin(t * Math.PI * 2 + index) * 0.4;
      const animatedY = baseY + Math.sin(time * 0.4 + t * Math.PI * 3 + index) * 0.08;
      positionAttr.setY(j, animatedY);
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <primitive
      ref={lineRef}
      object={new THREE.Line(
        initialGeometry,
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity: 0.15 - index * 0.02,
          blending: THREE.AdditiveBlending,
        })
      )}
    />
  );
}

function FlowingLines({ color, count = 5 }: { color: string; count?: number }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <FlowingLine key={i} index={i} count={count} color={color} />
      ))}
    </group>
  );
}

// ============================================================================
// SCENE COMPOSITION
// ============================================================================

function Scene() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme-based colors - adjusted for better contrast
  const colors = useMemo(
    () => ({
      // Light mode: soft purples
      // Dark mode: muted blues (less bright for better text readability)
      particles: isDark ? "#4f8bbd" : "#8b5cf6",
      orb1: isDark ? "#2d5a87" : "#a78bfa",
      orb2: isDark ? "#1e6a7a" : "#c4b5fd",
      orb3: isDark ? "#3d4f8a" : "#ddd6fe",
      lines: isDark ? "#3d6a9f" : "#a78bfa",
    }),
    [isDark]
  );

  // Lower opacity for dark mode to improve text readability
  const orbOpacity = isDark ? 0.06 : 0.12;

  return (
    <>
      {/* Interactive particle field - spread wider */}
      <InteractiveParticles count={100} color={colors.particles} mouseInfluence={0.3} />

      {/* Glowing orbs - positioned at EDGES, away from center text area */}
      {/* Left side orbs */}
      <GlowingOrb position={[-9, 3, -5]} color={colors.orb1} size={3} pulseSpeed={0.6} opacity={orbOpacity} />
      <GlowingOrb position={[-7, -2, -6]} color={colors.orb2} size={2.5} pulseSpeed={0.8} opacity={orbOpacity} />

      {/* Right side orbs */}
      <GlowingOrb position={[9, 2, -5]} color={colors.orb2} size={2.8} pulseSpeed={0.7} opacity={orbOpacity} />
      <GlowingOrb position={[7, -3, -6]} color={colors.orb3} size={2.2} pulseSpeed={0.9} opacity={orbOpacity} />

      {/* Top/bottom orbs (away from center) */}
      <GlowingOrb position={[-3, 5, -7]} color={colors.orb3} size={2} pulseSpeed={1} opacity={orbOpacity * 0.8} />
      <GlowingOrb position={[4, -5, -7]} color={colors.orb1} size={1.8} pulseSpeed={1.1} opacity={orbOpacity * 0.8} />

      {/* Flowing lines - wider spread */}
      <FlowingLines color={colors.lines} count={5} />
    </>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function HeroBackground3D() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 70 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{
          background: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
