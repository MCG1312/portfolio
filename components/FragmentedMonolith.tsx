import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const MonolithShard = ({ position, scale, rotation, hovered }: any) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (!mesh.current) return;
    
    // Smoothly interpolate to target position
    // If hovered, expand outwards (explode effect)
    const expansionDir = new THREE.Vector3(...position).normalize();
    const targetPos = hovered 
      ? new THREE.Vector3(...position).add(expansionDir.multiplyScalar(0.5)) 
      : new THREE.Vector3(...position);
      
    mesh.current.position.lerp(targetPos, 0.1);
  });

  return (
    <Box args={scale} position={position} rotation={rotation} ref={mesh}>
      <MeshTransmissionMaterial 
        backside
        backsideThickness={1}
        thickness={2}
        chromaticAberration={0.1}
        anisotropicBlur={0.1}
        ior={1.5}
        color="#111"
        roughness={0.2}
        metalness={0.5}
        background={new THREE.Color("#020202")}
      />
      {/* Inner Wireframe for Tech Look */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...scale)]} />
        <lineBasicMaterial color="#333" linewidth={1} opacity={0.2} transparent />
      </lineSegments>
    </Box>
  );
};

export const FragmentedMonolith: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.005;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  // A collection of blocks forming a rough rectangle
  const shards = [
    { pos: [0, 0, 0], scale: [1, 3.5, 0.8], rot: [0, 0, 0] }, // Core
    { pos: [0.6, -0.5, 0.2], scale: [0.4, 2, 0.5], rot: [0.1, 0, -0.1] },
    { pos: [-0.6, 0.5, -0.2], scale: [0.3, 2.5, 0.4], rot: [-0.1, 0, 0.1] },
    { pos: [0, 1.8, 0], scale: [0.9, 0.5, 0.7], rot: [0, 0.2, 0] }, // Top cap
    { pos: [0.3, 0, 0.6], scale: [0.2, 1.5, 0.2], rot: [0, 0, 0.2] }, // Front detail
    { pos: [-0.4, -1, -0.5], scale: [0.5, 1, 0.3], rot: [0.2, 0, 0] }, // Back detail
  ];

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group 
        ref={group} 
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
      >
        {shards.map((s, i) => (
          <MonolithShard 
            key={i} 
            position={s.pos} 
            scale={s.scale} 
            rotation={s.rot} 
            hovered={hovered} 
          />
        ))}
        
        {/* The "Security Core" Light */}
        <pointLight position={[0, 0, 0]} intensity={hovered ? 2 : 0.5} color="white" distance={5} decay={2} />
        <mesh position={[0,0,0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color="white" />
        </mesh>
      </group>
    </Float>
  );
};