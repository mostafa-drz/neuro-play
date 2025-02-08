import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type CubeColor = 'red' | 'green' | 'yellow';

export interface SpawnedObjectType {
  id: number;
  spawnTime: number;
  color: CubeColor;
  position: THREE.Vector3;
  direction: THREE.Vector3;
}

interface MovingCubeProps {
  object: SpawnedObjectType;
  speed: number;
  onReached: (id: number) => void;
}

const MovingCube: React.FC<MovingCubeProps> = ({ object, speed, onReached }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  // Create a mutable copy of the starting position.
  const pos = useRef(object.position.clone());

  useFrame((_, delta) => {
    pos.current.addScaledVector(object.direction, speed * delta);
    meshRef.current.position.copy(pos.current);
    // If the cube gets near the center, call onReached.
    if (pos.current.distanceTo(new THREE.Vector3(0, 0, 0)) < 1) {
      onReached(object.id);
    }
  });

  return (
    <mesh ref={meshRef} position={object.position.toArray()}>
      <boxGeometry args={[0.7, 0.7, 0.7]} />
      <meshBasicMaterial color={object.color} />
    </mesh>
  );
};

export default MovingCube;