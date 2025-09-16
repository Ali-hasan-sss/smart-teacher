import * as THREE from "three";

export const thinkingAnimation = (
  group: THREE.Group,
  leftPupil: THREE.Mesh,
  rightPupil: THREE.Mesh,
  state: any,
  leftHand?: THREE.Mesh, // اختياري
  rightHand?: THREE.Mesh // اختياري
) => {
  const time = state.clock.elapsedTime;

  // حركة الرأس
  group.rotation.y = Math.sin(time * 0.3) * 0.1;
  group.rotation.x = Math.sin(time * 0.2) * 0.03;

  // حركة صعود وهبوط خفيفة
  group.position.y = Math.sin(time * 0.5) * 0.02;

  // العيون ثابتة للأعلى
  const eyeUpOffset = 0.02;
  leftPupil.position.x = 0;
  leftPupil.position.y = eyeUpOffset;
  rightPupil.position.x = 0;
  rightPupil.position.y = eyeUpOffset;

  // حركة اليدين إذا تم تمريرهم
  if (leftHand && rightHand) {
    const handAmplitude = 0.05;
    const handSpeed = 2;
    leftHand.rotation.x = Math.sin(time * handSpeed) * handAmplitude;
    rightHand.rotation.x = -Math.sin(time * handSpeed) * handAmplitude;
  }
};
