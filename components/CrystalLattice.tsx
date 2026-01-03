import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges, Float, MeshTransmissionMaterial, Octahedron, Dodecahedron, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

const DarkGlass = () => (
  <MeshTransmissionMaterial
    backside
    backsideThickness={5}
    thickness={2}
    chromaticAberration={0.02} // Reduced for sharpness
    anisotropicBlur={0} // Zero blur
    distortion={0.1}
    temporalDistortion={0}
    ior={1.2}
    color="#000"
    background={new THREE.Color("#000")}
    opacity={0.8}
  />
);

export const CrystalLattice: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const layer1Ref = useRef<THREE.Mesh>(null);
  const layer2Ref = useRef<THREE.Mesh>(null);
  const layer3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // High speed rotation as requested
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.2;
    }
    if (layer1Ref.current) {
      layer1Ref.current.rotation.x = t * 0.3;
      layer1Ref.current.rotation.z = t * 0.1;
    }
    if (layer2Ref.current) {
      layer2Ref.current.rotation.y = t * -0.5;
      layer2Ref.current.rotation.x = t * 0.4;
    }
    if (layer3Ref.current) {
      layer3Ref.current.rotation.x = t * 1.0;
      layer3Ref.current.rotation.y = t * 1.0;
    }
  });

  return (
    <Float floatIntensity={1} rotationIntensity={0} speed={5} floatingRange={[-0.1, 0.1]}>
      <group ref={groupRef}>
        {/* Layer 1: Outer Fractal Shell */}
        <Dodecahedron args={[2.5, 0]} ref={layer1Ref}>
          <DarkGlass />
          <Edges scale={1} threshold={1} color="white" linewidth={1} />
        </Dodecahedron>

        {/* Layer 2: Counter-rotating Geometry */}
        <Icosahedron args={[1.8, 0]} ref={layer2Ref}>
           <meshBasicMaterial color="#000" transparent opacity={0.1} wireframe={false} />
           <Edges scale={1.0} threshold={1} color="white" linewidth={0.5} />
        </Icosahedron>

        {/* Layer 3: High-speed Core */}
        <Octahedron args={[1.0, 0]} ref={layer3Ref}>
          <meshBasicMaterial color="#000" wireframe />
          <Edges scale={1} threshold={1} color="white" />
          {/* Fractal Core */}
          <Octahedron args={[0.5, 0]}>
             <meshBasicMaterial color="#fff" wireframe />
          </Octahedron>
        </Octahedron>

        {/* Orbital Surveillance Rings */}
        <group rotation={[Math.PI / 3, 0, 0]}>
            <lineLoop>
                <ringGeometry args={[3.2, 3.205, 128]} />
                <meshBasicMaterial color="#666" side={THREE.DoubleSide} />
            </lineLoop>
        </group>
        <group rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
            <lineLoop>
                <ringGeometry args={[3.0, 3.005, 128]} />
                <meshBasicMaterial color="#666" side={THREE.DoubleSide} />
            </lineLoop>
        </group>
      </group>
    </Float>
  );
};