import Link from 'next/link';
import React from 'react';
import HomePageBackground from './components/HomePageBackground';

export const metadata = {
  title: 'NeuroPlay - Cognitive Games for a Sharper Mind',
  description:
    'NeuroPlay is a collection of web-based games designed to boost your cognitive power. Explore our interactive experiences, including Space Driver, and elevate your mental acuity.',
};

export default function HomePage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Background */}
      <HomePageBackground />

      {/* Content Overlay */}
      <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
        <div className="bg-black bg-opacity-60 p-8 rounded shadow-lg max-w-2xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">NeuroPlay</h1>
          <p className="text-xl md:text-2xl text-white mb-8">
        Welcome to NeuroPlay – a curated collection of web-based games designed to boost your cognitive power.
          </p>
          <Link href="/space-driver" className="inline-block px-8 py-4 bg-blue-500 rounded-full text-lg font-semibold hover:bg-blue-600 transition">
          Play Space Driver
          </Link>
        </div>
      </div>
    </div>
  );
}