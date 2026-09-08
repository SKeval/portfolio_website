"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, type SectionName } from "@/context/ScrollContext";
import type { Theme } from "@/context/ThemeContext";

const THEME_COLORS: Record<
  Theme,
  {
    node: string;
    core: string;
    line: string;
    particle: string;
    lineOpacityScale: number;
    particleOpacity: number;
  }
> = {
  dark: {
    node: "#d4752a",
    core: "#e8823a",
    line: "#d4752a",
    particle: "#d4752a",
    lineOpacityScale: 1,
    particleOpacity: 0.08,
  },
  light: {
    node: "#b85a1a",
    core: "#c96820",
    line: "#b85a1a",
    particle: "#b85a1a",
    lineOpacityScale: 1.5,
    particleOpacity: 0.12,
  },
};

const NODE_LABELS = ["Input", "Retrieve", "Reason", "Evaluate", "Output"];
const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
];
const EXTRA_NODE_COUNT = 20;
const MAX_PARTICLES = 60;
const CAMERA_LERP = 0.02;
const NODE_LERP = 0.035;

type Vec3 = [number, number, number];

type SceneState = {
  range: [number, number];
  nodes: Vec3[];
  camera: Vec3;
  particleCount: number;
  lineOpacity: number;
};

const HERO_NODES: Vec3[] = [
  [2.5, 1.5, 0],
  [4.0, -0.5, 0],
  [3.5, 2.5, 0],
  [5.5, 0.5, 0],
  [5.0, -1.5, 0],
];

const ABOUT_NODES: Vec3[] = Array.from({ length: 5 }, (_, i) => {
  const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
  return [
    Math.cos(angle) * 2.2,
    Math.sin(angle) * 1.6,
    Math.sin(angle * 2) * 0.4,
  ] as Vec3;
});

const EXPERIENCE_NODES: Vec3[] = [
  [0, -3, 0],
  [-0.3, -1.5, 0.3],
  [0.3, 0, -0.3],
  [-0.3, 1.5, 0.3],
  [0.2, 3, -0.2],
];

const PROJECTS_BASE: Vec3[] = [
  [-3.3, 0.5, 0],
  [-1.7, -0.5, 0],
  [1.6, 0.6, 0],
  [3.4, -0.4, 0],
  [2.5, 1.4, 0],
];

const SKILLS_NODES: Vec3[] = [
  [-6, 3, 0],
  [6, 3, -1],
  [-6, -3, 1],
  [6, -3, 0],
  [0, 0.5, -3],
];

const CONTACT_NODES: Vec3[] = [
  [0.05, -0.25, 0],
  [-0.05, -0.3, 0.05],
  [0, -0.35, -0.05],
  [0.05, -0.3, 0],
  [0, -0.3, 0],
];

const STATES: Record<SectionName, SceneState> = {
  hero: {
    range: [0, 0.15],
    nodes: HERO_NODES,
    camera: [0, 0, 8],
    particleCount: 0,
    lineOpacity: 0.18,
  },
  about: {
    range: [0.15, 0.3],
    nodes: ABOUT_NODES,
    camera: [-0.5, 0, 7],
    particleCount: 20,
    lineOpacity: 0.2,
  },
  experience: {
    range: [0.3, 0.55],
    nodes: EXPERIENCE_NODES,
    camera: [1, 0, 8],
    particleCount: 40,
    lineOpacity: 0.3,
  },
  projects: {
    range: [0.55, 0.7],
    nodes: PROJECTS_BASE,
    camera: [0, 0, 8],
    particleCount: 30,
    lineOpacity: 0.2,
  },
  skills: {
    range: [0.7, 0.85],
    nodes: SKILLS_NODES,
    camera: [0, 0, 10],
    particleCount: 60,
    lineOpacity: 0.12,
  },
  contact: {
    range: [0.85, 1],
    nodes: CONTACT_NODES,
    camera: [0, -0.3, 7],
    particleCount: 15,
    lineOpacity: 0.08,
  },
};

const SECTION_ORDER: SectionName[] = [
  "hero",
  "about",
  "experience",
  "projects",
  "skills",
  "contact",
];

function stateForProgress(progress: number): SectionName {
  for (const name of SECTION_ORDER) {
    const [start, end] = STATES[name].range;
    if (progress < end || name === "contact") {
      if (progress >= start || name === "hero") {
        return name;
      }
    }
  }
  return "contact";
}

function useMouseParallax() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return mouseRef;
}

function AmbientParticles({
  progressRef,
  theme,
}: {
  progressRef: MutableRefObject<number>;
  theme: Theme;
}) {
  const colors = THEME_COLORS[theme];
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const currentCountRef = useRef(0);
  const timeRef = useRef(0);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(MAX_PARTICLES * 3);
    const vel = new Float32Array(MAX_PARTICLES * 3);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      vel[i * 3] = (Math.random() - 0.5) * 0.15;
      vel[i * 3 + 1] = Math.random() * 0.2 + 0.05;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const section = stateForProgress(progressRef.current);
    const state = STATES[section];

    currentCountRef.current = THREE.MathUtils.lerp(
      currentCountRef.current,
      state.particleCount,
      0.04
    );
    const drawCount = Math.round(currentCountRef.current);

    let speedMultiplier = 1;
    if (section === "hero") speedMultiplier = 0;
    if (section === "about") speedMultiplier = 0.6;
    if (section === "experience") speedMultiplier = 1;
    if (section === "projects") speedMultiplier = 0.8;
    if (section === "skills") speedMultiplier = 0.5;
    if (section === "contact") speedMultiplier = 0.15;

    const boundsX = 8;
    const boundsY = 5;
    const boundsZ = 3;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      positions[ix] += velocities[ix] * speedMultiplier * delta * 6;
      positions[iy] += velocities[iy] * speedMultiplier * delta * 6;
      positions[iz] += velocities[iz] * speedMultiplier * delta * 6;

      if (section === "projects") {
        const angle = delta * 0.3;
        const x = positions[ix];
        const z = positions[iz];
        positions[ix] = x * Math.cos(angle) - z * Math.sin(angle);
        positions[iz] = x * Math.sin(angle) + z * Math.cos(angle);
      }

      if (positions[iy] > boundsY) positions[iy] = -boundsY;
      if (positions[iy] < -boundsY) positions[iy] = boundsY;
      if (positions[ix] > boundsX) positions[ix] = -boundsX;
      if (positions[ix] < -boundsX) positions[ix] = boundsX;
      if (positions[iz] > boundsZ) positions[iz] = -boundsZ;
      if (positions[iz] < -boundsZ) positions[iz] = boundsZ;
    }

    if (geometryRef.current) {
      const attr = geometryRef.current.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      attr.needsUpdate = true;
      geometryRef.current.setDrawRange(0, drawCount);
    }

    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(
        materialRef.current.opacity,
        colors.particleOpacity,
        0.05
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={colors.particle}
        size={0.03}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function PipelineScene({
  progressRef,
  theme,
}: {
  progressRef: MutableRefObject<number>;
  theme: Theme;
}) {
  const colors = THEME_COLORS[theme];
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const coreRefs = useRef<(THREE.Mesh | null)[]>([]);
  const anchorRefs = useRef<(THREE.Object3D | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const extraNodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const lineGeometryRef = useRef<THREE.BufferGeometry>(null);
  const lineMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  const currentPositions = useRef<THREE.Vector3[]>(
    HERO_NODES.map((p) => new THREE.Vector3(...p))
  );
  const currentCamera = useRef(new THREE.Vector3(0, 0, 8));
  const phasesRef = useRef<number[]>(
    Array.from({ length: 5 }, () => Math.random() * Math.PI * 2)
  );
  const lineOpacityRef = useRef(0.18);

  const linePositions = useMemo(
    () => new Float32Array(EDGES.length * 2 * 3),
    []
  );

  const extraNodePositions = useMemo(
    () =>
      Array.from({ length: EXTRA_NODE_COUNT }, () => [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 5,
      ]) as Vec3[],
    []
  );
  const extraOpacityRef = useRef(0);
  const extraMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: colors.node,
        wireframe: true,
        transparent: true,
        opacity: 0,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    extraMaterial.color.set(colors.node);
  }, [extraMaterial, colors.node]);

  const { camera } = useThree();
  const mouseRef = useMouseParallax();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const progress = progressRef.current;
    const section = stateForProgress(progress);
    const sceneState = STATES[section];

    for (let i = 0; i < 5; i++) {
      const base = sceneState.nodes[i];
      const floatOffset = new THREE.Vector3(
        Math.sin(t * 0.3 + phasesRef.current[i]) * 0.1,
        Math.cos(t * 0.35 + phasesRef.current[i]) * 0.1,
        0
      );

      let target = new THREE.Vector3(base[0], base[1], base[2]).add(
        floatOffset
      );

      if (section === "projects") {
        const clusterCenter =
          i < 2 ? new THREE.Vector3(-2.5, 0, 0) : new THREE.Vector3(2.5, 0, 0);
        const orbitAngle = t * 0.25 + phasesRef.current[i];
        const orbitRadius = 1.1;
        const orbitOffset = new THREE.Vector3(
          Math.cos(orbitAngle) * orbitRadius * 0.4,
          Math.sin(orbitAngle) * orbitRadius * 0.4,
          0
        );
        target = clusterCenter
          .clone()
          .add(orbitOffset)
          .add(floatOffset.multiplyScalar(0.3));
      }

      currentPositions.current[i].lerp(target, NODE_LERP);

      const mesh = nodeRefs.current[i];
      if (mesh) {
        mesh.position.copy(currentPositions.current[i]);
        mesh.rotation.x = t * 0.1 + phasesRef.current[i];
        mesh.rotation.y = t * 0.08 + phasesRef.current[i];

        const isContactGlowNode = section === "contact" && i === 4;
        const targetOpacity = isContactGlowNode ? 1 : 0.6;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);

        const pulse = isContactGlowNode
          ? 1 + Math.sin(t * 2) * 0.25
          : 1;
        mesh.scale.setScalar(pulse);
      }

      const core = coreRefs.current[i];
      if (core) {
        core.position.copy(currentPositions.current[i]);
        const isContactGlowNode = section === "contact" && i === 4;
        const pulse = isContactGlowNode
          ? 1 + Math.sin(t * 2) * 0.6
          : 1;
        core.scale.setScalar(pulse);
      }

      const anchor = anchorRefs.current[i];
      if (anchor) {
        anchor.position.copy(currentPositions.current[i]);
        anchor.position.y -= 0.4;
      }

      const label = labelRefs.current[i];
      if (label) {
        const heroAmount = 1 - Math.min(1, progress / 0.18);
        label.style.opacity = String(Math.max(0, heroAmount) * 0.6);
      }
    }

    EDGES.forEach(([a, b], idx) => {
      const pa = currentPositions.current[a];
      const pb = currentPositions.current[b];
      linePositions[idx * 6] = pa.x;
      linePositions[idx * 6 + 1] = pa.y;
      linePositions[idx * 6 + 2] = pa.z;
      linePositions[idx * 6 + 3] = pb.x;
      linePositions[idx * 6 + 4] = pb.y;
      linePositions[idx * 6 + 5] = pb.z;
    });
    if (lineGeometryRef.current) {
      const attr = lineGeometryRef.current.getAttribute(
        "position"
      ) as THREE.BufferAttribute;
      attr.needsUpdate = true;
    }

    let targetLineOpacity = sceneState.lineOpacity;
    if (section === "about") {
      targetLineOpacity = 0.2 + Math.sin(t * 0.5) * 0.1;
    }
    targetLineOpacity *= colors.lineOpacityScale;
    lineOpacityRef.current = THREE.MathUtils.lerp(
      lineOpacityRef.current,
      targetLineOpacity,
      0.05
    );
    if (lineMaterialRef.current) {
      lineMaterialRef.current.opacity = lineOpacityRef.current;
    }

    const targetExtraOpacity = section === "skills" ? 0.5 : 0;
    extraOpacityRef.current = THREE.MathUtils.lerp(
      extraOpacityRef.current,
      targetExtraOpacity,
      0.04
    );
    extraMaterial.opacity = extraOpacityRef.current;
    extraNodeRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const p = extraNodePositions[i];
      mesh.position.set(
        p[0] + Math.sin(t * 0.2 + i) * 0.3,
        p[1] + Math.cos(t * 0.2 + i) * 0.3,
        p[2]
      );
    });

    const parallax = mouseRef.current;
    const targetCam = new THREE.Vector3(
      sceneState.camera[0] + parallax.x * 0.1,
      sceneState.camera[1] + parallax.y * 0.1,
      sceneState.camera[2]
    );
    currentCamera.current.lerp(targetCam, CAMERA_LERP);
    camera.position.copy(currentCamera.current);
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry ref={lineGeometryRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color={colors.line}
          transparent
          opacity={0.18}
        />
      </lineSegments>

      {NODE_LABELS.map((label, i) => (
        <group key={label}>
          <mesh
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
          >
            <icosahedronGeometry args={[0.25 + (i % 3) * 0.05, 0]} />
            <meshBasicMaterial
              color={colors.node}
              wireframe
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh
            ref={(el) => {
              coreRefs.current[i] = el;
            }}
          >
            <icosahedronGeometry args={[0.08, 0]} />
            <meshBasicMaterial
              color={colors.core}
              transparent
              opacity={0.9}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <object3D
            ref={(el) => {
              anchorRefs.current[i] = el;
            }}
          >
            <Html center style={{ pointerEvents: "none" }}>
              <div
                ref={(el) => {
                  labelRefs.current[i] = el;
                }}
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: "10px",
                  color: "var(--accent)",
                  opacity: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </div>
            </Html>
          </object3D>
        </group>
      ))}

      {extraNodePositions.map((p, i) => (
        <mesh
          key={i}
          position={p}
          material={extraMaterial}
          ref={(el) => {
            extraNodeRefs.current[i] = el;
          }}
        >
          <icosahedronGeometry args={[0.08, 0]} />
        </mesh>
      ))}
    </group>
  );
}

export default function GlobalScene({ theme }: { theme: Theme }) {
  const { progressRef } = useScroll();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <PipelineScene progressRef={progressRef} theme={theme} />
        <AmbientParticles progressRef={progressRef} theme={theme} />
      </Canvas>
    </div>
  );
}
