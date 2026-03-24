'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CloudArrowUpIcon, 
  InformationCircleIcon, 
  CheckCircleIcon,
  PlayIcon,
  ArrowRightIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useFraud } from '@/context/FraudContext';

interface FileAsset {
  name: string;
  size: string;
  raw?: File | Blob;
}

export default function UploadPage() {
  const router = useRouter();
  const { updateResults }: any = useFraud();
  const [file, setFile] = useState<FileAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // ✅ Basic Validation
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file.');
        return;
      }

      setFile({
        name: selectedFile.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        raw: selectedFile
      });
    }
  };

  const handleRunDetection = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (file.raw) {
        formData.append('file', file.raw);
      } else {
        // Mock data for simulation
        const headers = "transaction_id,amount,payment_method,timestamp,device_type,merchant_id,location\n";
        const rows = Array.from({ length: 50 }, (_, i) => 
          `TX_${1000 + i},${Math.floor(Math.random() * 80000)},UPI,2026-03-24T12:00:00Z,Mobile,M_DEMO,IN`
        ).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        formData.append('file', blob, 'demo_simulation.csv');
      }

      const res = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'API Request Failed');
      }

      const data = await res.json();

      // 🛑 LOG RESPONSE TO CONSOLE
      console.log('--- 🧠 GUARDIA MODEL RESPONSE ---');
      console.table(data.sample); // Log sample rows as a clean table
      console.log('Total Results:', data);

      // ✅ Update Global State (Zustand/Context)
      updateResults(data);

      setIsUploading(false);
      setIsProcessing(true);

      // Redirect to midway processing screen
      router.push('/processing');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Connection failed. Ensure backend is running.');
      setIsUploading(false);
    }
  };

  const handleUseDemo = () => {
    setFile({ 
      name: 'demo_transactions_v2.csv', 
      size: '1.2MB' 
      // No raw file needed as handleRunDetection handles mock blob
    });
  };

  return (
    <div className="p-8 lg:p-12 space-y-12">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-white/5 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
            Step 01
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-space text-white">Data <span className="gradient-text">Ingestion</span></h1>
          <p className="text-foreground/50 mt-2 font-medium">Upload your transaction dataset or explore with a sample.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-foreground/40 hover:text-white transition-colors">Abort Session</Link>
          <button 
            disabled={!file || isUploading || isProcessing}
            onClick={handleRunDetection}
            className={`glow-button flex items-center gap-2 ${(!file || isUploading || isProcessing) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
          >
            {isUploading ? 'Uploading...' : isProcessing ? 'Initializing...' : 'Run Fraud Detection'}
            {!isUploading && !isProcessing && <PlayIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Upload Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className={`glass-card p-12 flex flex-col items-center justify-center text-center border-dashed border-2 transition-all duration-500 relative group cursor-pointer ${file ? 'border-primary/40 bg-primary/5' : 'border-outline/20 hover:border-primary/20 hover:bg-white/5'}`}>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileChange}
              accept=".csv"
            />
            
            <div className={`w-20 h-20 rounded-full bg-surface-bright flex items-center justify-center mb-6 shadow-xl border border-white/5 transition-transform duration-500 group-hover:scale-110 ${file ? 'text-primary' : 'text-foreground/30'}`}>
              <CloudArrowUpIcon className="w-10 h-10" />
            </div>
            
            {file ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                <div className="text-2xl font-bold text-white font-space">{file.name}</div>
                <div className="text-sm text-primary font-bold">{file.size} • Ready for analysis</div>
                <button onClick={(e) => {e.stopPropagation(); setFile(null);}} className="text-xs text-red-400 font-bold hover:underline mt-4">Change Dataset</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-2xl font-bold text-white font-space">Drag and drop CSV here</div>
                <p className="text-sm text-foreground/40 max-w-xs mx-auto font-medium">Support for standard financial transaction formats and high-frequency stream logs.</p>
                <button className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">Select File</button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="h-px flex-1 bg-white/5" />
            <div className="text-xs font-bold text-foreground/20 uppercase tracking-widest">or</div>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div 
            onClick={handleUseDemo}
            className="glass-card p-6 border-white/5 hover:border-tertiary/20 hover:bg-tertiary/5 transition-all duration-500 cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 border border-tertiary/20 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                <BeakerIcon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white font-space">Use Pre-loaded Simulation</h3>
                <p className="text-sm text-foreground/40 font-medium italic">Balanced dataset containing 1,200 transactions (UPI, Cards, EMI)</p>
              </div>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-tertiary/60 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Info Sidebar */}
        {/* <div className="space-y-6">
          <div className="glass-card p-6 border-white/5 space-y-6">
            <div className="flex items-center gap-3 text-white border-b border-white/5 pb-4">
              <InformationCircleIcon className="w-5 h-5 text-primary" />
              <h3 className="font-bold font-space uppercase tracking-wider text-xs">Dataset Requirements</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'transaction_id', type: 'UUID/String', desc: 'Secure identifier' },
                { label: 'amount', type: 'Float/Int', desc: 'Normalized currency' },
                { label: 'payment_method', type: 'Enum', desc: 'UPI, Card, Wallet...' },
                { label: 'timestamp', type: 'DateTime', desc: 'ISO 8601 format' },
                { label: 'device_type', type: 'String', desc: 'Browser or OEM' },
                { label: 'merchant_id', type: 'String', desc: 'Vendor reference' },
                { label: 'location', type: 'Geo', desc: 'Country/Region code' }
              ].map((col, idx) => (
                <div key={idx} className="flex justify-between items-start group">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white/90 group-hover:text-primary transition-colors">{col.label}</div>
                    <div className="text-[10px] text-foreground/40 font-medium">{col.desc}</div>
                  </div>
                  <div className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-foreground/60">{col.type}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border-white/5 space-y-4">
            <h3 className="text-sm font-bold font-space text-white/70">Pipeline Intelligence</h3>
            <div className="space-y-2">
              {[
                'Automated Data Cleaning',
                'Z-Score Anomaly Detection',
                'Payment Velocity Profiling',
                'SHAP Explainability Export'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500/60" />
                  <span className="text-[11px] text-foreground/50 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
