"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTheme } from "next-themes";
import * as THREE from "three";

// ============================================================================
// FLOATING PARTICLES - Subtle background particles
// ============================================================================

function FloatingParticles({
  count = 30,
  color,
  speed = 0.5,
}: {
  count?: number;
  color: string;
  speed?: number;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 3;
    }
    return pos;
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime * speed;
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ============================================================================
// NODE NETWORK - Connected nodes for Skills section
// ============================================================================

function NodeNetwork({
  nodeCount = 15,
  color,
  lineColor,
}: {
  nodeCount?: number;
  color: string;
  lineColor: string;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const { nodes, connectionLines } = useMemo(() => {
    const nodePositions: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodePositions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4 - 2
        )
      );
    }

    // Create connections between nearby nodes as Line objects
    const lines: THREE.Line[] = [];
    const material = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 4) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i],
            nodePositions[j],
          ]);
          lines.push(new THREE.Line(geometry, material));
        }
      }
    }

    return { nodes: nodePositions, connectionLines: lines };
  }, [nodeCount, lineColor]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
    groupRef.current.rotation.x = Math.cos(time * 0.08) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Connections */}
      {connectionLines.map((line, i) => (
        <primitive key={`line-${i}`} object={line} />
      ))}
    </group>
  );
}

// ============================================================================
// WAVE EFFECT - For Contact section
// ============================================================================

function WaveEffect({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(25, 15, 50, 30);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const positionAttr = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < positionAttr.count; i++) {
      const x = positionAttr.getX(i);
      const y = positionAttr.getY(i);
      const wave1 = Math.sin(x * 0.3 + time * 0.5) * 0.3;
      const wave2 = Math.sin(y * 0.4 + time * 0.3) * 0.2;
      positionAttr.setZ(i, wave1 + wave2);
    }
    positionAttr.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, -5]} rotation={[-0.3, 0, 0]}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.08}
        wireframe
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// ============================================================================
// SCENE VARIANTS
// ============================================================================

type SceneType = "particles" | "nodes" | "wave";

function Scene({ type }: { type: SceneType }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const colors = useMemo(
    () => ({
      primary: isDark ? "#60a5fa" : "#8b5cf6",
      secondary: isDark ? "#3b82f6" : "#a78bfa",
      tertiary: isDark ? "#06b6d4" : "#c4b5fd",
    }),
    [isDark]
  );

  return (
    <>
      {type === "particles" && (
        <FloatingParticles count={40} color={colors.primary} speed={0.3} />
      )}
      {type === "nodes" && (
        <NodeNetwork nodeCount={20} color={colors.primary} lineColor={colors.secondary} />
      )}
      {type === "wave" && <WaveEffect color={colors.primary} />}
    </>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

interface Section3DBackgroundProps {
  type: SceneType;
  className?: string;
}

export default function Section3DBackground({ type, className = "" }: Section3DBackgroundProps) {
  return (
    <div className={`absolute inset-0 -z-10 opacity-50 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
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
        <Scene type={type} />
      </Canvas>
    </div>
  );
}
