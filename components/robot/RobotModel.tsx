import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type RobotAnimation = (
  group: THREE.Group,
  leftPupil: THREE.Mesh,
  rightPupil: THREE.Mesh,
  state: any
) => void;

export default function RobotModel({
  mouse,
  animation,
}: {
  mouse?: { x: number; y: number };
  animation?: RobotAnimation;
}) {
  const group = useRef<THREE.Group>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);
  const { scene } = useGLTF("/models/robot.glb");
  useFrame((state) => {
    if (!group.current) return;

    // إذا مررنا animation استخدمها
    if (animation) {
      if (leftPupilRef.current && rightPupilRef.current) {
        animation(
          group.current,
          leftPupilRef.current,
          rightPupilRef.current,
          state
        );
      }
      return;
    }

    // الحركة الافتراضية مع حماية الـ refs
    if (mouse && leftPupilRef.current && rightPupilRef.current) {
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
      <primitive
        object={scene}
        position={[0, -1, 0]}
        scale={0.9}
        onUpdate={(self: any) => {
          // تحسين ألوان الروبوت
          self.traverse((child: any) => {
            if (child.isMesh) {
              child.material = child.material.clone();
              child.material.color.setHex(0xeeeeee);
              child.material.metalness = 0.6; // تقليل المعدنية
              child.material.roughness = 0.2; // سطح أكثر نعومة
              child.material.emissive.setHex(0x444444); // إضاءة ذاتية أقوى
              child.material.emissiveIntensity = 0.3; // شدة الإضاءة الذاتية
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
        }}
      />
      {/* العين اليسرى */}
      <group position={[-0.15, 1.0, 0.6]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#444444"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh ref={leftPupilRef} position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color="#000"
            emissive="#0066ff"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      {/* العين اليمنى */}
      <group position={[0.15, 1.0, 0.6]}>
        <mesh>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#444444"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh ref={rightPupilRef} position={[0, 0, 0.05]}>
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial
            color="#000"
            emissive="#0066ff"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}
