"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative min-h-screen text-white" suppressHydrationWarning={true}>
      {isClient && (
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="/seg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="relative z-10">
        <header className="flex flex-col md:flex-row justify-center items-center p-4 md:p-8">
          <div className="absolute left-4 md:left-8 text-white text-lg md:text-xl font-bold">Mappy</div>
          <nav className="bg-white/30 backdrop-blur-md rounded-full px-4 py-2 md:px-6 md:py-2 shadow-md flex gap-4 md:gap-6 mt-4 md:mt-0">
            <a href="/" className="text-black hover:underline">Home</a>
            <a href="./about" className="text-black hover:underline">About</a>
            <a href="./mappage" className="text-black hover:underline">MapPage</a>
            <a href="./converter" className="text-black hover:underline">Converter</a>
            {/* <a href="#" className="text-black hover:underline">Contact</a> */}
          </nav>
        </header>
        <main className="flex flex-col md:flex-row items-center justify-between p-4 md:p-8 mt-20">
          <div className="flex-1 max-w-md">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-silver to-white text-transparent bg-clip-text" style={{ backgroundClip: 'text', backgroundImage: 'linear-gradient(to right, silver, white 50%)' }}>
              Intelligent Geo Location Patterns
            </h1>
            <p className="text-base md:text-lg mb-10 bg-gradient-to-r from-silver to-white text-transparent bg-clip-text" style={{ backgroundClip: 'text', backgroundImage: 'linear-gradient(to right, silver, white 50%)' }}>
              Group your locations on a map with AI.
            </p>
            <a href="./about" className="bg-white text-black py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              Get Started <span className="ml-2">→</span>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
} 