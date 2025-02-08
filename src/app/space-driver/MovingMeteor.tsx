// MovingMeteor.tsx
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

interface MovingMeteorProps {
  object: SpawnedObjectType;
  speed: number;
  onReached: (id: number) => void;
}

const MovingMeteor: React.FC<MovingMeteorProps> = ({ object, speed, onReached }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  // Create a mutable position vector starting from the meteor's initial position.
  const positionRef = useRef(object.position.clone());

  useFrame((_, delta) => {
    // Update position along the given direction.
    positionRef.current.addScaledVector(object.direction, speed * delta);
    meshRef.current.position.copy(positionRef.current);

    // Add a tumbling rotation effect.
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.3;

    // If the meteor is close to the center (within a distance of 1), consider it "reached".
    if (positionRef.current.distanceTo(new THREE.Vector3(0, 0, 0)) < 1) {
      onReached(object.id);
    }
  });

  return (
    <mesh ref={meshRef} position={object.position.toArray()}>
      {/* Cone geometry gives a meteor-like shape */}
      <coneGeometry args={[0.5, 1, 8]} />
      <meshStandardMaterial color={object.color} roughness={1} />
    </mesh>
  );
};

export default MovingMeteor;