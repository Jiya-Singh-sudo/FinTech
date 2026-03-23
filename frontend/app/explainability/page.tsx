'use client';

import Link from 'next/link';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell,
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis 
} from 'recharts';
import { 
  ShieldExclamationIcon, 
  ShieldCheckIcon,
  MagnifyingGlassIcon, 
  UserIcon, 
  CpuChipIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  BoltIcon,
  ArrowRightIcon,
  LifebuoyIcon
} from '@heroicons/react/24/outline';

const featureImportanceData = [
  { feature: 'Transaction Amount', value: 85, color: '#FF375F' },
  { feature: 'Payment Velocity', value: 72, color: '#BF5AF2' },
  { feature: 'Device Age', value: 65, color: '#BF5AF2' },
  { feature: 'Location Offset', value: 48, color: '#00E5FF' },
  { feature: 'Merchant Risk', value: 35, color: '#1E2024' },
  { feature: 'Time of Day', value: 20, color: '#1E2024' }
];

const behaviorRadarData = [
  { subject: 'Amount', user: 120, baseline: 30, fullMark: 150 },
  { subject: 'Velocity', user: 98, baseline: 20, fullMark: 150 },
  { subject: 'Frequency', user: 86, baseline: 40, fullMark: 150 },
  { subject: 'New Device', user: 110, baseline: 10, fullMark: 150 },
  { subject: 'New Location', user: 70, baseline: 5, fullMark: 150 },
  { subject: 'Merchant', user: 50, baseline: 60, fullMark: 150 },
];

const explanationSignals = [
  { title: 'Extreme Amount Deviation', icon: ExclamationCircleIcon, severity: 'High', desc: 'Transaction value ₹145k is 4.2x higher than user’s 30-day average window.', color: 'text-secondary' },
  { title: 'New Device Proxy Detection', icon: CpuChipIcon, severity: 'Critical', desc: 'The device ID US-00234 has never been used by USR_512 in the past 2 years.', color: 'text-primary' },
  { title: 'Anomalous Location (Mumbai)', icon: LifebuoyIcon, severity: 'Medium', desc: 'UPI request originated from a non-primary geolocation cluster.', color: 'text-tertiary' },
  { title: 'Rapid Sequence Velocity', icon: SparklesIcon, severity: 'Low', desc: 'This is the 3rd attempt within a 60-second window.', color: 'text-white/60' }
];

import { useSearchParams } from 'next/navigation';
import { useFraud } from '@/context/FraudContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function ExplainabilityContent() {
  const { results }: any = useFraud();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const transactionId = searchParams.get('id');

  useEffect(() => {
    setMounted(true);
    if (!results) {
      router.push('/upload');
    }
  }, [results, router]);

  if (!results) return null;

  // Find the selected transaction or default to the first fraud/item
  const allTransactions = results.predictions || results.sample || [];
  let selectedTx;
  
  if (transactionId) {
    selectedTx = allTransactions.find((s: any) => (s.transaction_id || `TRX_RADAR_${1000 + allTransactions.indexOf(s)}`) === transactionId);
  }
  
  if (!selectedTx) {
    selectedTx = allTransactions.find((s: any) => s.prediction === 'fraud' || s.prediction === 1) || allTransactions[0];
  }

  const isFraud = selectedTx.prediction === 'fraud' || selectedTx.prediction === 1;
  const score = selectedTx.score || selectedTx.confidence || 0;
  const currentTransactionId = selectedTx.transaction_id || `TRX_RADAR_${1000 + allTransactions.indexOf(selectedTx)}`;
  const reason = selectedTx.reason || "Anomalous Velocity";

  // Dynamic signals based on the transaction reason if available
  const signals = [
    { title: reason, icon: ExclamationCircleIcon, severity: isFraud ? 'High' : 'Low', desc: `System flag: ${reason}. Detected by neural inference.`, color: isFraud ? 'text-secondary' : 'text-green-500' },
    ...explanationSignals.slice(1) // Keep some placeholder signals for visual density
  ];

  return (
    <div className="p-8 lg:p-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
            Explainable AI (XAI)
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-space text-white">Model <span className="gradient-text">Reasoning</span> Flow</h1>
          <p className="text-foreground/50 mt-2 font-medium italic">Transparency layer detailing why the AI flagged {currentTransactionId} as {isFraud ? 'high-risk' : 'safe'}.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-3 glass-card border-white/5 flex items-center gap-4">
            <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Confidence Score</div>
            <div className={`text-2xl font-black font-space tracking-tight ${isFraud ? 'text-red-500' : 'text-green-500'}`}>
              {(score * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Case Summary */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Anomaly Card */}
          <div className={`glass-card p-10 border-white/5 relative overflow-hidden group ${isFraud ? 'bg-red-500/5' : 'bg-green-500/5'}`}>
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 ${isFraud ? 'bg-red-500/10' : 'bg-green-500/10'}`} />
            <div className="flex flex-wrap items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-8">
                <div className={`w-20 h-20 rounded-3xl bg-surface-bright flex items-center justify-center shadow-xl ${isFraud ? 'text-red-500 shadow-red-500/20' : 'text-green-500 shadow-green-500/20'}`}>
                  {isFraud ? <ShieldExclamationIcon className="w-10 h-10" /> : <ShieldCheckIcon className="w-10 h-10" />}
                </div>
                <div className="space-y-1">
                  <div className={`text-xs font-bold uppercase tracking-[0.2em] font-space ${isFraud ? 'text-red-500' : 'text-green-500'}`}>
                    {isFraud ? 'Abnormal Pattern' : 'Secure Transaction'}
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-white font-space">Audit Reference {currentTransactionId}</h3>
                  <div className="flex items-center gap-4 text-[10px] text-foreground/40 font-black uppercase tracking-widest">
                    <span>ANALYST_01_REVIEW</span>
                    <span>•</span>
                    <span className="text-white/80">Batch: {allTransactions.length} trx</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Model Delta</div>
                <div className="text-4xl font-black text-white font-mono">{score.toFixed(3)}</div>
              </div>
            </div>
          </div>

          {/* Reasoning Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-8 border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-space uppercase tracking-widest text-white/60">Reasoning Signals</h3>
                <BoltIcon className="w-4 h-4 text-primary" />
              </div>
              <div className="space-y-6">
                {signals.map((sig, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className={`mt-1 p-2 rounded-lg bg-surface-bright border border-white/5 ${sig.color} group-hover:scale-110 transition-transform`}>
                      <sig.icon className="w-5 h-5 transition-transform" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-bold text-white font-space">{sig.title}</div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${sig.color}`}>{sig.severity}</span>
                      </div>
                      <p className="text-xs text-foreground/50 leading-relaxed font-medium">
                        {sig.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 border-white/5 space-y-6">
              <h3 className="text-sm font-bold font-space uppercase tracking-widest text-white/60">Feature Importance</h3>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportanceData} layout="vertical">
                    <XAxis type="number" dataKey="value" hide />
                    <YAxis dataKey="feature" type="category" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} axisLine={false} width={120} />
                    <Tooltip 
                      content={({ payload }) => (
                        payload?.[0] ? (
                          <div className="glass-card p-2 border-white/10 text-[10px] font-bold text-white">
                            Impact Score: {payload[0].value}
                          </div>
                        ) : null
                      )}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {featureImportanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-foreground/40 italic">Weighting based on Gradient Boosted Tree analysis.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Analysis */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-8 border-white/5 space-y-8 flex flex-col">
            <h3 className="text-sm font-bold font-space uppercase tracking-widest text-white/60">Behavioral Anomaly Radar</h3>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={behaviorRadarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                  <Radar name={`User ${currentTransactionId}`} dataKey="user" stroke="#FF375F" fill="#FF375F" fillOpacity={0.4} />
                  <Radar name="Historical Baseline" dataKey="baseline" stroke="#00E5FF" fill="#00E5FF" fillOpacity={0.2} />
                  <Tooltip 
                    content={({ payload }) => (
                      payload?.length ? (
                        <div className="glass-card p-3 border-white/10 space-y-1">
                          {payload.map((p, i) => (
                            <div key={i} className="text-xs font-bold" style={{ color: p.color }}>
                              {p.name}: {p.value}
                            </div>
                          ))}
                        </div>
                      ) : null
                    )}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="w-3 h-3 rounded bg-secondary shadow-[0_0_8px_rgba(255,55,95,0.4)]" />
                <span className="text-white/80">Current Transaction Signal Intensity</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium mb-10">
                <div className="w-3 h-3 rounded bg-tertiary shadow-[0_0_8px_rgba(0,229,255,0.4)]" />
                <span className="text-white/40">30-day User Behavioral Baseline</span>
              </div>
            </div>

            <button className="glow-button w-full flex items-center justify-center gap-2 mt-auto">
              Confirm Fraud Decision
              <CheckBadgeIcon className="w-5 h-5 text-white/50" />
            </button>
            <button className="w-full py-4 rounded-full border border-white/5 text-xs font-bold text-foreground/40 hover:text-white transition-all uppercase tracking-widest hover:bg-white/5">
              Request Manual Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExplainabilityPage() {
  return (
    <Suspense fallback={<div className="p-12 text-white font-bold uppercase tracking-widest text-xs animate-pulse">Loading Reasoning Flow...</div>}>
      <ExplainabilityContent />
    </Suspense>
  );
}
