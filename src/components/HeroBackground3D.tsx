"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8 - 2;
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
        size={0.08}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================================================
// GLOWING ORB
// ============================================================================

function GlowingOrb({
  position,
  color,
  size = 1,
  pulseSpeed = 1,
}: {
  position: [number, number, number];
  color: string;
  size?: number;
  pulseSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useMousePosition();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Gentle pulsing
    const pulse = 1 + Math.sin(time * pulseSpeed) * 0.1;
    meshRef.current.scale.setScalar(size * pulse);

    // Subtle mouse following
    const targetX = position[0] + mouse.x * 0.3;
    const targetY = position[1] + mouse.y * 0.3;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ============================================================================
// FLOWING LINES
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
    const yOffset = (index - count / 2) * 2;
    const points: THREE.Vector3[] = [];
    for (let j = 0; j <= 50; j++) {
      const t = j / 50;
      const x = (t - 0.5) * 20;
      const y = yOffset + Math.sin(t * Math.PI * 2 + index) * 0.5;
      const z = -5 + index * 0.5;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [index, count]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const time = state.clock.elapsedTime;
    const positionAttr = lineRef.current.geometry.attributes.position;
    const yOffset = (index - count / 2) * 2;

    for (let j = 0; j <= 50; j++) {
      const t = j / 50;
      const baseY = yOffset + Math.sin(t * Math.PI * 2 + index) * 0.5;
      const animatedY = baseY + Math.sin(time * 0.5 + t * Math.PI * 3 + index) * 0.1;
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
          opacity: 0.2 - index * 0.03,
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
// GRADIENT BACKGROUND PLANE
// ============================================================================

function GradientPlane({ colorTop, colorBottom }: { colorTop: string; colorBottom: string }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uColorTop: { value: new THREE.Color(colorTop) },
      uColorBottom: { value: new THREE.Color(colorBottom) },
      uTime: { value: 0 },
    }),
    [colorTop, colorBottom]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -10]}>
      <planeGeometry args={[30, 20]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorTop;
          uniform vec3 uColorBottom;
          uniform float uTime;
          varying vec2 vUv;

          void main() {
            float noise = sin(vUv.x * 10.0 + uTime * 0.2) * 0.02;
            float gradient = vUv.y + noise;
            vec3 color = mix(uColorBottom, uColorTop, gradient);
            gl_FragColor = vec4(color, 0.3);
          }
        `}
      />
    </mesh>
  );
}

// ============================================================================
// SCENE COMPOSITION
// ============================================================================

function Scene() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme-based colors - improved for light mode
  const colors = useMemo(
    () => ({
      // Light mode: soft, muted purples and blues
      // Dark mode: vibrant cyans and sky blues
      particles: isDark ? "#60a5fa" : "#8b5cf6",
      orb1: isDark ? "#3b82f6" : "#a78bfa",
      orb2: isDark ? "#06b6d4" : "#c4b5fd",
      orb3: isDark ? "#8b5cf6" : "#ddd6fe",
      lines: isDark ? "#60a5fa" : "#a78bfa",
      gradientTop: isDark ? "#1e3a5f" : "#f5f3ff",
      gradientBottom: isDark ? "#0f172a" : "#ede9fe",
    }),
    [isDark]
  );

  return (
    <>
      {/* Subtle gradient background */}
      <GradientPlane colorTop={colors.gradientTop} colorBottom={colors.gradientBottom} />

      {/* Interactive particle field */}
      <InteractiveParticles count={80} color={colors.particles} mouseInfluence={0.4} />

      {/* Glowing orbs - positioned around the scene */}
      <GlowingOrb position={[-4, 2, -3]} color={colors.orb1} size={2.5} pulseSpeed={0.8} />
      <GlowingOrb position={[4, -1, -4]} color={colors.orb2} size={2} pulseSpeed={1.2} />
      <GlowingOrb position={[0, 0, -2]} color={colors.orb3} size={3} pulseSpeed={0.5} />
      <GlowingOrb position={[-3, -2, -5]} color={colors.orb1} size={1.5} pulseSpeed={1} />
      <GlowingOrb position={[5, 2, -6]} color={colors.orb2} size={1.8} pulseSpeed={0.7} />

      {/* Flowing lines */}
      <FlowingLines color={colors.lines} count={4} />
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
        dpr={[1, 1.5]}
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
