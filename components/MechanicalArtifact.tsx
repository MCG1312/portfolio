import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, PointMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const Ring = ({ radius, speed, rotationOffset, color = "white" }: any) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) + rotationOffset[0];
      ref.current.rotation.y = state.clock.elapsedTime * speed + rotationOffset[1];
    }
  });

  return (
    <group ref={ref}>
      {/* Wireframe Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Glowing Vertices on the ring path - Using native points for stability */}
      <points>
         <PointMaterial transparent vertexColors={false} color={color} size={0.15} sizeAttenuation={true} depthWrite={false} />
         <primitive object={new THREE.BufferGeometry().setFromPoints(
            new Array(8).fill(0).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            })
         )} attach="geometry" />
      </points>
    </group>
  );
};

export const MechanicalArtifact: React.FC = () => {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      // Pulse scale
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group>
          {/* Central Secure Core */}
          <mesh ref={coreRef}>
            <octahedronGeometry args={[1.5, 0]} />
            <MeshTransmissionMaterial 
              backside
              backsideThickness={5}
              thickness={2}
              chromaticAberration={0.05}
              anisotropicBlur={0.1}
              ior={1.5}
              color="#000"
              background={new THREE.Color("#000")}
              roughness={0.2}
              distortion={0.5}
            />
          </mesh>
          
          {/* Inner Light Pulse */}
          <pointLight position={[0,0,0]} intensity={1.5} color="white" distance={5} />

          {/* Rotating Rings */}
          <Ring radius={2.2} speed={0.4} rotationOffset={[0, 0]} />
          <Ring radius={2.8} speed={-0.3} rotationOffset={[Math.PI / 4, 0]} />
          <Ring radius={3.5} speed={0.2} rotationOffset={[Math.PI / 2, Math.PI / 4]} />
        </group>
      </Float>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.5} />
      </EffectComposer>
    </>
  );
};