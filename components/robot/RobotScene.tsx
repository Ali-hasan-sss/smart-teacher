// components/RobotScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AnimatedRobot } from "./animated-robot";

export default function RobotScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 5, 5]} intensity={2.0} />
        <directionalLight position={[-5, 5, 5]} intensity={1.2} />
        <directionalLight position={[0, 10, 0]} intensity={1.0} />
        <pointLight position={[0, 3, 3]} intensity={1.0} color="#ffffff" />
        <pointLight position={[3, 0, 3]} intensity={0.8} color="#ffffff" />
        <AnimatedRobot />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
