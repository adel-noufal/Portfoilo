import { Component, useEffect, useMemo, useRef, useState, type MutableRefObject, type PointerEvent, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

const agents = [
  ['perception', 'emotion analysis'],
  ['measurement', 'engagement scoring'],
  ['pedagogy', 'recommendations'],
  ['core', 'orchestration layer'],
  ['generation', 'lesson / quiz / cards'],
  ['retrieval', 'cited curriculum context'],
  ['reporting', 'PDF intelligence'],
] as const;

const agentPositions: [number, number, number][] = [
  [-2.55, 0.1, 0.1],
  [-1.72, 0.8, -0.35],
  [-0.91, -0.35, 0.5],
  [0, 0.62, 0],
  [0.91, -0.35, -0.5],
  [1.72, 0.8, 0.35],
  [2.55, 0.1, -0.1],
];

const connections: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  [0, 3], [1, 4], [2, 5], [3, 6],
];

function makeLinePositions(
  positions: [number, number, number][],
  edges: [number, number][],
) {
  const coordinates: number[] = [];
  for (const [from, to] of edges) {
    coordinates.push(...positions[from], ...positions[to]);
  }
  return new Float32Array(coordinates);
}

function AgentNode({
  index,
  selected,
  lowDetail,
  onSelect,
}: {
  index: number;
  selected: boolean;
  lowDetail: boolean;
  onSelect: (index: number) => void;
}) {
  const core = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const color = index === 3 ? '#f9b36b' : '#66f7df';

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.1 + index * 0.7) * 0.055;
    if (core.current) core.current.scale.setScalar(pulse * (selected ? 1.18 : 1));
    if (glow.current) glow.current.scale.setScalar((selected ? 2.5 : 2.15) * pulse);
  });

  return (
    <group position={agentPositions[index]}>
      <mesh ref={glow} scale={2.15}>
        <sphereGeometry args={[0.12, lowDetail ? 8 : 14, lowDetail ? 8 : 14]} />
        <meshBasicMaterial color={color} transparent opacity={selected ? 0.16 : 0.09} depthWrite={false} />
      </mesh>
      <mesh
        ref={core}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(index);
        }}
        onPointerOver={() => onSelect(index)}
      >
        <sphereGeometry args={[index === 3 ? 0.12 : 0.085, lowDetail ? 8 : 14, lowDetail ? 8 : 14]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 2.2 : 1.1}
          roughness={0.28}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function GraphScene({
  pointer,
  selected,
  lowDetail,
  reducedMotion,
  onSelect,
}: {
  pointer: MutableRefObject<{ x: number; y: number }>;
  selected: number;
  lowDetail: boolean;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
}) {
  const graph = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const ambientPositions = useMemo(() => {
    const count = lowDetail ? 10 : 22;
    const points: number[] = [];
    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963;
      const radius = 1.1 + (index % 5) * 0.31;
      points.push(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.37) * (0.55 + (index % 3) * 0.18),
        Math.sin(angle) * (0.4 + (index % 4) * 0.22),
      );
    }
    return new Float32Array(points);
  }, [lowDetail]);
  const linePositions = useMemo(() => makeLinePositions(agentPositions, connections), []);
  const path = useMemo(
    () => new THREE.CatmullRomCurve3(agentPositions.map((point) => new THREE.Vector3(...point))),
    [],
  );

  useFrame((state, delta) => {
    if (reducedMotion || !graph.current) return;
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scroll = totalScroll > 0 ? window.scrollY / totalScroll : 0;
    const targetX = -pointer.current.y * 0.18 + (scroll - 0.5) * 0.12;
    const targetY = pointer.current.x * 0.24 + (scroll - 0.5) * 0.2;
    graph.current.rotation.x = THREE.MathUtils.damp(graph.current.rotation.x, targetX, 3.2, delta);
    graph.current.rotation.y = THREE.MathUtils.damp(graph.current.rotation.y, targetY, 3.2, delta);
    graph.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.045;
    if (pulse.current) {
      const position = path.getPointAt((state.clock.elapsedTime * 0.16) % 1);
      pulse.current.position.copy(position);
    }
  });

  return (
    <>
      <ambientLight intensity={0.72} />
      <pointLight position={[0, 2.4, 4]} color="#66f7df" intensity={9} distance={10} />
      <pointLight position={[-3, -1.5, -2]} color="#f9b36b" intensity={4} distance={7} />
      <group ref={graph}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#66f7df" transparent opacity={0.24} />
        </lineSegments>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ambientPositions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#90ffe9"
            size={lowDetail ? 0.055 : 0.04}
            transparent
            opacity={0.64}
            sizeAttenuation
            depthWrite={false}
          />
        </points>
        {agents.map((_, index) => (
          <AgentNode
            key={index}
            index={index}
            selected={selected === index}
            lowDetail={lowDetail}
            onSelect={onSelect}
          />
        ))}
        <mesh ref={pulse}>
          <sphereGeometry args={[0.045, lowDetail ? 6 : 10, lowDetail ? 6 : 10]} />
          <meshBasicMaterial color="#f9b36b" toneMapped={false} />
        </mesh>
      </group>
    </>
  );
}

function StaticGraphFallback() {
  const positions: [number, number][] = [
    [64, 124], [154, 64], [238, 150], [326, 82], [414, 158], [510, 62], [606, 126],
  ];
  return (
    <div className="pointer-events-none absolute inset-0 px-4 pb-14 pt-10">
      <svg viewBox="0 0 670 220" className="h-full w-full" role="img" aria-label="Static diagram of seven connected agents">
        <g fill="none" stroke="#607299" strokeWidth="1" opacity=".62">
          {connections.map(([from, to]) => (
            <line key={`${from}-${to}`} x1={positions[from][0]} y1={positions[from][1]} x2={positions[to][0]} y2={positions[to][1]} />
          ))}
          <ellipse cx="335" cy="112" rx="300" ry="90" strokeDasharray="2 11" />
        </g>
        <g>
          {positions.map(([x, y], index) => (
            <g key={index}>
              <circle cx={x} cy={y} r={index === 3 ? 18 : 13} fill={index === 3 ? '#f9b36b' : '#66f7df'} opacity=".12" />
              <circle cx={x} cy={y} r={index === 3 ? 6 : 4.5} fill={index === 3 ? '#f9b36b' : '#66f7df'} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

class GraphErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <StaticGraphFallback /> : this.props.children;
  }
}

export default function NeuralGraph3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(false);
  const [lowDetail, setLowDetail] = useState(false);
  const [selected, setSelected] = useState(3);
  const [webglAvailable, setWebglAvailable] = useState(false);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    try {
      const probe = document.createElement('canvas');
      const context = probe.getContext('webgl2') ?? probe.getContext('webgl');
      setWebglAvailable(Boolean(context));
      context?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      setWebglAvailable(false);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setLowDetail(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    };
  };

  return (
    <div
      ref={containerRef}
      className="glass-panel relative h-[330px] w-full max-w-[700px] overflow-hidden rounded-[2rem] md:h-[420px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }}
      role="group"
      aria-label="Interactive 3D graph of seven EduSense agents"
      data-testid="interactive-neural-field"
    >
      <div className="lab-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8090af]">
        <span className="h-2 w-2 rounded-full bg-[#66f7df] shadow-[0_0_16px_#66f7df]" />
        {webglAvailable ? 'pointer-responsive topology' : 'static topology / reduced graphics mode'}
      </div>
      {webglAvailable ? (
        <GraphErrorBoundary>
          <Canvas
            className="!absolute inset-0"
            camera={{ position: [0, 0, 7.6], fov: 39 }}
            dpr={lowDetail ? 1 : [1, 1.5]}
            frameloop={inView && !reducedMotion ? 'always' : 'demand'}
            gl={{ alpha: true, antialias: !lowDetail, powerPreference: 'low-power', stencil: false }}
            fallback={<StaticGraphFallback />}
          >
            <GraphScene
              pointer={pointer}
              selected={selected}
              lowDetail={lowDetail}
              reducedMotion={reducedMotion}
              onSelect={setSelected}
            />
          </Canvas>
        </GraphErrorBoundary>
      ) : <StaticGraphFallback />}
      <div className="absolute bottom-5 left-5 right-5 z-10">
        <div className="mb-3 flex flex-wrap justify-center gap-1.5">
          {agents.map(([name], index) => (
            <button
              key={name}
              type="button"
              onClick={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              aria-pressed={selected === index}
              className={`rounded-full border px-2 py-1 font-mono text-[8px] uppercase tracking-[.08em] transition-colors ${
                selected === index
                  ? 'border-[#66f7df]/60 bg-[#66f7df]/10 text-[#66f7df]'
                  : 'border-[#33405b] bg-[#101321]/70 text-[#8490aa] hover:text-[#d5e0ee]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[.12em] text-[#68718b]">
          <span>hover / select agents</span>
          <span className="text-right">
            <span className="mr-2 text-[#66f7df]">{agents[selected][0]}</span>
            <span className="hidden text-[#f9b36b] sm:inline">{agents[selected][1]}</span>
          </span>
        </div>
      </div>
    </div>
  );
}