import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import * as random from 'maath/random/dist/maath-random.esm';

function ParticleSphere(props) {
  const ref = useRef();
  const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#00e5ff" size={0.01} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

function SparkLayer() {
  const ref = useRef();
  const sparks = useMemo(() => random.inSphere(new Float32Array(1200), { radius: 2.2 }), []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.15;
    ref.current.rotation.z -= delta * 0.07;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.05;
  });

  return (
    <Points ref={ref} positions={sparks} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#7cecff" size={0.008} sizeAttenuation depthWrite={false} opacity={0.7} />
    </Points>
  );
}

function ScannerRings() {
  const ringA = useRef();
  const ringB = useRef();
  const ringC = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (ringA.current) {
      ringA.current.rotation.x += delta * 0.4;
      ringA.current.rotation.y += delta * 0.25;
      ringA.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.04);
    }
    if (ringB.current) {
      ringB.current.rotation.x -= delta * 0.33;
      ringB.current.rotation.z += delta * 0.28;
      ringB.current.scale.setScalar(1 + Math.cos(t * 0.9) * 0.05);
    }
    if (ringC.current) {
      ringC.current.rotation.y -= delta * 0.22;
      ringC.current.rotation.z -= delta * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={ringA}>
        <torusGeometry args={[0.78, 0.015, 24, 180]} />
        <meshStandardMaterial color="#00e5ff" emissive="#0088aa" emissiveIntensity={1.1} roughness={0.22} metalness={0.75} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.95, 0.014, 24, 180]} />
        <meshStandardMaterial color="#89f2ff" emissive="#1ea8c7" emissiveIntensity={0.85} roughness={0.28} metalness={0.7} />
      </mesh>
      <mesh ref={ringC} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[1.14, 0.01, 16, 120]} />
        <meshBasicMaterial color="#61def7" transparent opacity={0.38} />
      </mesh>
    </group>
  );
}

function EnergyCore() {
  const coreRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!coreRef.current) return;
    coreRef.current.rotation.y += delta * 0.45;
    coreRef.current.rotation.z += delta * 0.15;
    const pulse = 1 + Math.sin(t * 3.2) * 0.08;
    coreRef.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={coreRef}>
      <icosahedronGeometry args={[0.33, 2]} />
      <meshStandardMaterial color="#9ef3ff" emissive="#06d8ff" emissiveIntensity={1.8} roughness={0.12} metalness={0.35} />
    </mesh>
  );
}

function SceneGroup() {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) return;
    const x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.2, 0.04);
    const y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.3, 0.04);
    groupRef.current.rotation.x = x;
    groupRef.current.rotation.y = y;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.7}>
        <EnergyCore />
      </Float>
      <ScannerRings />
      <ParticleSphere />
      <SparkLayer />
    </group>
  );
}

function PulseLight() {
  const lightRef = useRef();

  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.intensity = 1.1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.25;
  });

  return <pointLight ref={lightRef} position={[0, 0.6, 1.4]} color="#58e9ff" distance={4.5} />;
}

export default function ThreatScanner3D() {
  return (
    <div className="w-full h-full min-h-[400px] relative rounded-lg border border-white/10 overflow-hidden bg-gradient-to-br from-white/5 to-transparent flex flex-col items-center justify-center pt-8 shadow-[0_0_30px_rgba(0,180,255,0.1)]">
      <div className="absolute top-4 left-4 text-[10px] tracking-widest text-white/50">
        LATENCY: 12MS
      </div>
      
      <div className="flex-1 w-full relative">
        <Canvas camera={{ position: [0, 0.1, 3.15], fov: 50 }} dpr={[1, 1.8]}>
          <color attach="background" args={["#04070d"]} />
          <fog attach="fog" args={["#04070d", 2.8, 6.6]} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[2, 2, 1.5]} intensity={0.75} color="#84ecff" />
          <PulseLight />
          <SceneGroup />
        </Canvas>
        
        {/* Overlay targeting elements */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full border border-accent/30 flex items-center justify-center mb-4 relative">
             <div className="w-12 h-12 rounded-full border border-accent/60 flex items-center justify-center">
               <div className="w-4 h-4 rounded-full bg-accent animate-ping absolute"></div>
               <div className="w-4 h-4 rounded-full bg-accent shadow-[0_0_15px_#00e5ff]"></div>
             </div>
          </div>
          <h3 className="text-xl font-black tracking-[0.2em] text-white">THREAT_SCANNER</h3>
          <p className="text-[10px] text-accent mt-2 tracking-widest uppercase">Version 4.2.0-STABLE</p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] tracking-widest text-white/50 uppercase flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
        Nodes: 1,304 Active
      </div>
    </div>
  );
}
