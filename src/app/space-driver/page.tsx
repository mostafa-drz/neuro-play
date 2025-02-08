"use client";

import Head from 'next/head';
import SpaceScene from './SpaceScene';

export default function DriveReactionPage() {
  return (
    <>
      <Head>
        <title>Drive Reaction Game | NeuroPlay</title>
        <meta
          name="description"
          content="Test your reaction time in a driving simulation game. Identify objects on the left or right and react quickly!"
        />
      </Head>
      <div className="w-screen h-screen">
        <SpaceScene />
      </div>
    </>
  );
}