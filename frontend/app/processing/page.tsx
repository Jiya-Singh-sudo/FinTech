'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PuzzlePieceIcon, 
  CpuChipIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  CircleStackIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  VariableIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/outline';

const stages = [
  { id: 1, name: 'Data Validation', icon: CircleStackIcon, desc: 'Verifying dataset schema and data types...' },
  { id: 2, name: 'Cleaning & Formatting', icon: PuzzlePieceIcon, desc: 'Imputing missing values and cleaning noise...' },
  { id: 3, name: 'Amount Normalization', icon: Square3Stack3DIcon, desc: 'Converting foreign currencies to local baseline...' },
  { id: 4, name: 'Temporal Standardization', icon: BeakerIcon, desc: 'Mapping transaction velocity and frequency...' },
  { id: 5, name: 'Feature Engineering', icon: VariableIcon, desc: 'Generating payment behavior behavioral features...' },
  { id: 6, name: 'Fraud Prediction', icon: CpuChipIcon, desc: 'Running ensemble gradient boosting models...' },
  { id: 7, name: 'Explainability Export', icon: MagnifyingGlassIcon, desc: 'Generating SHAP values for model transparency...' },
  { id: 8, name: 'Dashboard Population', icon: SparklesIcon, desc: 'Finalizing insights and risk visualizations...' }
];

export default function ProcessingPage() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(1);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (currentStage <= stages.length) {
      const timer = setTimeout(() => {
        setCurrentStage(prev => prev + 1);
      }, 1500); 
      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
    }
  }, [currentStage]);

  const progress = (Math.min(currentStage, stages.length) / stages.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-8 lg:p-12 min-h-screen text-center space-y-12">
      {/* Centered Processing Module */}
      <div className="max-w-3xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
          Step 02: Analysis Active
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold font-space text-white leading-tight">
          Analyzing <span className="gradient-text">Intelligence</span> Flow
        </h1>
        
        <p className="text-xl text-foreground/40 font-medium max-w-xl mx-auto">
          The Guardia engine is processing your dataset through our multi-layer neural pipeline to identify anomalous behavior.
        </p>

        {/* Global Progress Bar */}
        <div className="w-full h-2 bg-surface-bright rounded-full overflow-hidden relative shadow-inner border border-white/5">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-secondary to-tertiary shadow-[0_0_15px_rgba(191,90,242,0.6)] transition-all duration-1000 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        {/* Current Stage Indicator */}
        <div className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-3xl bg-surface-bright border border-white/10 flex items-center justify-center text-primary relative">
                <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-3xl" />
                {currentStage <= stages.length ? (
                  <stages[currentStage - 1].icon className="w-10 h-10 relative z-10" />
                ) : (
                  <ShieldCheckIcon className="w-10 h-10 text-green-500 relative z-10" />
                )}
              </div>
              <div className="text-left space-y-1">
                <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                  Stage {Math.min(currentStage, stages.length)} of {stages.length}
                </div>
                <div className="text-3xl font-bold text-white font-space">
                  {currentStage <= stages.length ? stages[currentStage - 1].name : 'System Synthesis Complete'}
                </div>
                <div className="text-sm font-medium text-foreground/50 italic italic">
                  {currentStage <= stages.length ? stages[currentStage - 1].desc : 'Redirecting to intelligence dashboard...'}
                </div>
              </div>
            </div>

            <div className="text-4xl font-black font-space text-white opacity-20">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Action Button (Hidden until finished) */}
        <div className={`transition-all duration-700 ${isFinished ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <button 
            onClick={() => router.push('/dashboard')}
            className="glow-button flex items-center gap-2 mx-auto px-12 py-5 text-xl font-bold font-space"
          >
            View Fraud Dashboard
            <ShieldCheckIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Background Micro Hub Bubbles */}
      <div className="flex gap-40 pt-20">
        {[
          { label: 'Anomalies', value: '7.2k/s' },
          { label: 'Latency', value: '42ms' },
          { label: 'Confidence', value: '99.4%' }
        ].map((stat, idx) => (
          <div key={idx} className="text-center group">
            <div className="text-[10px] font-bold text-foreground/20 uppercase tracking-[0.2em] mb-1 group-hover:text-primary transition-colors">{stat.label}</div>
            <div className="text-2xl font-black text-white font-space group-hover:scale-110 transition-transform">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
