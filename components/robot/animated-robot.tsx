"use client";
import { useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import RobotModel from "./RobotModel";

export function AnimatedRobot() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return <RobotModel mouse={mouse} />;
}
