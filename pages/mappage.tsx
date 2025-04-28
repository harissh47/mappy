import { useState, ChangeEvent, DragEvent } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import Loader from "../components/loader";
import Navigation from "../components/Navigation";
import "../app/globals.css";

const Map = dynamic(() => import('../components/Map'), { ssr: false });

type ClusteredPoint = {
  latitude: number;
  longitude: number;
  cluster: number;
  [key: string]: unknown;
};

export default function MapPage() {
  const [jsonData, setJsonData] = useState<ClusteredPoint[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleFile = async (file: File) => {
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    // If it's a JSON file, read it directly
    if (file.name.toLowerCase().endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setJsonData(data);
          setIsModalOpen(false);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          alert("Error parsing JSON file");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsText(file);
      return;
    }

    // For CSV/XLS/XLSX files, send to backend for conversion
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${backendUrl}/cluster`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Error: " + error.error);
        return;
      }

      const clusteredJson = await response.json();
      setJsonData(clusteredJson);
      setIsModalOpen(false);
    } catch (err) {
      alert("Error connecting to server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      if (['json', 'csv', 'xls', 'xlsx'].includes(fileType || '')) {
        handleFile(file);
      } else {
        alert('Unsupported file format. Please use JSON, CSV, XLS, or XLSX files.');
      }
    }
  };

  return (
    <>
      <Head>
        {/* <link rel="preload" as="video" href="/bgpic-opt.mp4" type="video/mp4" /> */}
        <link rel="preload" as="video" href="/bgpic.webm" type="video/webm" />
      </Head>

      <div className="relative min-h-screen">
        {loading && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Loader />
          </div>
        )}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/bgpic.webm" type="video/webm" />
          {/* <source src="/bgpic-opt.mp4" type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>
        
        <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-8">
          <header className="flex flex-col md:flex-row justify-center items-center mb-6 md:mb-8">
            <div className="absolute left-4 md:left-8 top-4 md:top-auto text-white text-lg md:text-xl font-bold">Mappy</div>
            <Navigation />
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-16 md:mt-0 md:absolute right-4 md:right-8 md:top-8 flex items-center gap-2 text-white bg-black/60 hover:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Upload"
            >
              <span className="inline">Upload File</span>
              <Image src="/upload.png" alt="Upload" width={16} height={16} className="opacity-75" />
            </button>
          </header>

          {!isModalOpen && (
            <div className="flex-1 flex flex-col mt-4 md:mt-8 min-h-0">
              {fileName && (
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg mb-4 inline-flex items-center self-start">
                  <span className="text-white text-sm md:text-base">Current file: {fileName}</span>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg flex-1 min-h-0 flex flex-col h-full">
                <h2 className="text-white font-bold mb-2">Map View</h2>
                <div className={`flex-1 min-h-0 rounded-xl overflow-hidden ${jsonData ? 'border-2 border-white/20' : 'bg-white/5'} h-full`}>
                  {jsonData ? (
                    <div className="w-full h-full">
                      <div style={{ position: 'relative', height: '100%', width: '100%', flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
                        <Map data={jsonData} />
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/60">
                      Upload a file to view the map
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 md:p-8 w-full max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">Upload File</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div 
                className={`border-2 border-dashed ${isDragging ? 'border-blue-500 bg-white/10' : 'border-white/30'} rounded-lg p-8 bg-white/5 transition-colors`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".json,.csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">Choose a file or drag & drop</p>
                    <p className="text-sm text-white/60 mt-1">Supported formats: CSV, XLS, XLSX, JSON</p>
                  </div>
                </label>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-white/80 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Select File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
 
 