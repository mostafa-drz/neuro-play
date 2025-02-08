"use client";

import GameCanvas from "./GameCanvas";


export default function BeLovedGamePage() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Be Loved Game</h1>
      <p className="mb-8 text-center">
        Click the red target as soon as it appears in your peripheral view!
      </p>
      <div className="w-full max-w-4xl h-[500px] border border-gray-300 rounded-lg shadow">
        <GameCanvas />
      </div>
    </main>
  );
}