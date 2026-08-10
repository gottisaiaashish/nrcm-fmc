import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Center } from '@react-three/drei';
import * as THREE from 'three';

function LetterBlock({ position, scrollProgress, index, isDot = false }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const p = scrollProgress.current || 0;

    meshRef.current.position.z = position[2] + p * 12 + Math.sin(time + index) * 0.08;
    meshRef.current.position.x = position[0] * (1 + p * 0.8);
    meshRef.current.rotation.y = p * 0.4 + Math.cos(time * 0.4 + index) * 0.04;
    meshRef.current.rotation.x = Math.sin(time * 0.3 + index) * 0.04 + p * 0.15;
  });

  const width = isDot ? 0.45 : 1.0;
  const height = isDot ? 0.45 : 1.55;

  return (
    <group ref={meshRef} position={position}>
      {/* 3D Physical Charcoal Block */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.45]} />
        <meshStandardMaterial
          color="#08080a"
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>

    </group>
  );
}

export default function Text3DEnvironment({ scrollProgress }) {
  const groupRef = useRef();
  const redSpotlightRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const p = scrollProgress.current || 0;

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.03 + p * 0.25;
      groupRef.current.position.z = -p * 14;
    }

    if (redSpotlightRef.current) {
      redSpotlightRef.current.position.x = Math.sin(t * 0.7) * 9;
      redSpotlightRef.current.position.y = Math.cos(t * 0.4) * 4 + 2;
    }
  });

  // 8 Characters: N, R, C, M, ., F, M, C
  const letterSpecs = [
    { char: 'N', x: -4.1, isDot: false },
    { char: 'R', x: -2.9, isDot: false },
    { char: 'C', x: -1.7, isDot: false },
    { char: 'M', x: -0.5, isDot: false },
    { char: '.', x: 0.35, isDot: true },
    { char: 'F', x: 1.2, isDot: false },
    { char: 'M', x: 2.4, isDot: false },
    { char: 'C', x: 3.6, isDot: false },
  ];

  return (
    <>
      {/* Ambient Dark Lighting */}
      <ambientLight intensity={0.12} />

      {/* Volumetric Red Spotlight Sweeping across Title */}
      <spotLight
        ref={redSpotlightRef}
        position={[0, 6, 8]}
        angle={0.65}
        penumbra={0.95}
        intensity={160}
        color="#ff1e27"
        castShadow
      />

      {/* Key Lights */}
      <directionalLight position={[-6, 5, 6]} intensity={1.2} color="#ffffff" />
      <pointLight position={[0, -4, 3]} intensity={45} color="#e50914" distance={16} />

      {/* Spark Particles */}
      <Sparkles count={180} scale={18} size={2.2} speed={0.35} color="#ff2a35" opacity={0.6} />

      {/* Centered Physical 3D Title Structure */}
      <group ref={groupRef} position={[0.1, 0, 0]}>
        <Center>
          <group>
            {letterSpecs.map((item, idx) => (
              <LetterBlock
                key={idx}
                index={idx}
                isDot={item.isDot}
                position={[item.x, item.isDot ? -0.55 : 0, 0]}
                scrollProgress={scrollProgress}
              />
            ))}
          </group>
        </Center>
      </group>
    </>
  );
}
