import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";

function RotatingStars() {
  const ref = useRef<Group>(null);
  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.03;
      ref.current.rotation.x += delta * 0.01;
    }
  });
  return (
    <group ref={ref}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

export default function StarBackground() {
  return (
    <Canvas style={{ position: "fixed", inset: 0, zIndex: 0, background: "#050510" }}>
      <RotatingStars />
    </Canvas>
  );
}
