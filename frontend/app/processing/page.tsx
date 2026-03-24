'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFraud } from '@/context/FraudContext';

export default function ProcessingPage() {
  const router = useRouter();
  const { results }: any = useFraud();

  useEffect(() => {
    // Redirect if no results exist
    if (!results) {
      router.push('/upload');
      return;
    }

    // Simulate analysis delay
    const timer = setTimeout(() => {
      // Automatic redirect to Explainability page if any fraud is detected
      if (results.fraud_detected > 0) {
        router.push('/explainability');
      } else {
        router.push('/dashboard');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [results, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0f1115]">
      <div className="relative w-32 h-32 mb-8">
        {/* Outer Scanner Ring */}
        <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
        <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
        
        {/* Inner Pulsing Radar */}
        <div className="absolute inset-4 bg-primary/10 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full" />
        </div>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white font-mono tracking-tighter">
          ANALYZING <span className="text-primary">DATA_STREAM</span>
        </h1>
        <div className="flex flex-col items-center gap-2">
          <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[shimmer_2s_infinite] w-full origin-left" 
                 style={{ animationDuration: '2.5s' }} />
          </div>
          <p className="text-[10px] text-foreground/40 font-black uppercase tracking-[0.3em] animate-pulse">
            Applying Neural Heuristics...
          </p>
        </div>
      </div>
    </div>
  );
}

// Add CSS keyframe for the progress bar if not in global
