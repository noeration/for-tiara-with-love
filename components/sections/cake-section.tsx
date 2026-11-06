"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import { useContent } from "@/components/content/content-context";
import { Flame, Sparkle, ArrowDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */

interface CakeSceneProps {
  extinguished: boolean[];
  onExtinguish: (i: number) => void;
  allDone: boolean;
}

/* ------------------------------------------------------------------ */
/*  3D: TWO-TIER BIRTHDAY CAKE                                          */
/* ------------------------------------------------------------------ */

function CakeBody() {
  return (
    <group position={[0, 0, 0]}>
      {/* Base plate */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 0.08, 64]} />
        <meshStandardMaterial color="#bfa3e6" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Bottom tier — wider, taller */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.22, 1.28, 0.85, 64]} />
        <meshStandardMaterial color="#c8a2e8" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* Bottom frosting top */}
      <mesh position={[0, 1.08, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.25, 1.30, 0.16, 64]} />
        <meshStandardMaterial color="#e8c6f3" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Bottom piped border */}
      <mesh position={[0, 1.14, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[1.15, 0.06, 12, 64]} />
        <meshStandardMaterial color="#dcb8f5" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Top tier — smaller, on bottom frosting */}
      <mesh position={[0, 1.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.88, 0.55, 64]} />
        <meshStandardMaterial color="#d8b0f5" roughness={0.35} metalness={0.05} />
      </mesh>
      {/* Top frosting layer */}
      <mesh position={[0, 1.62, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.86, 0.92, 0.14, 64]} />
        <meshStandardMaterial color="#f2d0ff" roughness={0.25} metalness={0.05} />
      </mesh>
      {/* Top piped border */}
      <mesh position={[0, 1.66, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.84, 0.05, 12, 48]} />
        <meshStandardMaterial color="#e8c8fa" roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Small decorative cream dots — intentional only */}
      <group position={[0, 1.72, 0]}>
        {[-0.45, 0, 0.45, 0.45, -0.45].map((x, i) => (
          <mesh key={i} position={[x, 0, (i % 2 === 0 ? 0.08 : -0.08)]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fff5f8" emissive="#e0a0f5" emissiveIntensity={0.35} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  3D: CANDLE + FLAME                                                  */
/* ------------------------------------------------------------------ */

function Candle({ index, position, extinguished, onExtinguish }: {
  index: number; position: [number, number, number]; extinguished: boolean; onExtinguish: () => void;
}) {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!flameRef.current || extinguished) return;
    const t = clock.getElapsedTime();
    const flicker = 0.9 + 0.2 * Math.sin(t * 12) + 0.08 * Math.sin(t * 23);
    flameRef.current.scale.set(flicker, flicker * 1.2, flicker);
    flameRef.current.rotation.y = Math.sin(t * 2.5) * 0.05;
    if (lightRef.current) {
      lightRef.current.intensity = 2 + 1.5 * Math.sin(t * 8);
      lightRef.current.distance = 2.5 + 0.5 * Math.sin(t * 5);
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.09, 0.7, 16]} />
        <meshStandardMaterial color="#fce3fc" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.08, 8]} />
        <meshStandardMaterial color="#b58a9a" />
      </mesh>
      {!extinguished && (
        <group position={[0, 0.78, 0]}>
          <mesh ref={flameRef}>
            <coneGeometry args={[0.07, 0.2, 12, 1]} />
            <meshStandardMaterial color="#fff5b5" emissive="#ffcc66" emissiveIntensity={2.5} roughness={0.2} />
          </mesh>
          <pointLight ref={lightRef} position={[0, 0.05, 0]} color="#ffeebb" intensity={2} distance={2.5} castShadow />
        </group>
      )}
      <mesh
        position={[0, 0.5, 0]}
        onClick={(e) => { e.stopPropagation(); if (!extinguished) onExtinguish(); }}
        onPointerOver={() => !extinguished && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.18, 0.18, 1.2, 16]} />
        <meshStandardMaterial visible={false} />
      </mesh>
      {hovered && !extinguished && (
        <mesh position={[0, 0.4, 0]}>
          <torusGeometry args={[0.22, 0.025, 8, 24]} />
          <meshBasicMaterial color="#fff0cc" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  3D: AMBIENT PARTICLES                                               */
/* ------------------------------------------------------------------ */

function AmbientParticles() {
  const points = useMemo(() => {
    const arr = new Float32Array(100 * 3);
    for (let i = 0; i < 100 * 3; i++) arr[i] = (Math.random() - 0.5) * 5;
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute args={[points, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#d0a8f5" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  3D: SMOKE                                                          */
/* ------------------------------------------------------------------ */

function SmokeParticles({ active }: { active: boolean }) {
  const particles = useRef<{ pos: [number, number, number]; life: number; velocity: number; id: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (active) {
      for (let i = 0; i < 8; i++) {
        particles.current.push({
          pos: [(Math.random() - 0.5) * 0.4, 0, (Math.random() - 0.5) * 0.4],
          life: 1,
          velocity: 0.008 + Math.random() * 0.012,
          id: idRef.current++,
        });
      }
    }
  }, [active]);

  useFrame(() => {
    particles.current.forEach((p) => (p.pos[1] += p.velocity));
    particles.current.forEach((p) => (p.life -= 0.015));
    particles.current = particles.current.filter((p) => p.life > 0);
  });
  return (
    <group>
      {particles.current.map((p) => (
        <mesh key={p.id} position={[p.pos[0], p.pos[1], p.pos[2]]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ddd0f0" transparent opacity={p.life * 0.7} emissive="#bfa3e6" />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  SCENE                                                               */
/* ------------------------------------------------------------------ */

function Scene({ extinguished, onExtinguish, allDone }: CakeSceneProps) {
  const smokeActive = extinguished.some((v) => v) && !allDone;

  return (
    <group>
      <ambientLight intensity={0.7} color="#8b5aa6" />
      <directionalLight position={[3, 5, 3]} intensity={2} color="#f0d0ff" castShadow />
      <pointLight position={[0, 2.5, 0]} intensity={1} color="#eac0ff" />

      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
        <group scale={0.65}>
          <CakeBody />
        </group>
      </Float>

      {/* Three candles — centered triangle on top tier frosting, scaled with cake */}
      <group scale={0.65}>
        <Candle index={0} position={[-0.35, 1.72, 0.35]} extinguished={extinguished[0]} onExtinguish={() => onExtinguish(0)} />
        <Candle index={1} position={[0, 1.72, 0.55]} extinguished={extinguished[1]} onExtinguish={() => onExtinguish(1)} />
        <Candle index={2} position={[0.35, 1.72, 0.35]} extinguished={extinguished[2]} onExtinguish={() => onExtinguish(2)} />
      </group>

      <AmbientParticles />
      <SmokeParticles active={smokeActive} />

      {allDone && (
        <Sparkles count={60} scale={2.5} size={1.2} speed={0.8} opacity={0.6} color="#ffeebb" />
      )}

      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.3} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  OVERLAY UI                                                           */
/* ------------------------------------------------------------------ */

function CakeOverlay({ extinguished, allDone }: { extinguished: boolean[]; allDone: boolean }) {
  const birthday = useContent();
  const remaining = 3 - extinguished.filter(Boolean).length;
  const handleContinue = () => {
    const target = document.getElementById("kenangan");
    if (!target) return;
    window.history.replaceState(null, "", "#kenangan");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-between px-4 py-3 sm:py-5">
      <div className="pointer-events-auto mx-auto w-full max-w-lg text-center">
        <AnimatePresence mode="wait">
          {!allDone && (
            <motion.div
              key="instruction"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full border border-white/10 bg-deep/50 px-5 py-2 text-sm text-lavender shadow-xl backdrop-blur-sm"
            >
              <span className="font-serif text-base">Make Three Wishes</span>
              <span className="mx-2 opacity-40">|</span>
              <span className="text-xs text-orchid">{remaining} lilin tersisa</span>
            </motion.div>
          )}
          {allDone && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex flex-col items-center gap-3 rounded-2xl border border-orchid/20 bg-deep/60 px-7 py-5 shadow-2xl backdrop-blur-md"
            >
              <Sparkle className="h-7 w-7 text-amber-200" />
              <h3 className="font-serif text-xl text-lavender sm:text-2xl">{birthday.cake.allDoneMessage}</h3>
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orchid/80 to-violet-400/80 px-6 py-2.5 font-sans text-sm text-white shadow-lg transition hover:brightness-110"
              >
                {birthday.cake.continueLabel} <ArrowDown className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pointer-events-auto mx-auto w-full max-w-2xl px-2 pt-2">
        <div className="flex gap-3 overflow-x-auto pb-1 sm:gap-4 sm:overflow-visible">
          {birthday.cake.wishes.map((wish, i) => (
            <AnimatePresence key={i}>
              {extinguished[i] && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="glass min-w-[13rem] flex-1 rounded-2xl border border-white/10 bg-deep/70 p-4 shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.15em] text-orchid">
                    <Flame className="h-3 w-3" /> Wish {i + 1}
                  </div>
                  <h4 className="mt-1.5 font-serif text-lg text-lavender">{wish.title}</h4>
                  {wish.text ? (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{wish.text}</p>
                  ) : (
                    <p className="mt-1 text-xs italic text-muted-foreground/60">Tulis keinginanmu di sini — nanti.</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN EXPORT                                                         */
/* ------------------------------------------------------------------ */

export function CakeSection() {
  const birthday = useContent();
  const [extinguished, setExtinguished] = useState<boolean[]>([false, false, false]);

  const onExtinguish = useCallback((i: number) => {
    setExtinguished((prev) => {
      const next = [...prev];
      if (next[i]) return prev;
      next[i] = true;
      return next;
    });
  }, []);

  const allDone = extinguished.every(Boolean);
  const remaining = 3 - extinguished.filter(Boolean).length;

  return (
    <section
      id={birthday.cake?.nextId || "cake"}
      aria-label="Tiga keinginan kecil"
      className="relative scroll-mt-24 overflow-x-clip bg-transparent px-5 py-20 sm:px-8 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <div className="relative h-[520px] w-full overflow-hidden sm:h-[580px] md:h-[640px]">
          <Canvas
            camera={{ position: [0, 2.2, 5.8], fov: 32 }}
            gl={{ alpha: true, antialias: true }}
            style={{ background: "transparent" }}
          >
            <Scene extinguished={extinguished} onExtinguish={onExtinguish} allDone={allDone} />
          </Canvas>

          <CakeOverlay extinguished={extinguished} allDone={allDone} />
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-orchid/70">
          <span>Ketuk lilin untuk memadamkan — lalu buat keinginanmu.</span>
          <span className="mx-2 opacity-30">|</span>
          <span>{remaining} lilin tersisa</span>
        </div>
      </div>
    </section>
  );
}
