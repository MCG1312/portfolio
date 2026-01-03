import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath'; // maath is often bundled with Drei utils, but if not, we use simple random

export const CyberSphere: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  // Generate points
  const [sphere] = useState(() => {
    const data = new Float32Array(5000 * 3);
    // Simple spherical distribution
    for(let i=0; i<5000; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = 2.5 + Math.random() * 0.2; // Radius with noise
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        data[i*3] = x;
        data[i*3+1] = y;
        data[i*3+2] = z;
    }
    return data;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
      
      // Pulse effect
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      const hoverScale = hovered ? 1.2 : 1.0;
      const targetScale = pulse * hoverScale;
      
      ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    if (sphereRef.current) {
        sphereRef.current.rotation.copy(ref.current!.rotation);
        sphereRef.current.scale.copy(ref.current!.scale);
    }
  });

  return (
    <group 
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
    >
      {/* The Point Cloud */}
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
      
      {/* Inner Wireframe for structure */}
      <Icosahedron args={[2.4, 2]} ref={sphereRef}>
        <meshBasicMaterial wireframe color="#333333" transparent opacity={0.3} />
      </Icosahedron>
      
      {/* Core RED warning glow if hovered */}
      {hovered && (
         <mesh>
             <sphereGeometry args={[2, 32, 32]} />
             <meshBasicMaterial color="#FF0000" transparent opacity={0.05} />
         </mesh>
      )}
    </group>
  );
};