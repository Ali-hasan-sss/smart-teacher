// components/RobotScene.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { AnimatedRobot } from "./animated-robot";

export default function RobotScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Environment preset="sunset" />
        <AnimatedRobot />
      </Canvas>
    </div>
  );
}
