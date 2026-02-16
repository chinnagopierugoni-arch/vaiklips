"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Stars, Torus } from "@react-three/drei";
import { useRef } from "react";

function RotatingTorus({ position, color, speed, args }) {
 const ref = useRef();

 useFrame((state, delta) => {
  ref.current.rotation.x += delta * speed;
  ref.current.rotation.y += delta * speed * 0.5;
 });

 return (
  <mesh ref={ref} position={position}>
   <torusGeometry args={args} />
   <meshStandardMaterial
    color={color}
    emissive={color}
    emissiveIntensity={0.5}
    toneMapped={false}
    transparent
    opacity={0.8}
    wireframe
   />
  </mesh>
 );
}

function Particles() {
 return (
  <Stars
   radius={100}
   depth={50}
   count={5000}
   factor={4}
   saturation={0}
   fade
   speed={1}
  />
 )
}

function AICore() {
 return (
  <Float speed={2} rotationIntensity={1} floatIntensity={1}>
   {/* Central Core */}
   <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
    <MeshDistortMaterial
     color="#8a2be2"
     attach="material"
     distort={0.6}
     speed={2}
     roughness={0.1}
     metalness={0.9} // Metallic look
    />
   </Sphere>

   {/* Holographic Rings */}
   <RotatingTorus args={[2.5, 0.02, 16, 100]} color="#00ffff" speed={0.5} />
   <RotatingTorus args={[3.2, 0.02, 16, 100]} color="#b026ff" speed={0.3} />
   <RotatingTorus args={[4, 0.01, 16, 100]} color="#ffffff" speed={0.1} />
  </Float>
 )
}

export default function HeroScene({ showCore = true }) {
 return (
  <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none">
   <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
    <pointLight position={[-10, -10, -10]} intensity={1} color="#8a2be2" />

    <Particles />
    {showCore && <AICore />}

    {/* Fog for depth */}
    <fog attach="fog" args={["#050510", 5, 20]} />
   </Canvas>
  </div>
 )
}
