import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function RobotModel({
  mouse,
}: {
  mouse: { x: number; y: number };
}) {
  const group = useRef<THREE.Group>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF("/models/robot.glb");

  useFrame((state) => {
    if (!group.current) return;

    const targetRotX = mouse.y * 0;
    const targetRotY = mouse.x * 0.3;

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotX,
      0.1
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotY,
      0.1
    );

    group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;

    const maxOffset = 0.05;
    if (leftPupilRef.current && rightPupilRef.current) {
      leftPupilRef.current.position.x = THREE.MathUtils.lerp(
        leftPupilRef.current.position.x,
        mouse.x * maxOffset,
        0.2
      );
      leftPupilRef.current.position.y = THREE.MathUtils.lerp(
        leftPupilRef.current.position.y,
        mouse.y * maxOffset,
        0.2
      );
      rightPupilRef.current.position.x = THREE.MathUtils.lerp(
        rightPupilRef.current.position.x,
        mouse.x * maxOffset,
        0.2
      );
      rightPupilRef.current.position.y = THREE.MathUtils.lerp(
        rightPupilRef.current.position.y,
        mouse.y * maxOffset,
        0.2
      );
    }
  });

  return (
    <group ref={group}>
      {/* الروبوت الأساسي */}
      <primitive object={scene} position={[0, -1, 0]} scale={0.9} />

      {/* العين اليسرى */}
      <group position={[-0.15, 1.0, 0.6]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh ref={leftPupilRef} position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>

      {/* العين اليمنى */}
      <group position={[0.15, 1.0, 0.6]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh ref={rightPupilRef} position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>
    </group>
  );
}
