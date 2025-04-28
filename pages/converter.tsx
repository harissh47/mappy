import { useState } from 'react';
import { saveAs } from 'file-saver';
import Head from 'next/head'; // ✅ Preload video
import Navigation from "../components/Navigation";
import "../app/globals.css";
 
type ClusteredPoint = {
  latitude: number;
  longitude: number;
  cluster: number;
  [key: string]: unknown;
};
 
export default function Converter() {
  const [jsonData, setJsonData] = useState<ClusteredPoint[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
 
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
 
    setFileName(file.name);
    setLoading(true);
 
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
    } catch (err) {
      alert("Error connecting to server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  const downloadJson = () => {
    if (!jsonData || !fileName) return;
    const jsonFileName = fileName.replace(/\.[^/.]+$/, "") + '.json';
    const blob = new Blob([JSON.stringify(jsonData, null, 4)], { type: 'application/json' });
    saveAs(blob, jsonFileName);
  };
 
  return (
    <>
      {/* ✅ Preload the background video for smoother experience */}
      <Head>
        {/* <link rel="preload" as="video" href="/comet-opt.mp4" type="video/mp4" /> */}
        <link rel="preload" as="video" href="/comet.webm" type="video/webm" />
      </Head>
 
      <div className="relative min-h-screen">
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
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
          <source src="/comet.webm" type="video/webm" />
          {/* <source src="/comet-opt.mp4" type="video/mp4" /> */}
          Your browser does not support the video tag.
        </video>

        <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-8">
          <header className="flex flex-col md:flex-row justify-center items-center mb-6 md:mb-8">
            <div className="absolute left-4 md:left-8 top-4 md:top-auto text-white text-lg md:text-xl font-bold">Mappy</div>
            <Navigation />
          </header>

          <div className="flex flex-col items-center mt-8 md:mt-12 px-4 md:px-0">
            <div className="w-full max-w-2xl">
              <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-xl p-6 md:p-8 text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">CSV/XLS to JSON Converter</h1>
                <p className="text-sm md:text-base text-white/80 mb-6">Convert your data files to JSON format with our intelligent clustering algorithm</p>
                
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 mb-6 bg-white/5">
                  <input
                    type="file"
                    accept=".csv, .xls, .xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex flex-col items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="text-white">
                      <p className="font-semibold">Choose a file or drag & drop</p>
                      <p className="text-sm text-white/60 mt-1">Supported formats: CSV, XLS, XLSX</p>
                    </div>
                  </label>
                </div>
              </div>

              {jsonData && (
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 w-full">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                    <h2 className="text-lg font-semibold text-white">Converted File</h2>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                      >
                        {showPreview ? 'Hide Preview' : 'Preview'}
                      </button>
                      <button
                        onClick={downloadJson}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Download JSON
                      </button>
                    </div>
                  </div>
                  
                  {showPreview && (
                    <div className="mt-4 bg-black/30 p-4 rounded-lg h-48 overflow-auto">
                      <pre className="text-xs md:text-sm text-white/90 font-mono">
                        {JSON.stringify(jsonData, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
 