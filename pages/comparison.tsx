import { useState, ChangeEvent } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import * as XLSX from 'xlsx';
import Loader from "../components/loader";
import Navigation from "../components/Navigation";
import "../app/globals.css";

const Map = dynamic(() => import('../components/Map'), { ssr: false });

interface DataPoint {
  latitude?: number;
  longitude?: number;
  Latitude?: number;
  Longitude?: number;
  cluster?: number;
  [key: string]: number | string | undefined;
}

type JsonData = DataPoint[];

export default function ComparisonPage() {
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [spreadsheetData, setSpreadsheetData] = useState<JsonData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    const fileExtension = file.name.toLowerCase().split('.').pop();

    try {
      // Handle JSON files
      if (fileExtension === 'json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (!result) return;
          
          try {
            const data = JSON.parse(result as string);
            const formattedData = Array.isArray(data) ? data : [data];
            const dataWithClusters = formattedData.map((item: DataPoint) => ({
              ...item,
              cluster: item.cluster ?? 0
            }));
            setJsonData(dataWithClusters);
            setSpreadsheetData(null);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Error parsing JSON file");
          }
        };
        reader.readAsText(file);
      }
      // Handle CSV/XLS/XLSX files
      else if (['csv', 'xls', 'xlsx'].includes(fileExtension || '')) {
        if (fileExtension === 'csv') {
          // Send to backend for clustering
          const formData = new FormData();
          formData.append('file', file);

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
        }

        // Process as spreadsheet for raw display
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          if (!event.target) return;
          const result = event.target.result;
          if (!result || !(result instanceof ArrayBuffer)) return;
          
          try {
            const data = new Uint8Array(result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet) as DataPoint[];
            
            const beatCodeToCluster: { [key: string]: number } = {};
            let clusterCounter = 0;
            
            jsonData.forEach(item => {
              const beatcodeKey = Object.keys(item).find(
                key => key.toLowerCase() === 'beatcode'
              );
              const beatcodeValue = beatcodeKey ? item[beatcodeKey] : undefined;
              if (beatcodeKey && beatcodeValue !== undefined && typeof beatcodeValue === 'string' && !(beatcodeValue in beatCodeToCluster)) {
                beatCodeToCluster[beatcodeValue] = clusterCounter++;
              }
            });

            const formattedData = jsonData.map((item) => {
              const beatcodeKey = Object.keys(item).find(
                key => key.toLowerCase() === 'beatcode'
              );
              const beatcodeValue = beatcodeKey ? item[beatcodeKey] : undefined;
              const beatcode = beatcodeValue !== undefined && typeof beatcodeValue === 'string' ? beatcodeValue : null;
              
              return {
                ...item,
                latitude: item.Latitude || item.latitude || 0,
                longitude: item.Longitude || item.longitude || 0,
                cluster: beatcode && beatcode in beatCodeToCluster ? beatCodeToCluster[beatcode] : 0
              };
            });
            
            setSpreadsheetData(formattedData);
          } catch (error) {
            console.error("Error parsing spreadsheet:", error);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        alert("Unsupported file format. Please upload a JSON, CSV, XLS, or XLSX file.");
      }
    } catch (err) {
      alert("Error processing file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link rel="preload" as="video" href="/bgpic.webm" type="video/webm" />
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
          <source src="/bgpic.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        
        <div className="relative z-10 min-h-screen flex flex-col p-4 md:p-8">
          <header className="flex flex-col md:flex-row justify-center items-center mb-6 md:mb-8">
            <div className="absolute left-4 md:left-8 top-4 md:top-auto text-white text-lg md:text-xl font-bold">Mappy</div>
            <Navigation />
          </header>

          <div className="flex-1 flex flex-col mt-4 md:mt-8">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".json,.csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Image src="/upload.png" alt="Upload" width={16} height={16} className="opacity-75" />
                  <span>Choose File</span>
                </label>
                {fileName && (
                  <span className="text-white text-sm truncate">{fileName}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h2 className="text-white font-bold mb-2">AI Clustered Map</h2>
                <div className={`h-[400px] rounded-xl overflow-hidden ${jsonData ? 'border-2 border-white/20' : 'bg-white/5'}`}>
                  {jsonData ? (
                    <Map data={jsonData} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/60">
                      Upload a file to view the AI clustered map
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <h2 className="text-white font-bold mb-2">Raw Data Map</h2>
                <div className={`h-[400px] rounded-xl overflow-hidden ${spreadsheetData ? 'border-2 border-white/20' : 'bg-white/5'}`}>
                  {spreadsheetData ? (
                    <Map data={spreadsheetData} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-white/60">
                      Upload a spreadsheet file to view the raw data map
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {loading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader />
          </div>
        )}
      </div>
    </>
  );
} 