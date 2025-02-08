'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Rotating central cube
function RotatingCube() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="green" wireframe />
    </mesh>
  );
}

// Red target sphere component
type TargetSphereProps = {
  position: [number, number, number];
  onClick: () => void;
};

function TargetSphere({ position, onClick }: TargetSphereProps) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

// Component to animate background color dynamically
function DynamicBackground() {
  const { gl } = useThree();
  useFrame(() => {
    const time = Date.now() * 0.0005;
    const r = Math.sin(time * 0.7) * 0.5 + 0.5;
    const g = Math.sin(time * 0.3) * 0.5 + 0.5;
    const b = Math.sin(time * 0.2) * 0.5 + 0.5;
    gl.setClearColor(new THREE.Color(r, g, b));
  });
  return null;
}

interface TargetData {
  position: [number, number, number];
  spawnTime: number;
}

// Main game logic component
function Game() {
  const [targetData, setTargetData] = useState<TargetData | null>(null);

  // Function to spawn a new target
  const spawnTarget = useCallback(() => {
    const angle = (Math.random() - 0.5) * (Math.PI / 2); // -45° to 45° horizontally
    const distance = 3;
    const x = distance * Math.sin(angle);
    const y = distance * (Math.random() - 0.5); // random vertical offset
    setTargetData({ position: [x, y, 0], spawnTime: Date.now() });
  }, []);

  // Schedule a target spawn if none is active
  useEffect(() => {
    if (!targetData) {
      const delay = 2000 + Math.random() * 3000; // 2-5 seconds delay
      const timer = setTimeout(() => spawnTarget(), delay);
      return () => clearTimeout(timer);
    }
  }, [targetData, spawnTarget]);

  // Handle click on the target: compute reaction time, alert, and remove target
  const handleTargetClick = () => {
    if (targetData) {
      const reactionTime = Date.now() - targetData.spawnTime;
      alert(`Reaction Time: ${reactionTime} ms`);
      setTargetData(null);
    }
  };

  return (
    <>
      <RotatingCube />
      {targetData && (
        <TargetSphere position={targetData.position} onClick={handleTargetClick} />
      )}
    </>
  );
}

export default function GameCanvas() {
  return (
    <Canvas>
      <DynamicBackground />
      <Game />
    </Canvas>
  );
}