import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function FilmReelProp({ position, scale = 1 }) {
  const meshRef = useRef();
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[1.5, 1.5, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Outer Rim Highlight */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.52, 0.05, 16, 32]} />
        <meshBasicMaterial color="#dc2626" />
      </mesh>
    </group>
  );
}

function CameraLensProp({ position, scale = 1 }) {
  const lensRef = useRef();
  useFrame((_, delta) => {
    if (lensRef.current) {
      lensRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={position} scale={scale} ref={lensRef}>
      {/* Outer Lens Barrel */}
      <mesh>
        <cylinderGeometry args={[1.2, 1.0, 1.8, 32]} />
        <meshStandardMaterial color="#0c0c10" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Glass Optic Element */}
      <mesh position={[0, 0.91, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 32]} />
        <meshPhysicalMaterial color="#ff2a35" transmission={0.9} roughness={0.1} ior={1.5} />
      </mesh>
    </group>
  );
}

function SpotlightProp({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh rotation={[0.4, 0.5, 0]}>
        <coneGeometry args={[1.2, 2.2, 32]} />
        <meshStandardMaterial color="#14141c" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function FilmObjectsCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-4, -3, 2]} intensity={30} color="#ff1e27" />

        <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
          <FilmReelProp position={[-3.5, 1.5, 0]} scale={0.9} />
        </Float>

        <Float speed={1.8} rotationIntensity={1.2} floatIntensity={2}>
          <CameraLensProp position={[3.8, -1.2, 1]} scale={1.1} />
        </Float>

        <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1}>
          <SpotlightProp position={[-2.8, -2.2, -1]} scale={0.8} />
        </Float>
      </Canvas>
    </div>
  );
}
