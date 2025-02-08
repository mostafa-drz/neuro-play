import React, { useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Scene from './Scene';

type CubeColor = 'red' | 'green' | 'yellow';

const SpaceScene: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(10);
  const [started, setStarted] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [colorMapping, setColorMapping] = useState<Record<CubeColor, string> | null>(null);

  const updateScore = useCallback((points: number) => {
    setScore((prev) => prev + points);
  }, []);

  const increaseSpeed = useCallback(() => {
    setSpeed((prev) => prev + 1);
  }, []);

  // Generate random key assignments on mount.
  useEffect(() => {
    if (!colorMapping) {
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp'];
      const shuffled = [...keys].sort(() => Math.random() - 0.5);
      const mapping: Record<CubeColor, string> = {
        red: shuffled[0],
        green: shuffled[1],
        yellow: shuffled[2],
      };
      setColorMapping(mapping);
    }
  }, [colorMapping]);

  // Listen for custom 'shake' events to trigger a shake animation.
  useEffect(() => {
    const triggerShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    };
    window.addEventListener('shake', triggerShake);
    return () => window.removeEventListener('shake', triggerShake);
  }, []);

  const startGame = () => {
    setStarted(true);
  };

  return (
    <div className={`relative w-full h-full ${shake ? 'shake' : ''}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        {started && colorMapping && (
          <Scene
            onScore={updateScore}
            speed={speed}
            onSpeedIncrease={increaseSpeed}
            colorMapping={colorMapping}
          />
        )}
      </Canvas>
      {/* Overlays */}
      <div className="absolute top-4 left-4 text-white text-xl z-10">Score: {score}</div>
      <div className="absolute top-4 right-4 text-white text-xl z-10">Speed: {speed}</div>

      {/* Start Overlay */}
      {!started && colorMapping && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-20">
          <h1 className="text-4xl font-bold text-white mb-4">Space Reaction Game</h1>
          <div className="text-white mb-8 text-center max-w-md">
            <p className="mb-2">
              <span className="text-red-500 font-bold">Red</span> cubes require the{' '}
              <span className="text-blue-300 font-bold">{colorMapping.red}</span> key.
            </p>
            <p className="mb-2">
              <span className="text-green-500 font-bold">Green</span> cubes require the{' '}
              <span className="text-blue-300 font-bold">{colorMapping.green}</span> key.
            </p>
            <p className="mb-2">
              <span className="text-yellow-500 font-bold">Yellow</span> cubes require the{' '}
              <span className="text-blue-300 font-bold">{colorMapping.yellow}</span> key.
            </p>
            <p className="mb-2">
              React quickly to score points. Pressing the wrong key—or pressing when no cube is present—will cost you points.
            </p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Start Game
          </button>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg z-10">
        Keep your eyes wide open and react fast!
      </div>

      {/* Inline styles for shake animation */}
      <style jsx>{`
        @keyframes shake {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-10px, 0); }
          40% { transform: translate(10px, 0); }
          60% { transform: translate(-10px, 0); }
          80% { transform: translate(10px, 0); }
          100% { transform: translate(0, 0); }
        }
        .shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default SpaceScene;