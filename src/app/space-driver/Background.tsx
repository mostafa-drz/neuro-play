import React, { useRef, useEffect } from 'react';
import { Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Background: React.FC = () => {
  const starsRef = useRef<any>(null);
  // A random offset that updates every second to add a flicker effect.
  const randomOffset = useRef(Math.random());

  useEffect(() => {
    const interval = setInterval(() => {
      randomOffset.current = Math.random();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      const t = state.clock.elapsedTime;
      // Create a small pulsing effect: base scale is 1, modulate with a sine wave and random offset.
      const scale = 1 + 0.05 * Math.sin(t * 3) + 0.05 * randomOffset.current;
      starsRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={100}   // inner sphere radius
      depth={50}     // depth of star area
      count={5000}   // number of stars
      factor={6}     // increased star size (from default 4 to 6)
      saturation={0}
      fade
    />
  );
};

export default Background;