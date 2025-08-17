"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface TeachingRobotProps {
  loading?: boolean;
}

const TeachingRobot: React.FC<TeachingRobotProps> = ({ loading = false }) => {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/robot.glb");
  const [loding, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    // 🌬️ تنفس خفيف للجسم كله
    group.current.position.y = Math.sin(t * 1.2) * 0.02;

    // عظام أساسية
    const spine = scene.getObjectByName("spine_03");
    const neck = scene.getObjectByName("neck_01");
    const head = scene.getObjectByName("head");

    const upperArmL = scene.getObjectByName("upperarm_l");
    const lowerArmL = scene.getObjectByName("lowerarm_l");
    const handL = scene.getObjectByName("hand_l");

    const upperArmR = scene.getObjectByName("upperarm_r");
    const lowerArmR = scene.getObjectByName("lowerarm_r");
    const handR = scene.getObjectByName("hand_r");

    // حركة الرأس والجذع
    if (spine) spine.rotation.x = Math.sin(t * 0.6) * 0.03;
    if (neck) neck.rotation.y = Math.sin(t * 0.4) * 0.05;
    if (head) head.rotation.y = Math.sin(t * 0.5) * 0.05;

    // حركة الذراعين خفيفة وطبيعية
    if (upperArmL) upperArmL.rotation.x = Math.sin(t * 1.2) * 0.15;
    if (lowerArmL) lowerArmL.rotation.x = Math.sin(t * 1.5) * 0.1;
    if (handL) handL.rotation.z = Math.sin(t * 1.8) * 0.08;

    if (lowerArmR) lowerArmR.rotation.x = Math.cos(t * 1.4) * 0.1;
    if (handR) handR.rotation.z = Math.cos(t * 1.6) * 0.08;

    // دوران الجسم للنظر حوله بشكل لطيف
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      Math.sin(t * 0.2) * 0.1,
      0.03
    );
  });

  return (
    <group ref={group}>
      <primitive object={scene} position={[0, -1, 0]} scale={0.9} />

      {/* 👀 العين اليسرى */}
      <group position={[-0.15, 1.0, 0.6]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>

      {/* 👀 العين اليمنى */}
      <group position={[0.15, 1.0, 0.6]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>
    </group>
  );
};

export default TeachingRobot;
