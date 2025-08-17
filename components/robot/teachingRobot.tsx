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
  // 👋 مراجع اليدين (تأكد من أسماء bones داخل glb)
  const leftHand = scene.getObjectByName("hand_l") as THREE.Object3D | null;
  const rightHand = scene.getObjectByName("hand_r") as THREE.Object3D | null;
  useEffect(() => {
    setLoading(loading);
    console.log("load:", loading);
  }, [loading]);
  useEffect(() => {
    const boneNames: string[] = [];

    const printBoneTree = (obj: THREE.Object3D, depth: number = 0) => {
      if (obj.type === "Bone" || obj.type === "Armature") {
        const indent = "  ".repeat(depth);
        console.log(`${indent}🦴 ${obj.name} (${obj.type})`);
        boneNames.push(obj.name);
      }
      obj.children.forEach((child) => printBoneTree(child, depth + 1));
    };

    printBoneTree(scene, 0);

    console.log("✅ All bone names array:", boneNames);
  }, [scene]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    // حركة تنفس خفيفة للجسم كله
    group.current.position.y = Math.sin(t * 1.5) * 0.03;

    // الجذع والرقبة
    const spine = scene.getObjectByName("spine_03");
    const neck = scene.getObjectByName("neck_01");
    const head = scene.getObjectByName("head");

    if (loding) {
      // 🤔 وضع التفكير
      if (spine) spine.rotation.x = Math.sin(t * 0.5) * 0.05;
      if (neck) neck.rotation.y = Math.sin(t * 0.3) * 0.08;
      if (head) head.rotation.y = Math.sin(t * 0.4) * 0.1;

      // الذراع اليمنى تتحرك للأمام والخلف بشكل خفيف مع اليد
      const upperArmR = scene.getObjectByName("upperarm_r");
      const lowerArmR = scene.getObjectByName("lowerarm_r");
      const handR = scene.getObjectByName("hand_r");
      if (upperArmR) upperArmR.rotation.x = Math.sin(t * 0.8) * 0.3 - 0.2;
      if (lowerArmR) lowerArmR.rotation.x = Math.sin(t * 0.9) * 0.2 - 0.1;
      if (handR) handR.rotation.z = Math.sin(t * 1.2) * 0.15;

      // حركة الرأس للجسم للنظر للجانب
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        Math.sin(t * 0.3) * 0.15,
        0.05
      );
    } else {
      // 👨‍🏫 وضع الشرح بعد التفكير
      if (spine) spine.rotation.x = Math.sin(t * 0.8) * 0.05;
      if (neck) neck.rotation.y = Math.sin(t * 0.5) * 0.1;
      if (head) head.rotation.y = Math.sin(t * 0.6) * 0.08;

      // الذراع اليسرى (شرح)
      const upperArmL = scene.getObjectByName("upperarm_l");
      const lowerArmL = scene.getObjectByName("lowerarm_l");
      const handL = scene.getObjectByName("hand_l");
      if (upperArmL) upperArmL.rotation.x = Math.sin(t * 1.2) * 0.4 + 0.2;
      if (lowerArmL) lowerArmL.rotation.x = Math.cos(t * 1.5) * 0.25;
      if (handL) handL.rotation.z = Math.sin(t * 2) * 0.2;

      // الذراع اليمنى (شرح)
      const upperArmR = scene.getObjectByName("upperarm_r");
      const lowerArmR = scene.getObjectByName("lowerarm_r");
      const handR = scene.getObjectByName("hand_r");
      if (upperArmR) upperArmR.rotation.x = Math.sin(t * 1.0) * 0.3;
      if (lowerArmR) lowerArmR.rotation.x = Math.cos(t * 1.2) * 0.2;
      if (handR) handR.rotation.z = Math.sin(t * 1.5) * 0.15;

      // حركة الجسم للنظر للجانب
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        Math.sin(t * 0.3) * 0.2,
        0.02
      );
    }
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
