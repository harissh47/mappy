import Head from "next/head";
import Navigation from "../components/Navigation";
import "../app/globals.css";

export default function About() {
  return (
    <>
      {/* ✅ Preload rotation.mp4 for faster video loading */}
      <Head>
        {/* <link rel="preload" as="video" href="/rotation-opt.mp4" type="video/mp4" /> */}
        <link rel="preload" as="video" href="/rotation.webm" type="video/webm" />
      </Head>

      <div className="relative min-h-screen">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          >
          <source src="/rotation.webm" type="video/webm" />
          {/* <source src="/rotation-opt.mp4" type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>
        <div className="relative min-h-screen flex flex-col justify-between p-4 md:p-8">
          <header className="flex flex-col md:flex-row justify-center items-center mb-6 md:mb-8">
            <div className="absolute left-4 md:left-8 top-4 md:top-8 text-white text-lg md:text-xl font-bold">Mappy</div>
            <Navigation />
          </header>

          <main className="flex flex-col items-center md:items-start text-white mt-8 md:mt-0">
            <h1 className="text-3xl md:text-6xl font-bold mb-4 text-center md:text-left">Real Time Clustering</h1>
            <p className="text-base md:text-lg mb-6 md:mb-8 text-center md:text-left">
              Plotting the points of latitude and longitude in real time
            </p>
            <div className="w-full md:w-2/5 mt-4 md:mt-0">
              <div className="bg-white/60 backdrop-blur-md rounded-lg p-4 md:p-6">
                <p className="text-sm md:text-base text-black text-center md:text-justify">
                  Our solution intelligently organizes locations into distinct groups based on their geographical data, uncovering patterns and enabling more strategic decision-making. This streamlined approach provides valuable insights to optimize your operations and drive better outcomes.
                </p>
              </div>
            </div>
            <a href="./mappage" className="bg-black text-white py-3 px-6 rounded-full flex items-center shadow-lg hover:shadow-xl transition-shadow duration-300 mt-8 md:mt-10 mx-auto md:mx-0">
              Get Started <span className="ml-2">→</span>
            </a>
          </main>
        </div>
      </div>
    </>
  );
}
