import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NeuronNetwork: React.FC = () => {
  const count = 100;

  // Generate random node positions inside a cube.
  const nodePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      positions.push((Math.random() - 0.5) * 20);
      positions.push((Math.random() - 0.5) * 20);
      positions.push((Math.random() - 0.5) * 20);
    }
    return new Float32Array(positions);
  }, [count]);

  // Create an array of THREE.Vector3 for each node.
  const nodeVectors = useMemo(() => {
    const vectors: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const x = nodePositions[i * 3];
      const y = nodePositions[i * 3 + 1];
      const z = nodePositions[i * 3 + 2];
      vectors.push(new THREE.Vector3(x, y, z));
    }
    return vectors;
  }, [nodePositions, count]);

  // Create positions for line segments connecting nodes that are close.
  const linePositions = useMemo(() => {
    const positions = [];
    const threshold = 5; // Only connect nodes that are closer than this distance.
    for (let i = 0; i < nodeVectors.length; i++) {
      for (let j = i + 1; j < nodeVectors.length; j++) {
        if (nodeVectors[i].distanceTo(nodeVectors[j]) < threshold) {
          positions.push(nodeVectors[i].x, nodeVectors[i].y, nodeVectors[i].z);
          positions.push(nodeVectors[j].x, nodeVectors[j].y, nodeVectors[j].z);
        }
      }
    }
    return new Float32Array(positions);
  }, [nodeVectors]);

  // Create a BufferGeometry for the dashed lines and compute line distances manually.
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    // Manually compute the line distances.
    const posAttr = geometry.getAttribute('position');
    const lineDistances = new Float32Array(posAttr.count);
    let sum = 0;
    // Assumes pairs of vertices form a line segment.
    for (let i = 0; i < posAttr.count; i += 2) {
      const start = new THREE.Vector3().fromBufferAttribute(posAttr, i);
      const end = new THREE.Vector3().fromBufferAttribute(posAttr, i + 1);
      lineDistances[i] = sum;
      const dist = start.distanceTo(end);
      sum += dist;
      lineDistances[i + 1] = sum;
    }
    geometry.setAttribute('lineDistance', new THREE.BufferAttribute(lineDistances, 1));
    return geometry;
  }, [linePositions]);

  const linesRef = useRef<THREE.LineSegments>(null);

  // Animate dash offset to simulate signal flow.
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (linesRef.current && linesRef.current.material instanceof THREE.LineDashedMaterial) {
      linesRef.current.material.dashOffset = -t * 0.5;
      linesRef.current.material.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Render nodes as points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={nodePositions}
            count={nodePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="white" size={0.2} />
      </points>
      {/* Render connecting lines as dashed segments */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineDashedMaterial
          color="white"
          dashSize={0.5}
          gapSize={0.2}
          transparent
          opacity={0.6}
        />
      </lineSegments>
    </>
  );
};

export default NeuronNetwork;