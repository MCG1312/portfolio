import React, { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

// Custom Shader for "Digital Rain" / Data Stream effect on faces
const DigitalRainShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#10b981") }, // Emerald Green
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uColor;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
        // Create a grid for "data packets"
        vec2 grid = vec2(40.0, 40.0);
        vec2 st = vUv * grid;
        vec2 ipos = floor(st);
        
        // Random falling speed for each column
        float speed = random(vec2(ipos.x, 0.0)) * 5.0 + 2.0;
        
        // Calculate vertical movement
        float y = mod(st.y + uTime * speed, grid.y);
        
        // Generate random active cells (data bits)
        float bit = step(0.8, random(vec2(ipos.x, floor(st.y + uTime * speed))));
        
        // Fading trail effect
        float alpha = bit * smoothstep(0.0, 1.0, random(ipos));

        // Scanline interrupt
        float scanline = sin(vUv.y * 100.0 + uTime * 10.0) * 0.1;

        vec3 finalColor = uColor + scanline;
        gl_FragColor = vec4(finalColor, alpha * 0.8);
    }
  `
};

export const HeroArtifact: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Initialize shader material
  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#10b981") }
    },
    vertexShader: DigitalRainShader.vertexShader,
    fragmentShader: DigitalRainShader.fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  useFrame((state) => {
    const { mouse, clock } = state;
    const t = clock.getElapsedTime();

    // 1. DAMPED MOUSE FOLLOW (Mechanical/Fluid Feel)
    if (meshRef.current) {
        // Target rotation based on mouse
        const targetX = (mouse.y * Math.PI) / 6;
        const targetY = (mouse.x * Math.PI) / 6;
        
        // Smooth interpolation (Damping factor 0.1)
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetY + t * 0.1, 0.1);
    }

    // 2. WIREFRAME PULSE (Based on mouse proximity effectively via time for now)
    if (wireframeRef.current) {
        wireframeRef.current.rotation.copy(meshRef.current!.rotation);
        // Counter-pulse scale
        const pulse = 1.1 + Math.sin(t * 2) * 0.02;
        wireframeRef.current.scale.set(pulse, pulse, pulse);
    }

    // 3. UPDATE SHADER UNIFORMS
    if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = t;
    }
  });

  return (
    <group>
      {/* Primary Data Core */}
      <Icosahedron args={[2.0, 4]} ref={meshRef}>
        <primitive object={shaderMaterial} ref={materialRef} attach="material" />
      </Icosahedron>

      {/* Wireframe Exoskeleton */}
      <Icosahedron args={[2.0, 1]} ref={wireframeRef}>
        <meshBasicMaterial 
            color="#10b981" 
            wireframe 
            wireframeLinewidth={1} 
            transparent 
            opacity={0.3} 
        />
      </Icosahedron>

      {/* Inner Blackout Core (to block see-through) */}
      <Icosahedron args={[1.9, 1]}>
         <meshBasicMaterial color="#000000" />
      </Icosahedron>
    </group>
  );
};