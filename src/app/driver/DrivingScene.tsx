'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type SpawnedObjectType = {
  id: number;
  side: 'left' | 'right';
  spawnTime: number;
};

const OBJECT_SPEED = 20; // Speed factor for object movement

// A simple road mesh to simulate a moving road
function Road() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state, delta) => {
    if (ref.current) {
      // Move the road slowly to simulate driving
      ref.current.position.z += OBJECT_SPEED * delta * 0.05;
      if (ref.current.position.z > 5) {
        ref.current.position.z = -5;
      }
    }
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[0, -1, 0]}>
      <planeGeometry args={[10, 100]} />
      <meshBasicMaterial color="#333" />
    </mesh>
  );
}

// The spawned object (a simple box) that moves toward the camera.
function SpawnedObject({
  object,
  onReached,
}: {
  object: SpawnedObjectType;
  onReached: (id: number) => void;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  // Set initial X based on the side (left/right)
  const initialX = object.side === 'left' ? -4 : 4;
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.z += OBJECT_SPEED * delta;
      if (ref.current.position.z >= 0) {
        onReached(object.id);
      }
    }
  });
  return (
    <mesh ref={ref} position={[initialX, 0, -50]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color="blue" />
    </mesh>
  );
}

// Main scene: handles object spawning and key input
function Scene() {
  const [spawnedObject, setSpawnedObject] = useState<SpawnedObjectType | null>(null);

  // Spawn a new object randomly on the left or right after a delay.
  const spawnObject = useCallback(() => {
    const id = Date.now();
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const newObject: SpawnedObjectType = { id, side, spawnTime: Date.now() };
    setSpawnedObject(newObject);
  }, []);

  useEffect(() => {
    if (!spawnedObject) {
      const delay = 2000 + Math.random() * 3000; // 2-5 seconds delay
      const timer = setTimeout(() => spawnObject(), delay);
      return () => clearTimeout(timer);
    }
  }, [spawnedObject, spawnObject]);

  // Listen for left/right arrow key presses to register reaction
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!spawnedObject) return;
      if (
        (e.key === 'ArrowLeft' && spawnedObject.side === 'left') ||
        (e.key === 'ArrowRight' && spawnedObject.side === 'right')
      ) {
        const time = Date.now() - spawnedObject.spawnTime;
        alert(`Reaction Time: ${time} ms`);
        setSpawnedObject(null);
      }
    },
    [spawnedObject]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // If an object reaches the camera without a response, alert the user.
  const handleObjectReached = useCallback(
    (id: number) => {
      if (spawnedObject && spawnedObject.id === id) {
        alert('Too slow!');
        setSpawnedObject(null);
      }
    },
    [spawnedObject]
  );

  return (
    <>
      <Road />
      {spawnedObject && (
        <SpawnedObject object={spawnedObject} onReached={handleObjectReached} />
      )}
    </>
  );
}

export default function DrivingScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <Scene />
    </Canvas>
  );
}