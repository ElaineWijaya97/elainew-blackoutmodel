import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LayerMaterial,
  Depth,
  Fresnel,
} from "lamina";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from "@react-three/postprocessing";

import { Canvas } from "@react-three/fiber";

import {
  OrbitControls,
  Environment,
  Html,
  Float,
  Stars,
  Line,
  RoundedBox,
  ContactShadows,
  AccumulativeShadows,
  RandomizedLight,
  MeshReflectorMaterial,
  SoftShadows,
  Text,
} from "@react-three/drei";

import * as THREE from "three";

/* =========================================================
   FLOATING LABEL
========================================================= */

function FloatingTag({
  position,
  label,
  color,
}) {
  return (
    <Html position={position} center>
      <div
        style={{
          padding: "10px 16px",
          borderRadius: 999,
          background:
            "rgba(2,6,23,0.85)",
          border: `1px solid ${color}`,
          color: "white",
          whiteSpace: "nowrap",
          backdropFilter: "blur(12px)",
          boxShadow: `0 0 25px ${color}`,
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {label}
      </div>
    </Html>
  );
}

/* =========================================================
   SMART HOUSE
========================================================= */

function SmartHouse({
  appliances,
}) {
  return (
    <Canvas
      camera={{
        position: [18, 14, 18],
        fov: 45,
      }}
    >
      <color
        attach="background"
        args={["#020617"]}
      />

      <ambientLight intensity={0.6} />

      <directionalLight
        position={[10, 12, 10]}
        intensity={1.2}
      />

      <pointLight
        position={[0, 8, 0]}
        intensity={1.0}
        color="#22d3ee"
      />

      <Stars
        radius={100}
        depth={60}
        count={6000}
        factor={4}
      />

      <Environment preset="city" />

      {/* FLOOR */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry
          args={[80, 80]}
        />

        <meshStandardMaterial color="#020617" />
      </mesh>

      {/* HOUSE BASE */}

      <RoundedBox
        args={[16, 0.5, 14]}
        radius={0.15}
        position={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          color="#1e293b"
          roughness={0}
          metalness={0.3}
          transparent
          opacity={0.7}
        />
      </RoundedBox>

      {/* SECOND FLOOR */}

      <RoundedBox
        args={[12, 0.45, 10]}
        radius={0.15}
        position={[0, 5.5, 0]}
      >
        <meshPhysicalMaterial
          color="#334155"
          transparent
          opacity={0.55}
          roughness={0}
          metalness={0.3}
        />
      </RoundedBox>

      {/* GLASS WALLS */}

      {[
        [0, 2.7, -7],
        [0, 2.7, 7],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p}
        >
          <boxGeometry
            args={[16, 5.4, 0.15]}
          />

          <meshPhysicalMaterial
            color="#67e8f9"
            transparent
            opacity={0.16}
          />
        </mesh>
      ))}

      {[
        [-8, 2.7, 0],
        [8, 2.7, 0],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p}
        >
          <boxGeometry
            args={[0.15, 5.4, 14]}
          />

          <meshPhysicalMaterial
            color="#67e8f9"
            transparent
            opacity={0.16}
          />

          <EffectComposer>
            <Bloom
              intensity={0.35}
              luminanceThreshold={0.25}
            />

            <ChromaticAberration
              offset={[0.0005, 0.0005]}
            />

            <Vignette
              eskil={false}
              offset={0.12}
              darkness={0.95}
            />
          </EffectComposer>
        </mesh>
      ))}

      {/* SECOND FLOOR WALLS */}

      {[
        [0, 8.2, -5],
        [0, 8.2, 5],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p}
        >
          <boxGeometry
            args={[12, 5.2, 0.12]}
          />

          <meshPhysicalMaterial
            color="#38bdf8"
            transparent
            opacity={0.12}
          />
        </mesh>
      ))}

      {/* STAIRS */}

      {Array.from({
        length: 10,
      }).map((_, i) => (
        <mesh
          key={i}
          position={[
            3.5 + i * 0.55,
            0.3 + i * 0.52,
            2,
          ]}
        >
          <boxGeometry
            args={[1.4, 0.18, 2]}
          />

          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      ))}

      {/* STAIR HOLE */}

      <mesh
        position={[6.2, 5.55, 2]}
      >
        <boxGeometry
          args={[3.6, 0.4, 3.6]}
        />

        <meshStandardMaterial color="#020617" />
      </mesh>

      {/* =====================================================
         TV ROOM
      ===================================================== */}

      <Float speed={1.5} rotationIntensity={0.1}>
        <group position={[-2, 1.2, 3]}>

          {/* TV STAND */}

          <mesh
            castShadow
            receiveShadow
            position={[-3, -0.9, 0]}
          >
            <boxGeometry args={[4.2, 0.35, 1.6]} />

            <meshStandardMaterial
              color="#1e293b"
              roughness={0.7}
              metalness={0.3}
            />
          </mesh>

          {/* TV */}

          <mesh
            castShadow
            position={[-3, 0.6, -0.45]}
          >
            <boxGeometry args={[2.8, 1.6, 0.08]} />

            <meshStandardMaterial
              color={appliances[0].active ? "#111827" : "#050505"}
              emissive={
                appliances[0].active
                  ? "#38bdf8"
                  : "#000000"
              }
              emissiveIntensity={0.9}
            />
          </mesh>

          {/* TV BASE */}

          <mesh position={[-3, -0.2, -0.4]}>
            <cylinderGeometry args={[0.12, 0.18, 0.5, 24]} />

            <meshStandardMaterial color="#94a3b8" />
          </mesh>

          {/* FRIDGE */}

          <group position={[3.7, 0, -0.3]} rotation={[0, Math.PI, 0]}>

            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.5, 3.2, 1.5]} />

              <meshPhysicalMaterial
                color="#cbd5e1"
                metalness={0.9}
                roughness={0.25}
                emissive={appliances[4].active ? "#60a5fa" : "#000000"}
                emissiveIntensity={0.4}
              />
            </mesh>

            {/* fridge handles */}

            <mesh position={[0.68, 0.6, 0.76]}>
              <boxGeometry args={[0.08, 1.2, 0.08]} />

              <meshStandardMaterial color="#64748b" />
            </mesh>

            <mesh position={[0.68, -0.9, 0.76]}>
              <boxGeometry args={[0.08, 1.2, 0.08]} />

              <meshStandardMaterial color="#64748b" />
            </mesh>

          </group>

          <FloatingTag
            position={[5.6, 2.2, -0.3]}
            label={`${appliances[4].name} • ${appliances[4].watt}W`}
            color="#60a5fa"
          />

          <FloatingTag
            position={[0, 2.5, 0]}
            label={`${appliances[0].name} • ${appliances[0].watt}W`}
            color="#22d3ee"
          />

        </group>
      </Float>

      {/* SOFA */}

      <mesh
        position={[-1, 0.7, 2.8]}
      >
        <boxGeometry
          args={[3.5, 1.4, 1.8]}
        />

        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* =====================================================
         PC ROOM
      ===================================================== */}

      <group position={[0, 8.5, -1.5]}>

          {/* DESK */}

          <mesh
            receiveShadow
            castShadow
            position={[0, -1, 0]}
          >
            <boxGeometry args={[5, 0.25, 2.2]} />

            <meshStandardMaterial
              color="#1e293b"
              roughness={0.7}
            />
          </mesh>

          {/* LEGS */}

          {[
            [-2.1, -2, -0.9],
            [2.1, -2, -0.9],
            [-2.1, -2, 0.9],
            [2.1, -2, 0.9],
          ].map((p, i) => (
            <mesh key={i} position={p}>
              <boxGeometry args={[0.12, 2, 0.12]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          ))}

          {/* MONITOR */}

          <mesh
            castShadow
            position={[0, 0, -0.55]}
          >
            <boxGeometry args={[2.5, 1.5, 0.08]} />

            <meshStandardMaterial
              color="#050505"
              emissive={
                appliances[1].active
                  ? "#22c55e"
                  : "#000"
              }
              emissiveIntensity={1.2}
            />
          </mesh>

          {/* MONITOR STAND */}

          <mesh position={[0, -0.7, -0.55]}>
            <cylinderGeometry args={[0.08, 0.1, 0.7]} />

            <meshStandardMaterial color="#94a3b8" />
          </mesh>

          {/* PC CASE ON FLOOR */}

          <mesh
            castShadow
            position={[-3.2, -1.2, 0.6]}
          >
            <boxGeometry args={[1, 2.4, 1]} />

            <meshStandardMaterial
              color="#111827"
              emissive={
                  appliances[1].active
                    ? "#22c55e"
                    : "#000"
                }
                emissiveIntensity={0.8}
            />
          </mesh>

          {/* GLASS SIDE PANEL */}

          <mesh position={[-1.38, -1.2, 1.01]}>
            <boxGeometry args={[0.02, 2, 0.7]} />

            <meshPhysicalMaterial
              color="#86efac"
              transmission={1}
              roughness={0}
              thickness={0.2}
            />
          </mesh>

          {/* KEYBOARD */}

          <mesh position={[0, -0.8, 0.3]}>
            <boxGeometry args={[1.5, 0.05, 0.45]} />

            <meshStandardMaterial color="#cbd5e1" />
          </mesh>

          {/* MOUSE */}

          <mesh position={[1.2, -0.78, 0.3]}>
            <boxGeometry args={[0.2, 0.05, 0.3]} />

            <meshStandardMaterial color="#e2e8f0" />
          </mesh>

          {/* ROUTER ON DESK */}

          <group position={[1.8, 0.15, 0.1]}>

            <mesh>
              <boxGeometry args={[0.6, 0.12, 0.4]} />

              <meshStandardMaterial
                color="#111827"
                emissive={
                  appliances[3].active
                    ? "#facc15"
                    : "#000"
                }
                emissiveIntensity={0.6}
              />
            </mesh>

            {[ -0.2, 0, 0.2 ].map((x, i) => (
              <mesh key={i} position={[x, 0.3, -0.1]}>
                <cylinderGeometry args={[0.015,0.015,0.5,8]} />
                <meshStandardMaterial color="#94a3b8" />
              </mesh>
            ))}

          </group>

          <FloatingTag
            position={[0, 2.3, 0]}
            label={`${appliances[1].name} • ${appliances[1].watt}W`}
            color="#22c55e"
          />

          <FloatingTag
            position={[1.8, 0.8, 0.1]}
            label={`${appliances[3].name} • ${appliances[3].watt}W`}
            color="#facc15"
          />

        </group>

      

      {/* HEATER */}

      <group position={[3.6, 7.2, -2.8]}>

          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.1, 2, 0.5]} />

            <meshStandardMaterial
              color="#27272a"
              emissive={
                appliances[2].active
                  ? "#c084fc"
                  : "#000"
              }
              emissiveIntensity={0.9}
            />
          </mesh>

          {/* VENTS */}

          {[-0.6,-0.3,0,0.3,0.6].map((y,i)=>(
            <mesh key={i} position={[0,y,0.26]}>
              <boxGeometry args={[0.8,0.05,0.03]} />
              <meshStandardMaterial color="#a1a1aa" />
            </mesh>
          ))}

          <FloatingTag
            position={[0, 1.8, 0]}
            label={`${appliances[2].name} • ${appliances[2].watt}W`}
            color="#c084fc"
          />

        </group>

      {/* BED */}

      <mesh
        position={[-4.5, 5.9, 2]}
      >
        <boxGeometry
          args={[3, 1, 4]}
        />

        <meshStandardMaterial color="#1e293b" />
      </mesh>

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        minDistance={10}
        maxDistance={26}
        maxPolarAngle={Math.PI / 2.02}
        target={[0, 4, 0]}
      />
      <ContactShadows
        position={[0, -0.24, 0]}
        opacity={0.6}
        scale={40}
        blur={2.5}
        far={20}
      />
    </Canvas>
  );
}

/* =========================================================
   PAPUA MICROGRID
========================================================= */

function PapuaGrid({
  solarPercent,
  plnPercent,
  bioPercent,
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        physicallyCorrectLights: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{
        position: [14, 10, 14],
        fov: 38,
      }}
    >
      <color
        attach="background"
        args={["#020617"]}
      />

      <fog
        attach="fog"
        args={["#020617", 30, 70]}
      />
      <SoftShadows size={40} samples={25} focus={0.6} />
      <ambientLight intensity={0.25} />

      <directionalLight
        castShadow
        position={[10, 18, 10]}
        intensity={2.5}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
      />

      <pointLight
        position={[-4, 2, 3]}
        intensity={5}
        color="#22d3ee"
      />

      <pointLight
        position={[0, 7, -1]}
        intensity={4}
        color="#22c55e"
      />

      <pointLight
        position={[5, 6, -4]}
        intensity={3}
        color="#c084fc"
      />

      <Stars
        radius={120}
        depth={80}
        count={7000}
        factor={4}
      />

      <Environment preset="night" />

      {/* FLOOR */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 80]} />

        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={15}
          roughness={0.85}
          depthScale={1}
          minDepthThreshold={0.4}
          color="#0f172a"
          metalness={0.4}
        />
      </mesh>

      {/* =====================================================
         BIODIESEL GENERATOR
      ===================================================== */}

      <Float speed={2}>
        <group position={[-14, 2, 0]}>
          {/* BASE */}

          <mesh position={[0, -1.8, 0]}>
            <boxGeometry
              args={[7, 0.6, 5]}
            />

            <meshStandardMaterial
              color="#111827"
            />
          </mesh>

          {/* MAIN GENERATOR */}

          <mesh castShadow>
            <boxGeometry
              args={[6, 3.5, 4]}
            />

            <meshStandardMaterial
              color="#1f2937"
              emissive="#22c55e"
              emissiveIntensity={
                bioPercent / 45
              }
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          {/* SIDE VENTS */}

          {[-2.4, -1.8, -1.2, -0.6, 0, 0.6].map(
            (x, i) => (
              <mesh
                key={i}
                position={[
                  x,
                  0,
                  2.05,
                ]}
              >
                <boxGeometry
                  args={[
                    0.22,
                    1.8,
                    0.08,
                  ]}
                />

                <meshStandardMaterial
                  color="#4b5563"
                />
              </mesh>
            )
          )}

          {/* SCREEN */}

          <mesh
            position={[1.5, 0.3, 2.05]}
          >
            <boxGeometry
              args={[1.2, 1, 0.05]}
            />

            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={2}
            />
          </mesh>

          {/* EXHAUST */}

          <mesh
            position={[-1.8, 2.7, 0]}
          >
            <cylinderGeometry
              args={[0.35, 0.45, 2.5, 24]}
            />

            <meshStandardMaterial
              color="#9ca3af"
              metalness={0.8}
            />
          </mesh>

          {/* GLOW */}

          <pointLight
            position={[0, 0, 0]}
            intensity={3}
            color="#22c55e"
          />

          <FloatingTag
            position={[0, 5, 0]}
            label={`Bio ${bioPercent}%`}
            color="#22c55e"
          />
        </group>
      </Float>

      {/* =====================================================
        TRANSMISSION TOWER
      ========================================================= */}

      <group position={[0, 4, 0]}>

        {/* BASE */}

        <mesh position={[0, -3.6, 0]}>
          <boxGeometry
            args={[1.5, 0.5, 1.5]}
          />

          <meshStandardMaterial
            color="#6b7280"
          />
        </mesh>

        {/* MAIN TOWER */}

        <mesh position={[0, 0, 0]}>
          <cylinderGeometry
            args={[0.12, 0.2, 8, 8]}
          />

          <meshStandardMaterial
            color="#d1d5db"
            emissive="#22d3ee"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.3}
          />
        </mesh>

        {/* CROSS ARMS */}

        {[1.8, 3.8].map((y, i) => (
          <mesh
            key={i}
            position={[0, y, 0]}
            rotation={[
              0,
              0,
              Math.PI / 2,
            ]}
          >
            <cylinderGeometry
              args={[0.05, 0.05, 3, 8]}
            />

            <meshStandardMaterial
              color="#e5e7eb"
            />
          </mesh>
        ))}

        {/* LIGHT */}

        <pointLight
          position={[0, 3.5, 0]}
          intensity={2}
          color="#22d3ee"
        />

        <FloatingTag
          position={[0, 6, 0]}
          label={`PLN ${plnPercent}%`}
          color="#60a5fa"
        />

      </group>

      {/* =====================================================
         SOLAR PANELS
      ===================================================== */}

      <group position={[14, 1, 0]}>
        {[-4, 0, 4].map((x, i) => (
          <group
            key={i}
            position={[x, 0, 0]}
            rotation={[-0.45, 0, 0]}
          >
            {/* PANEL */}

            <mesh castShadow>
              <boxGeometry
                args={[3.5, 0.15, 5]}
              />

              <meshStandardMaterial
                color="#1e3a8a"
                emissive="#38bdf8"
                emissiveIntensity={
                  solarPercent / 40
                }
                metalness={0.5}
                roughness={0.2}
              />
            </mesh>

            {/* GRID LINES */}

            {[-1, 0, 1].map(
              (line, idx) => (
                <mesh
                  key={idx}
                  position={[
                    line,
                    0.08,
                    0,
                  ]}
                >
                  <boxGeometry
                    args={[
                      0.04,
                      0.04,
                      5,
                    ]}
                  />

                  <meshStandardMaterial
                    color="#93c5fd"
                  />
                </mesh>
              )
            )}

            {/* STAND */}

            <mesh
              position={[0, -1.5, 1]}
            >
              <boxGeometry
                args={[0.15, 3, 0.15]}
              />

              <meshStandardMaterial
                color="#94a3b8"
              />
            </mesh>
          </group>
        ))}

        <pointLight
          position={[0, 2, 0]}
          intensity={3}
          color="#facc15"
        />

        <FloatingTag
          position={[0, 5, 0]}
          label={`Solar ${solarPercent}%`}
          color="#facc15"
        />
      </group>

      {/* =====================================================
        MODERN HOUSE
      ========================================================= */}

      <Float speed={1.5}>
        <group position={[0, 1.8, -12]}>

          {/* HOUSE BODY */}

          <mesh castShadow>
            <boxGeometry
              args={[7, 4, 6]}
            />

            <meshStandardMaterial
              color="#1e293b"
              metalness={0.25}
              roughness={0.4}
            />
          </mesh>

          {/* SECOND FLOOR */}

          <mesh
            position={[0, 2.8, -0.3]}
          >
            <boxGeometry
              args={[4.5, 2, 4]}
            />

            <meshStandardMaterial
              color="#334155"
              metalness={0.2}
            />
          </mesh>

          {/* WINDOWS */}

          {[
            [-2, 0.7, 3.05],
            [0, 0.7, 3.05],
            [2, 0.7, 3.05],
            [-1, 3, 2.05],
            [1, 3, 2.05],
          ].map((p, i) => (
            <mesh
              key={i}
              position={p}
            >
              <boxGeometry
                args={[1, 1, 0.08]}
              />

              <meshStandardMaterial
                color="#fef08a"
                emissive="#fde047"
                emissiveIntensity={2.5}
              />
            </mesh>
          ))}

          {/* DOOR */}

          <mesh
            position={[0, -0.8, 3.05]}
          >
            <boxGeometry
              args={[1.2, 2.2, 0.08]}
            />

            <meshStandardMaterial
              color="#78350f"
            />
          </mesh>

          {/* HOUSE LIGHT */}

          <pointLight
            position={[0, 1, 2]}
            intensity={2}
            color="#22d3ee"
          />

        </group>
      </Float>

      {/* =====================================================
         OLD NEON POWER LINES
      ===================================================== */}

      <Line
        points={[
          [-10, 2, 0],
          [-5, 4, 0],
          [0, 5, 0],
        ]}
        color="#22ff88"
        lineWidth={3}
      />

      <Line
        points={[
          [0, 5, 0],
          [5, 4, 0],
          [10, 2, 0],
        ]}
        color="#38bdf8"
        lineWidth={3}
      />

      <Line
        points={[
          [0, 5, 0],
          [0, 2, -6],
          [0, 2, -12],
        ]}
        color="#22d3ee"
        lineWidth={3}
      />
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        minDistance={10}
        maxDistance={26}
        maxPolarAngle={Math.PI / 2.02}
        target={[0, 4, 0]}
      />
    </Canvas>
  );
}
/* =========================================================
   APP
========================================================= */

export default function App() {

  const [tab, setTab] =
    useState("house");

  /* =====================================================
     HOUSE
  ===================================================== */

  const [capacity, setCapacity] =
    useState(1800);

  const [appliances, setAppliances] =
    useState([
      {
        name: "TV",
        watt: 240,
        active: true,
        priority: "low",
      },

      {
        name: "Gaming PC",
        watt: 720,
        active: true,
        priority: "medium",
      },

      {
        name: "Heater",
        watt: 650,
        active: true,
        priority: "medium",
      },

      {
        name: "Router",
        watt: 80,
        active: true,
        priority: "critical",
      },
      {
        name: "Fridge",
        watt: 150,
        active: true,
        priority: "medium",
      },
    ]);

  const totalUsage = useMemo(() => {
    return appliances
      .filter((a) => a.active)
      .reduce(
        (sum, a) =>
          sum + a.watt,
        0
      );
  }, [appliances]);

  function toggle(index) {
    setAppliances((prev) =>
      prev.map((a, i) =>
        i === index
          ? {
              ...a,
              active: !a.active,
            }
          : a
      )
    );
  }
    useEffect(() => {

    if (totalUsage <= capacity)
      return;

    const priorityOrder = {
      low: 0,
      medium: 1,
      critical: 2,
    };

    const sorted = [...appliances]
      .map((a, i) => ({
        ...a,
        index: i,
      }))
      .sort(
        (a, b) =>
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
      );

    let currentUsage = totalUsage;

    const updated = [...appliances];

    for (const appliance of sorted) {

      if (currentUsage <= capacity)
        break;

      if (appliance.active) {

        updated[appliance.index] = {
          ...updated[appliance.index],
          active: false,
        };

        currentUsage -= appliance.watt;
      }
    }

    setAppliances(updated);

  }, [
    totalUsage,
    capacity,
  ]);

  /* =====================================================
     PAPUA MICROGRID
  ===================================================== */

  const [solarPrice, setSolarPrice] =
    useState(10);

  const [plnPrice, setPlnPrice] =
    useState(18);

  const [bioPrice, setBioPrice] =
    useState(26);

  const [
    solarProduction,
    setSolarProduction,
  ] = useState(600);

  const [
    plnProduction,
    setPlnProduction,
  ] = useState(900);

  const [
    bioProduction,
    setBioProduction,
  ] = useState(500);

  const [increase, setIncrease] =
    useState(40);

  const futureDemand =
    totalUsage *
    (1 + increase / 100);

  const sources = [
    {
      name: "solar",
      price: solarPrice,
      production:
        solarProduction,
    },

    {
      name: "pln",
      price: plnPrice,
      production:
        plnProduction,
    },

    {
      name: "bio",
      price: bioPrice,
      production:
        bioProduction,
    },
  ].sort(
    (a,b) =>
      a.price - b.price
  );

  let remaining =
    futureDemand;

  let solarUsed = 0;
  let plnUsed = 0;
  let bioUsed = 0;

  sources.forEach((s) => {

    const used = Math.min(
      remaining,
      s.production
    );

    remaining -= used;

    if(s.name==="solar")
      solarUsed = used;

    if(s.name==="pln")
      plnUsed = used;

    if(s.name==="bio")
      bioUsed = used;

  });

  const totalUsed =
    solarUsed +
    plnUsed +
    bioUsed;

  const solarPercent =
    Math.round(
      (solarUsed / totalUsed)
      * 100
    ) || 0;

  const plnPercent =
    Math.round(
      (plnUsed / totalUsed)
      * 100
    ) || 0;

  const bioPercent =
    Math.round(
      (bioUsed / totalUsed)
      * 100
    ) || 0;

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom,#020617,#0f172a,#111827)",
        color: "white",
        overflowX: "hidden",
        fontFamily: "Arial",
      }}
    >

      {/* NAVBAR */}

      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          gap: 14,
          zIndex: 9999,
        }}
      >
        {[
          ["house","Lombok Smart House"],
          ["papua","Papua Microgrid"],
        ].map(([id,label]) => (
          <button
            key={id}
            onClick={() =>
              setTab(id)
            }
            className={
              tab === id
                ? "tab-button active"
                : "tab-button"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* =====================================================
        SMART HOUSE
      ===================================================== */}

      {tab === "house" && (

        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "grid",
            gridTemplateColumns: "1.5fr 0.7fr",
            paddingTop: 90,
          }}
        >

          <SmartHouse
            appliances={appliances}
          />

          <div
            style={{
              padding: 24,
              overflow: "auto",
            }}
          >

            {/* PANEL */}

            <div className="panel">

              <h1>
                Aceh Smart House AI
              </h1>

              <h2>
                Usage: {totalUsage}W
              </h2>

              <input
                className="slider"
                type="range"
                min="500"
                max="3500"
                value={capacity}
                onChange={(e) =>
                  setCapacity(
                    Number(e.target.value)
                  )
                }
              />

              <h2>
                Capacity: {capacity}W
              </h2>

              {/* WARNING */}

              {totalUsage > capacity && (
                <div
                  style={{
                    marginTop: 14,
                    padding: 14,
                    borderRadius: 14,
                    background:
                      "rgba(239,68,68,0.15)",
                    border:
                      "1px solid rgba(239,68,68,0.4)",
                    color: "#fca5a5",
                    fontWeight: 700,
                  }}
                >
                  Capacity exceeded.
                  AI is shutting down
                  lower priority devices.
                </div>
              )}

            </div>

            {/* APPLIANCES */}

            <div
              style={{
                marginTop: 20,
              }}
            >

              {appliances.map(
                (app, index) => (

                  <div
                    key={app.name}
                    className="energy-card"
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                      }}
                    >

                      <div>

                        <h2>
                          {app.name}
                        </h2>

                        <h3>
                          {app.watt}W
                        </h3>
                        {/* WATT SLIDER */}

                        <div
                          style={{
                            marginTop: 14,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: 6,
                              fontSize: 13,
                              color: '#94a3b8',
                            }}
                          >
                            <span>Power Usage</span>
                            <span>{app.watt}W</span>
                          </div>

                          <input
                            type="range"
                            min="20"
                            max="1500"
                            step="10"
                            value={app.watt}
                            onChange={(e) => {
                              const value = Number(
                                e.target.value
                              );

                              setAppliances((prev) =>
                                prev.map((item, i) =>
                                  i === index
                                    ? {
                                        ...item,
                                        watt: value,
                                      }
                                    : item
                                )
                              );
                            }}
                            style={{
                              width: '100%',
                              cursor: 'pointer',
                              accentColor: app.color,
                            }}
                          />
                        </div>
                        <select
                          value={app.priority}
                          onChange={(e) => {

                            const updated =
                              [...appliances];

                            updated[index] = {
                              ...updated[index],
                              priority:
                                e.target.value,
                            };

                            setAppliances(updated);

                          }}

                          style={{
                            marginTop: 10,
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "#0f172a",
                            color: "white",
                            border:
                              "1px solid #334155",
                            fontWeight: 600,
                            outline: "none",
                          }}
                        >

                          <option value="critical">
                            Important
                          </option>

                          <option value="medium">
                            Medium
                          </option>

                          <option value="low">
                            Unimportant
                          </option>

                        </select>

                      </div>

                      <button
                        className="tab-button"
                        onClick={() =>
                          toggle(index)
                        }

                        style={{
                          background:
                            app.active
                              ? "#22d3ee"
                              : "#374151",

                          color:
                            app.active
                              ? "black"
                              : "white",
                        }}
                      >

                        {app.active
                          ? "ON"
                          : "OFF"}

                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}
      {/* =====================================================
         PAPUA
      ===================================================== */}

      {tab === "papua" && (

        <div
          style={{
            width:"100vw",
            height:"100vh",
            display:"grid",
            gridTemplateColumns:
              "1.5fr 0.7fr",
            paddingTop:90,
          }}
        >

          <PapuaGrid
            solarPercent={
              solarPercent
            }
            plnPercent={
              plnPercent
            }
            bioPercent={
              bioPercent
            }
          />

          <div
            style={{
              padding:20,
              overflow:"auto",
            }}
          >

            <div className="panel">

              <h1>
                Papua AI Microgrid
              </h1>

              <h2>
                Future Demand:
                {" "}
                {Math.round(
                  futureDemand
                )}W
              </h2>

              <input
                className="slider"
                type="range"
                min="0"
                max="100"
                value={increase}
                onChange={(e)=>
                  setIncrease(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <h2>
                Predicted Increase:
                {" "}
                {increase}%
              </h2>

            </div>

            {/* SOLAR */}

            <div className="energy-card">

              <h2
                style={{
                  color:"#facc15",
                }}
              >
                Solar
              </h2>

              <p>
                Price Per kWh
              </p>

              <input
                type="range"
                min="1"
                max="50"
                value={solarPrice}
                onChange={(e)=>
                  setSolarPrice(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <h3>
                ${solarPrice}
              </h3>

              <p>
                Production
              </p>

              <input
                type="range"
                min="0"
                max="1500"
                value={
                  solarProduction
                }
                onChange={(e)=>
                  setSolarProduction(
                    Number(
                      e.target.value
                    )
                  )
                }
              />

              <h3>
                {solarProduction}
                kWh
              </h3>

              <h1>
                {solarPercent}%
              </h1>

            </div>

            {/* PLN */}

            <div className="energy-card">

              <h2
                style={{
                  color:"#60a5fa",
                }}
              >
                PLN Grid
              </h2>

              <h1>
                {plnPercent}%
              </h1>

            </div>

            {/* BIODIESEL */}

            <div className="energy-card">

              <h2
                style={{
                  color:"#22c55e",
                }}
              >
                Biodiesel
              </h2>

              <h1>
                {bioPercent}%
              </h1>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}