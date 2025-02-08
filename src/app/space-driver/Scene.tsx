import React, { useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import MovingMeteor, { CubeColor, SpawnedObjectType } from './MovingMeteor';

interface SceneProps {
  onScore: (points: number) => void;
  speed: number;
  onSpeedIncrease: (speed?:number) => void;
  colorMapping: Record<CubeColor, string>;
}

// Helper: returns a random spawn position along one of the four edges (with z = -50)
function getRandomSpawn(): { position: THREE.Vector3 } {
  const horizontalBoundary = 15;
  const verticalBoundary = 10;
  const edge = Math.floor(Math.random() * 4);
  let x = 0, y = 0;
  if (edge === 0) {
    // Left edge
    x = -horizontalBoundary;
    y = (Math.random() - 0.5) * 2 * verticalBoundary;
  } else if (edge === 1) {
    // Right edge
    x = horizontalBoundary;
    y = (Math.random() - 0.5) * 2 * verticalBoundary;
  } else if (edge === 2) {
    // Top edge
    y = verticalBoundary;
    x = (Math.random() - 0.5) * 2 * horizontalBoundary;
  } else {
    // Bottom edge
    y = -verticalBoundary;
    x = (Math.random() - 0.5) * 2 * horizontalBoundary;
  }
  return { position: new THREE.Vector3(x, y, -50) };
}

const Scene: React.FC<SceneProps> = ({ onScore, speed, onSpeedIncrease, colorMapping }) => {
  const [spawnedObject, setSpawnedObject] = useState<SpawnedObjectType | null>(null);

  // Spawn a new meteor object with a random color and spawn position.
  const spawnObject = useCallback(() => {
    const id = Date.now();
    const colors: CubeColor[] = ['red', 'green', 'yellow'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const { position } = getRandomSpawn();
    const target = new THREE.Vector3(0, 0, 0);
    const direction = target.clone().sub(position).normalize();
    setSpawnedObject({ id, spawnTime: Date.now(), color, position, direction });
  }, []);

  // Spawn a meteor after a delay if none exists.
  useEffect(() => {
    if (!spawnedObject) {
      const timer = setTimeout(() => spawnObject(), 500);
      return () => clearTimeout(timer);
    }
  }, [spawnedObject, spawnObject]);

  // Handle key presses based on the randomized color mapping.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const validKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp'];
      if (!validKeys.includes(e.key)) return;

      if (spawnedObject) {
        const expectedKey = colorMapping[spawnedObject.color];
        if (e.key === expectedKey) {
          const reactionTime = Date.now() - spawnedObject.spawnTime;
          const points = Math.max(0, 1000 - reactionTime);
          onScore(points);
          onSpeedIncrease();
          setSpawnedObject(null);
        } else {
          onScore(-100);
          onSpeedIncrease(-1);
          window.dispatchEvent(new Event('shake'));
        }
      } else {
        onScore(-100);
        window.dispatchEvent(new Event('shake'));
      }
    },
    [spawnedObject, onScore, onSpeedIncrease, colorMapping]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // If the meteor reaches the center (i.e. the player's area), it's considered missed.
  const handleObjectReached = useCallback(
    (id: number) => {
      if (spawnedObject && spawnedObject.id === id) {
        onScore(-50); // Miss penalty.
        onSpeedIncrease();
        setSpawnedObject(null);
      }
    },
    [spawnedObject, onScore, onSpeedIncrease]
  );

  return (
    <>
      {spawnedObject && (
        <MovingMeteor object={spawnedObject} speed={speed} onReached={handleObjectReached} />
      )}
    </>
  );
};

export default Scene;