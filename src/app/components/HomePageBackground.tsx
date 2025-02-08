"use client";

import React from 'react';
import { Canvas } from '@react-three/fiber';
import NeuronNetwork from './NeuronNetwork';

const HomePageBackground: React.FC = () => {
    return (
        <Canvas className="absolute inset-0">
            <ambientLight intensity={0.7} />
            <NeuronNetwork />
        </Canvas>
    );
};

export default HomePageBackground;