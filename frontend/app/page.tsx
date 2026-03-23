'use client';

import Link from 'next/link';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  MagnifyingGlassIcon, 
  RocketLaunchIcon,
  ShieldExclamationIcon,
  CloudArrowUpIcon,
  CpuChipIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

const capabilities = [
  {
    title: 'Data Ingestion',
    desc: 'Unified endpoint for broad transaction streams and batch datasets.',
    icon: CloudArrowUpIcon,
  },
  {
    title: 'Risk Modeling',
    desc: 'Neural-net based anomaly detection with continuous learning.',
    icon: CpuChipIcon,
  },
  {
    title: 'Deep explainability',
    desc: 'Instant SHAP value analysis for every prediction outcome.',
    icon: ShieldExclamationIcon,
  },
  {
    title: 'Analytic reporting',
    desc: 'Dense, multi-variate monitoring for financial analysts.',
    icon: TableCellsIcon,
  }
];

export default function Home() {
  const { user }: any = useAuth();

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans selection:bg-slate-700">
      {/* PROFESSIONAL OVERLAY */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <section className="relative px-8 pt-32 pb-20 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-8">
          <div className="px-4 py-1.5 border border-slate-700 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 bg-slate-800/20">
            System Identity: Guardia v2.4.1
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-mono text-white tracking-tighter leading-tight max-w-4xl">
            PRECISION <span className="text-slate-500">FRAUD</span> INTELLIGENCE FOR MODERN FINANCE
          </h1>
          <p className="max-w-2xl text-slate-500 font-bold uppercase tracking-widest text-[11px] leading-relaxed">
            A specialized analytics ecosystem designed for deep transaction monitoring and anomaly detection. 
            Decision-centric data processing optimized for security analysts.
          </p>
          
          <div className="flex gap-4 pt-6">
            <Link 
              href={user ? "/dashboard" : "/signup"} 
              className="px-8 py-4 bg-slate-100 text-slate-900 text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-white/5"
            >
              Initialize Platform
            </Link>
            <Link 
              href={user ? "/pipeline" : "/login"} 
              className="px-8 py-4 border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all font-sans"
            >
              Access Portal
            </Link>
          </div>
        </div>
      </section>

      {/* DENSE CAPABILITIES GRID */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-slate-800 divide-x divide-slate-800">
          {capabilities.map((item, i) => (
            <div key={i} className="p-8 hover:bg-slate-800/20 transition-all space-y-4">
              <div className="p-3 bg-slate-900 border border-slate-800 inline-block">
                <item.icon className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white">{item.title}</h3>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed uppercase">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SYSTEM METRICS PREVIEW */}
      <section className="px-8 py-20 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Latency', val: '14ms' },
            { label: 'Accuracy', val: '99.8%' },
            { label: 'Uptime', val: '99.9%' },
            { label: 'Security', val: 'FIPS 140' }
          ].map((m, i) => (
            <div key={i} className="space-y-1">
              <div className="text-2xl font-bold font-mono text-slate-300">{m.val}</div>
              <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER STRIP */}
      <footer className="px-8 py-10 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-slate-700 uppercase tracking-widest gap-4">
        <div>© 2026 Guardia Analytic Systems</div>
        <div className="flex gap-10">
          <span className="hover:text-slate-400 cursor-pointer">Security Protocol</span>
          <span className="hover:text-slate-400 cursor-pointer">API Documentation</span>
          <span className="hover:text-slate-400 cursor-pointer">Privacy Compliance</span>
        </div>
      </footer>
    </div>
  );
}
