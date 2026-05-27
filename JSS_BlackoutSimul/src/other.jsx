import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Canvas } from '@react-three/fiber';

import {
  OrbitControls,
  Html,
  Float,
  Environment,
} from '@react-three/drei';

/* =========================
   DATA
========================= */

const yearlyData = [
  { year: 2020, saifi: 9.25 },
  { year: 2021, saifi: 6.7 },
  { year: 2022, saifi: 5.62 },
  { year: 2023, saifi: 4.27 },
  { year: 2024, saifi: 3.23 },
  { year: 2025, saifi: 2.9 },
];

const regions = [
  {
    name: 'Aceh',
    x: '14%',
    y: '32%',
    color: '#ef4444',
    desc: 'Storm blackouts',
  },

  {
    name: 'Lombok',
    x: '57%',
    y: '68%',
    color: '#f59e0b',
    desc: 'Renewable instability',
  },

  {
    name: 'Papua',
    x: '84%',
    y: '48%',
    color: '#22d3ee',
    desc: 'Remote solar grids',
  },
];

/* =========================
   APP
========================= */

export default function App() {
  const [tab, setTab] =
    useState('statistics');

  const [capacity, setCapacity] =
    useState(1700);

  const [disaster, setDisaster] =
    useState(false);

  const [gridStatus, setGridStatus] =
    useState('Stable');

  const [selectedRegion, setSelectedRegion] =
    useState(regions[0]);

  const [appliances, setAppliances] =
    useState([
      {
        name: 'TV',
        watt: 240,
        priority: 'important',
        room: 'Living Room',
        active: true,
        color: '#38bdf8',
      },

      {
        name: 'Gaming PC',
        watt: 720,
        priority: 'very important',
        room: 'Bedroom',
        active: true,
        color: '#4ade80',
      },

      {
        name: 'Heater',
        watt: 650,
        priority: 'not important',
        room: 'Bathroom',
        active: true,
        color: '#c084fc',
      },

      {
        name: 'Router',
        watt: 60,
        priority: 'very important',
        room: 'Bedroom',
        active: true,
        color: '#facc15',
      },

      {
        name: 'Kitchen Lights',
        watt: 180,
        priority: 'important',
        room: 'Kitchen',
        active: true,
        color: '#fb7185',
      },
    ]);

  const totalUsage = useMemo(() => {
    return appliances
      .filter((a) => a.active)
      .reduce((sum, a) => sum + a.watt, 0);
  }, [appliances]);

  /* =========================
     OVERLOAD LOGIC
  ========================= */

  useEffect(() => {
    if (totalUsage <= capacity) {
      if (!disaster) {
        setGridStatus('Stable');
      }

      return;
    }

    setGridStatus('Overload Detected');

    setAppliances((prev) => {
      const updated = prev.map((a) => ({
        ...a,
      }));

      updated.forEach((item) => {
        if (
          item.priority ===
            'not important' &&
          item.active
        ) {
          item.active = false;
        }
      });

      let usage = updated
        .filter((a) => a.active)
        .reduce((s, a) => s + a.watt, 0);

      if (usage > capacity) {
        updated.forEach((item) => {
          if (
            item.priority ===
              'important' &&
            item.active
          ) {
            item.active = false;
          }
        });
      }

      return updated;
    });
  }, [totalUsage, capacity, disaster]);

  /* =========================
     DISASTER SIM
  ========================= */

  useEffect(() => {
    if (!disaster) return;

    setGridStatus(
      'Flood Damaged Main Line'
    );

    const t1 = setTimeout(() => {
      setGridStatus(
        'AI Rerouting Power'
      );
    }, 2500);

    const t2 = setTimeout(() => {
      setGridStatus(
        'Hospital Priority Enabled'
      );
    }, 5000);

    const t3 = setTimeout(() => {
      setGridStatus('Recovered');

      setDisaster(false);
    }, 8500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [disaster]);

  /* =========================
     3D APPLIANCE
  ========================= */

  function Appliance({
    appliance,
    position,
    type,
  }) {
    return (
      <group position={position}>
        {/* TV */}

        {type === 'tv' && (
          <>
            {/* TABLE */}

            <mesh position={[0, -1, 0]}>
              <boxGeometry
                args={[3.5, 0.2, 1.5]}
              />

              <meshStandardMaterial color="#1e293b" />
            </mesh>

            <mesh position={[0, -1.5, 0.5]}>
              <boxGeometry
                args={[0.2, 1, 0.2]}
              />

              <meshStandardMaterial color="#334155" />
            </mesh>

            <mesh position={[0, -1.5, -0.5]}>
              <boxGeometry
                args={[0.2, 1, 0.2]}
              />

              <meshStandardMaterial color="#334155" />
            </mesh>

            {/* TV */}

            <mesh position={[0, 0, 0]}>
              <boxGeometry
                args={[2.4, 1.4, 0.1]}
              />

              <meshStandardMaterial
                color={
                  appliance.active
                    ? '#67e8f9'
                    : '#111'
                }
                emissive={
                  appliance.active
                    ? '#67e8f9'
                    : '#000'
                }
                emissiveIntensity={2}
              />
            </mesh>

            <mesh position={[0, -0.8, 0]}>
              <boxGeometry
                args={[0.2, 0.6, 0.2]}
              />

              <meshStandardMaterial color="#666" />
            </mesh>
          </>
        )}

        {/* PC */}

        {type === 'pc' && (
          <>
            {/* DESK */}

            <mesh position={[0, -1, 0]}>
              <boxGeometry
                args={[4, 0.2, 2]}
              />

              <meshStandardMaterial color="#1e293b" />
            </mesh>

            {/* LEGS */}

            <mesh position={[-1.6, -1.8, 0.7]}>
              <boxGeometry
                args={[0.2, 1.6, 0.2]}
              />

              <meshStandardMaterial color="#334155" />
            </mesh>

            <mesh position={[1.6, -1.8, 0.7]}>
              <boxGeometry
                args={[0.2, 1.6, 0.2]}
              />

              <meshStandardMaterial color="#334155" />
            </mesh>

            {/* MONITOR */}

            <mesh position={[0, 0, 0]}>
              <boxGeometry
                args={[2, 1.2, 0.08]}
              />

              <meshStandardMaterial
                color="#38bdf8"
                emissive="#38bdf8"
                emissiveIntensity={2}
              />
            </mesh>

            {/* PC CASE */}

            <mesh position={[-1.3, -0.2, 0]}>
              <boxGeometry
                args={[0.9, 2, 0.9]}
              />

              <meshStandardMaterial
                color={
                  appliance.active
                    ? '#4ade80'
                    : '#111'
                }
                emissive={
                  appliance.active
                    ? '#4ade80'
                    : '#000'
                }
                emissiveIntensity={2}
              />
            </mesh>

            {/* KEYBOARD */}

            <mesh position={[0, -0.7, 0.5]}>
              <boxGeometry
                args={[1.4, 0.08, 0.5]}
              />

              <meshStandardMaterial color="#64748b" />
            </mesh>
          </>
        )}

        {/* HEATER */}

        {type === 'heater' && (
          <>
            <mesh position={[0, -1, 0]}>
              <cylinderGeometry
                args={[0.9, 0.9, 1.8, 32]}
              />

              <meshStandardMaterial
                color={
                  appliance.active
                    ? '#c084fc'
                    : '#111'
                }
                emissive={
                  appliance.active
                    ? '#c084fc'
                    : '#000'
                }
                emissiveIntensity={2}
              />
            </mesh>

            <mesh position={[0, -2, 0]}>
              <boxGeometry
                args={[1.4, 0.2, 1.4]}
              />

              <meshStandardMaterial color="#334155" />
            </mesh>
          </>
        )}

        {/* LABEL */}

        <Html center>
          <div
            style={{
              background:
                'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px 14px',
              borderRadius: 999,
              border: `1px solid ${appliance.color}`,
              fontSize: 12,
              whiteSpace: 'nowrap',
              transform:
                'translateY(-90px)',
            }}
          >
            ⚡ {appliance.name} •{' '}
            {appliance.watt}W
          </div>
        </Html>
      </group>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        background:
          'linear-gradient(to bottom right,#020617,#0f172a,#1e1b4b)',
        color: 'white',
        fontFamily: 'Arial',
      }}
    >
      {/* NAV */}

      <div
        style={{
          display: 'flex',
          justifyContent:
            'flex-end',
          gap: 20,
          padding: 25,
          position: 'sticky',
          top: 0,
          zIndex: 999,
          background:
            'rgba(2,6,23,0.7)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {[
          'statistics',
          'house',
          'town',
        ].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '14px 24px',
              borderRadius: 18,
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              background:
                tab === t
                  ? '#22d3ee'
                  : '#111827',
              color:
                tab === t
                  ? 'black'
                  : 'white',
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* =========================
         STATS PAGE
      ========================= */}

      {tab === 'statistics' && (
        <div
          style={{
            padding: 30,
          }}
        >
          <h1
            style={{
              fontSize: 56,
            }}
          >
            Indonesia Blackout Statistics
          </h1>

          <p
            style={{
              color: '#94a3b8',
              marginTop: 10,
              marginBottom: 40,
            }}
          >
            AI-powered smart grid and
            disaster recovery simulation
          </p>

          {/* GRAPH */}

          <div
            style={{
              background: '#111827',
              borderRadius: 30,
              padding: 30,
              marginBottom: 30,
            }}
          >
            <h2>
              SAIFI Trends
            </h2>

            <div
              style={{
                display: 'flex',
                alignItems:
                  'flex-end',
                gap: 20,
                height: 320,
                marginTop: 30,
              }}
            >
              {yearlyData.map(
                (item) => (
                  <div
                    key={item.year}
                    style={{
                      flex: 1,
                      textAlign:
                        'center',
                    }}
                  >
                    <div
                      style={{
                        height:
                          item.saifi *
                          26,
                        borderRadius: 20,
                        background:
                          'linear-gradient(to top,#ef4444,#f59e0b)',
                      }}
                    />

                    <div
                      style={{
                        marginTop: 10,
                      }}
                    >
                      {
                        item.year
                      }
                    </div>

                    <div
                      style={{
                        color:
                          '#94a3b8',
                      }}
                    >
                      {
                        item.saifi
                      }
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* MAP */}

          <div
            style={{
              background: '#111827',
              borderRadius: 30,
              padding: 30,
              position: 'relative',
            }}
          >
            <h2>
              Vulnerable Regions
            </h2>

            <div
              style={{
                position:
                  'relative',
                marginTop: 20,
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Indonesia_provinces_blank_map.svg"
                alt="Indonesia"
                style={{
                  width: '100%',
                  maxHeight:
                    '700px',
                  objectFit:
                    'contain',
                  borderRadius: 20,
                  background:
                    '#0f172a',
                }}
              />

              {regions.map(
                (region) => (
                  <button
                    key={region.name}
                    onClick={() =>
                      setSelectedRegion(
                        region
                      )
                    }
                    style={{
                      position:
                        'absolute',
                      left:
                        region.x,
                      top:
                        region.y,
                      transform:
                        'translate(-50%, -50%)',
                      width: 22,
                      height: 22,
                      borderRadius:
                        '50%',
                      border:
                        'none',
                      background:
                        region.color,
                      boxShadow: `0 0 24px ${region.color}`,
                      cursor:
                        'pointer',
                    }}
                  />
                )
              )}
            </div>

            <div
              style={{
                marginTop: 30,
                background:
                  '#1f2937',
                padding: 20,
                borderRadius: 20,
              }}
            >
              <h2>
                {
                  selectedRegion.name
                }
              </h2>

              <p
                style={{
                  color:
                    selectedRegion.color,
                }}
              >
                {
                  selectedRegion.desc
                }
              </p>
            </div>
          </div>

          {/* EXTRA STATS */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr 1fr',
              gap: 20,
              marginTop: 30,
            }}
          >
            <div
              style={{
                background:
                  '#111827',
                padding: 25,
                borderRadius: 25,
              }}
            >
              <h3>
                Avg Outages
              </h3>

              <h1>
                3.23
              </h1>

              <p>
                interruptions/customer/year
              </p>
            </div>

            <div
              style={{
                background:
                  '#111827',
                padding: 25,
                borderRadius: 25,
              }}
            >
              <h3>
                SAIDI Reduction
              </h3>

              <h1>
                -17.89
              </h1>

              <p>
                minutes from 2023
              </p>
            </div>

            <div
              style={{
                background:
                  '#111827',
                padding: 25,
                borderRadius: 25,
              }}
            >
              <h3>
                Economic Loss
              </h3>

              <h1>
                $58M
              </h1>

              <p>
                estimated during severe
                outages
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================
         HOUSE
      ========================= */}

      {tab === 'house' && (
        <div
          style={{
            padding: 30,
            display: 'grid',
            gridTemplateColumns:
              '1.5fr 0.7fr',
            gap: 30,
            height: '90vh',
          }}
        >
          {/* 3D HOUSE */}

          <div
            style={{
              background: '#111827',
              borderRadius: 30,
              overflow: 'hidden',
            }}
          >
            <Canvas
              camera={{
                position: [
                  14,
                  10,
                  16,
                ],
                fov: 45,
              }}
            >
              <ambientLight intensity={1} />

              <pointLight
                position={[
                  0,
                  10,
                  0,
                ]}
                intensity={2}
                color="#38bdf8"
              />

              <Environment preset="city" />

              {/* FLOOR */}

              <mesh
                rotation={[
                  -Math.PI / 2,
                  0,
                  0,
                ]}
              >
                <planeGeometry
                  args={[50, 50]}
                />

                <meshStandardMaterial color="#020617" />
              </mesh>

              {/* HOUSE BODY */}

              <group>
                {/* FLOOR 1 */}

                <mesh
                  position={[
                    0,
                    0,
                    0,
                  ]}
                >
                  <boxGeometry
                    args={[
                      12,
                      0.2,
                      12,
                    ]}
                  />

                  <meshStandardMaterial color="#1e293b" />
                </mesh>

                {/* WALLS */}

                {[
                  [0, 2, -6],
                  [0, 2, 6],
                ].map((p, i) => (
                  <mesh
                    key={i}
                    position={p}
                  >
                    <boxGeometry
                      args={[
                        12,
                        4,
                        0.2,
                      ]}
                    />

                    <meshPhysicalMaterial
                      color="#67e8f9"
                      transparent
                      opacity={0.15}
                    />
                  </mesh>
                ))}

                {/* SIDE WALLS */}

                {[
                  [-6, 2, 0],
                  [6, 2, 0],
                ].map((p, i) => (
                  <mesh
                    key={i}
                    position={p}
                  >
                    <boxGeometry
                      args={[
                        0.2,
                        4,
                        12,
                      ]}
                    />

                    <meshPhysicalMaterial
                      color="#67e8f9"
                      transparent
                      opacity={0.15}
                    />
                  </mesh>
                ))}

                {/* HOLE FOR STAIRS */}

                <mesh
                  position={[
                    0,
                    4.5,
                    0,
                  ]}
                >
                  <boxGeometry
                    args={[
                      12,
                      0.2,
                      12,
                    ]}
                  />

                  <meshStandardMaterial color="#0f172a" />
                </mesh>

                {/* CUTOUT */}

                <mesh
                  position={[
                    0,
                    4.6,
                    0,
                  ]}
                >
                  <boxGeometry
                    args={[
                      3,
                      0.25,
                      3,
                    ]}
                  />

                  <meshStandardMaterial color="#020617" />
                </mesh>

                {/* STAIRS */}

                {[0,1,2,3,4,5,6].map(
                  (step) => (
                    <mesh
                      key={step}
                      position={[
                        -2 +
                          step *
                            0.7,
                        0.3 +
                          step *
                            0.65,
                        0,
                      ]}
                    >
                      <boxGeometry
                        args={[
                          1.2,
                          0.25,
                          2,
                        ]}
                      />

                      <meshStandardMaterial color="#475569" />
                    </mesh>
                  )
                )}

                {/* TV */}

                <Appliance
                  appliance={
                    appliances[0]
                  }
                  position={[
                    -3,
                    1.8,
                    0,
                  ]}
                  type="tv"
                />

                {/* COUCH */}

                <mesh
                  position={[
                    2.5,
                    0.6,
                    2,
                  ]}
                >
                  <boxGeometry
                    args={[
                      3,
                      1.2,
                      1.5,
                    ]}
                  />

                  <meshStandardMaterial color="#334155" />
                </mesh>

                {/* SECOND FLOOR */}

                <group
                  position={[
                    0,
                    5.2,
                    0,
                  ]}
                >
                  <Appliance
                    appliance={
                      appliances[1]
                    }
                    position={[
                      -2,
                      1.5,
                      0,
                    ]}
                    type="pc"
                  />

                  <Appliance
                    appliance={
                      appliances[2]
                    }
                    position={[
                      3,
                      1.5,
                      0,
                    ]}
                    type="heater"
                  />

                  {/* BED */}

                  <mesh
                    position={[
                      -4,
                      0.5,
                      2,
                    ]}
                  >
                    <boxGeometry
                      args={[
                        2.5,
                        1,
                        4,
                      ]}
                    />

                    <meshStandardMaterial color="#1e293b" />
                  </mesh>

                  {/* BATH */}

                  <mesh
                    position={[
                      4,
                      0.5,
                      2,
                    ]}
                  >
                    <cylinderGeometry
                      args={[
                        0.8,
                        0.8,
                        0.7,
                        32,
                      ]}
                    />

                    <meshStandardMaterial color="#94a3b8" />
                  </mesh>
                </group>
              </group>

              <OrbitControls />
            </Canvas>
          </div>

          {/* CONTROLS */}

          <div
            style={{
              background: '#111827',
              borderRadius: 30,
              padding: 24,
              overflow: 'auto',
            }}
          >
            <h1>
              Smart Grid
            </h1>

            <div
              style={{
                marginTop: 20,
                background:
                  '#1f2937',
                padding: 20,
                borderRadius: 20,
              }}
            >
              <h2>
                {totalUsage}W
              </h2>

              <p>
                Capacity:{' '}
                {capacity}W
              </p>

              <div
                style={{
                  marginTop: 14,
                  height: 16,
                  background:
                    '#374151',
                  borderRadius: 999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      (totalUsage /
                        capacity) *
                        100,
                      100
                    )}%`,
                    height: '100%',
                    background:
                      totalUsage >
                      capacity
                        ? '#ef4444'
                        : '#22d3ee',
                  }}
                />
              </div>
            </div>

            {/* SLIDER */}

            <input
              type="range"
              min="600"
              max="3500"
              step="50"
              value={capacity}
              onChange={(e) =>
                setCapacity(
                  Number(
                    e.target.value
                  )
                )
              }
              style={{
                width: '100%',
                marginTop: 25,
              }}
            />

            {/* APPLIANCES */}

            <div
              style={{
                marginTop: 30,
              }}
            >
              {appliances.map(
                (app, index) => (
                  <div
                    key={app.name}
                    style={{
                      background:
                        '#1f2937',
                      padding: 18,
                      borderRadius: 18,
                      marginBottom: 18,
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',
                        justifyContent:
                          'space-between',
                      }}
                    >
                      <div>
                        <h3>
                          {
                            app.name
                          }
                        </h3>

                        <p>
                          {
                            app.room
                          }
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setAppliances(
                            (
                              prev
                            ) =>
                              prev.map(
                                (
                                  item,
                                  i
                                ) =>
                                  i ===
                                  index
                                    ? {
                                        ...item,
                                        active:
                                          !item.active,
                                      }
                                    : item
                              )
                          );
                        }}
                        style={{
                          background:
                            app.active
                              ? '#22d3ee'
                              : '#374151',
                          border:
                            'none',
                          borderRadius: 12,
                          padding:
                            '10px 18px',
                          cursor:
                            'pointer',
                        }}
                      >
                        {app.active
                          ? 'ON'
                          : 'OFF'}
                      </button>
                    </div>

                    <h2
                      style={{
                        color:
                          app.color,
                      }}
                    >
                      {app.watt}
                      W
                    </h2>

                    <select
                      value={
                        app.priority
                      }
                      onChange={(
                        e
                      ) => {
                        const value =
                          e
                            .target
                            .value;

                        setAppliances(
                          (
                            prev
                          ) =>
                            prev.map(
                              (
                                item,
                                i
                              ) =>
                                i ===
                                index
                                  ? {
                                      ...item,
                                      priority:
                                        value,
                                    }
                                  : item
                            )
                        );
                      }}
                      style={{
                        width:
                          '100%',
                        marginTop: 12,
                        padding: 10,
                        borderRadius: 12,
                        background:
                          '#0f172a',
                        color:
                          'white',
                      }}
                    >
                      <option value="very important">
                        Very Important
                      </option>

                      <option value="important">
                        Important
                      </option>

                      <option value="not important">
                        Not Important
                      </option>
                    </select>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================
         TOWN PAGE
      ========================= */}

      {tab === 'town' && (
        <div
          style={{
            padding: 30,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 52,
                }}
              >
                AI Power Routing
              </h1>

              <p
                style={{
                  color:
                    disaster
                      ? '#ef4444'
                      : '#22d3ee',
                }}
              >
                {gridStatus}
              </p>
            </div>

            <button
              onClick={() =>
                setDisaster(true)
              }
              style={{
                background:
                  '#ef4444',
                border: 'none',
                color: 'white',
                padding:
                  '16px 24px',
                borderRadius: 18,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Trigger Disaster
            </button>
          </div>

          {/* TOWN */}

          <div
            style={{
              marginTop: 30,
              background:
                '#111827',
              borderRadius: 30,
              padding: 30,
              position: 'relative',
              height: 700,
              overflow: 'hidden',
            }}
          >
            {/* ISLAND */}

            <div
              style={{
                position:
                  'absolute',
                inset: 40,
                background:
                  'radial-gradient(circle at center,#14532d,#052e16)',
                clipPath:
                  'polygon(10% 20%, 30% 10%, 60% 15%, 85% 30%, 90% 60%, 70% 85%, 40% 90%, 15% 75%, 5% 50%)',
              }}
            />

            {/* ROADS */}

            <div
              style={{
                position:
                  'absolute',
                left: '18%',
                top: '45%',
                width: '65%',
                height: 12,
                background:
                  '#475569',
              }}
            />

            <div
              style={{
                position:
                  'absolute',
                left: '48%',
                top: '20%',
                width: 12,
                height: '55%',
                background:
                  '#475569',
              }}
            />

            {/* POWER STATION */}

            <div
              style={{
                position:
                  'absolute',
                left: '12%',
                top: '40%',
                width: 110,
                height: 110,
                borderRadius: 24,
                background:
                  '#0f172a',
                border:
                  '3px solid #22d3ee',
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                fontWeight: 700,
              }}
            >
              ⚡ GRID
            </div>

            {/* HOSPITAL */}

            <div
              style={{
                position:
                  'absolute',
                right: '18%',
                top: '25%',
                width: 120,
                height: 120,
                borderRadius: 24,
                background:
                  disaster
                    ? '#22c55e'
                    : '#1e293b',
                border:
                  '3px solid #22c55e',
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                fontWeight: 700,
              }}
            >
              🏥 HOSPITAL
            </div>

            {/* HOUSES */}

            {[0,1,2,3].map((i) => (
              <div
                key={i}
                style={{
                  position:
                    'absolute',
                  left: `${28 + i * 12}%`,
                  bottom: '18%',
                  width: 90,
                  height: 90,
                  borderRadius: 20,
                  background:
                    disaster
                      ? '#3f3f46'
                      : '#1e293b',
                  border:
                    '2px solid #38bdf8',
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  fontWeight: 700,
                }}
              >
                🏠
              </div>
            ))}

            {/* BROKEN LINE */}

            {disaster && (
              <>
                <div
                  style={{
                    position:
                      'absolute',
                    left: '35%',
                    top: '45%',
                    width: 180,
                    height: 10,
                    background:
                      '#ef4444',
                    transform:
                      'rotate(12deg)',
                  }}
                />

                <div
                  style={{
                    position:
                      'absolute',
                    left: '48%',
                    top: '42%',
                    color:
                      '#ef4444',
                    fontWeight: 700,
                    fontSize: 24,
                  }}
                >
                  LINE FAILURE
                </div>

                {/* REROUTE */}

                <svg
                  width="100%"
                  height="100%"
                  style={{
                    position:
                      'absolute',
                    inset: 0,
                  }}
                >
                  <path
                    d="M150 380 C 400 100, 650 120, 850 170"
                    stroke="#22c55e"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="18 10"
                  />
                </svg>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}