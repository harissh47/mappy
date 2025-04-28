"use client";
 
import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";
import Navigation from "../components/Navigation";
 
export default function Home() {
  const [isClient, setIsClient] = useState(false);
 
  useEffect(() => {
    setIsClient(true);
  }, []);
 
  return (
    <>
      {/* ✅ Preload video for better perceived performance */}
      <Head>
        {/* <link rel="preload" as="video" href="/seg-opt.mp4" type="video/mp4" /> */}
        <link rel="preload" as="video" href="/seg.webm" type="video/webm" />
      </Head>
 
      <div className="relative min-h-screen text-white" suppressHydrationWarning={true}>
        {isClient && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-0 w-full h-full object-cover"
          >
            <source src="/seg.webm" type="video/webm" />
            {/* <source src="/seg-opt.mp4" type="video/mp4" /> */}
            Your browser does not support the video tag.
          </video>
        )}
 
        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="flex flex-col md:flex-row justify-center items-center p-4 md:p-8">
            <div className="absolute left-4 md:left-8 top-4 md:top-auto text-white text-lg md:text-xl font-bold">Mappy</div>
            <Navigation />
          </header>
 
          <main className="flex flex-col md:flex-row items-center justify-between p-4 md:p-8 mt-20">
            <div className="flex-1 max-w-md mx-auto md:mx-0">
              <h1
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-silver to-white text-transparent bg-clip-text text-center md:text-left"
                style={{ backgroundClip: "text", backgroundImage: "linear-gradient(to right, silver, white 50%)" }}
              >
                Intelligent Geo Location Patterns
              </h1>
              <p
                className="text-base md:text-lg mb-10 bg-gradient-to-r from-silver to-white text-transparent bg-clip-text text-center md:text-left"
                style={{ backgroundClip: "text", backgroundImage: "linear-gradient(to right, silver, white 50%)" }}
              >
                Group your locations on a map with AI.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link
                  href="/about"
                  className="bg-white text-black py-2 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  Get Started <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
 
 