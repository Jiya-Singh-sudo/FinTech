'use client';

import { useFraud } from '@/context/FraudContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ExclamationTriangleIcon, 
  MagnifyingGlassIcon,
  ShieldExclamationIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CheckCircleIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';

export default function FraudsPage() {
  const { results }: any = useFraud();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc'|'desc' | null}>({key: 'score', direction: 'desc'});

  useEffect(() => {
    setMounted(true);
    if (!results) {
      router.push('/upload');
    }
  }, [results, router]);

  const frauds = useMemo(() => {
    if (!results) return [];
    
    // Normalize data from current or legacy structure
    let items = [];
    if (results.predictions) {
      items = results.predictions.filter((s: any) => s.prediction === 'fraud');
    } else if (results.sample) {
      items = results.sample.filter((s: any) => s.prediction === 1);
    }
    
    // Apply Filter
    if (searchQuery) {
      items = items.filter((f: any) => 
        (f.transaction_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.reason || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply Sort
    if (sortConfig.key) {
      items.sort((a: any, b: any) => {
        const valA = sortConfig.key === 'score' ? (a.score || a.confidence || 0) : a[sortConfig.key];
        const valB = sortConfig.key === 'score' ? (b.score || b.confidence || 0) : b[sortConfig.key];
        
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return items;
  }, [results, searchQuery, sortConfig]);

  if (!results) return null;

  return (
    <div className="p-8 lg:p-12 space-y-8 min-h-screen bg-[#0f1115] text-slate-200">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-red-600/10 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
               <ShieldExclamationIcon className="w-7 h-7 text-red-500" />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                 Threat <span className="text-red-500">Repository</span>
               </h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
                    {frauds.length} Critical Vectors Identified • Live Analytics Active
                 </p>
               </div>
             </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by Transaction ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#16191e] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-white focus:outline-none focus:border-red-500/30 focus:bg-[#1d2127] transition-all w-72 placeholder:text-slate-600"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#16191e] border border-white/10 text-white rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider hover:bg-white/5 transition-all">
            <FunnelIcon className="w-4 h-4 text-slate-400" />
            Filter
          </button>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider hover:bg-white/10 transition-all">
            <ArrowDownTrayIcon className="w-4 h-4 text-slate-400" />
            Export
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-[#16191e] border border-white/5 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#1d2127]/50 border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                <th className="px-8 py-5">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors" onClick={() => setSortConfig({key: 'transaction_id', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                    Vector ID
                  </div>
                </th>
                <th className="px-8 py-5">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors text-center justify-center" onClick={() => setSortConfig({key: 'score', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                    Risk Index
                  </div>
                </th>
                <th className="px-8 py-5">Primary Reasoning</th>
                <th className="px-8 py-5">Security Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {frauds.map((tx: any, idx: number) => {
                const score = tx.score || tx.confidence || 0;
                const transactionId = tx.transaction_id || `TXN_${1000 + idx}`;
                const reason = tx.reason || "Anomalous Behavior";
                const isHighRisk = score > 0.8;

                return (
                  <tr key={idx} className="hover:bg-white/[0.02] active:bg-white/[0.03] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${isHighRisk ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
                          <FingerPrintIcon className={`w-4 h-4 ${isHighRisk ? 'text-red-500' : 'text-orange-500'}`} />
                        </div>
                        <div>
                          <p className="text-white font-mono font-black text-sm tracking-tight group-hover:text-red-400 transition-colors uppercase">{transactionId}</p>
                          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Automated Scan Entry</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col items-center gap-2">
                          <div className="flex items-end gap-1">
                            <span className={`text-xl font-black font-mono leading-none ${isHighRisk ? 'text-red-500' : 'text-orange-500'}`}>
                              {(score * 100).toFixed(1)}
                            </span>
                            <span className="text-[10px] text-slate-600 font-bold mb-0.5">%</span>
                          </div>
                          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-1000 ${isHighRisk ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-orange-500'}`} 
                              style={{ width: `${score * 100}%` }} 
                            />
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 w-max">
                        <ExclamationTriangleIcon className={`w-3.5 h-3.5 ${isHighRisk ? 'text-red-500' : 'text-orange-500'}`} />
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-wide">{reason}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500 italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Pending Specialist Review</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link 
                        href={`/explainability?id=${transactionId}`} 
                        className="inline-flex items-center gap-2 px-4 py-2 border border-white/5 bg-white/[0.03] rounded-xl text-[10px] font-black text-white hover:bg-white/10 hover:border-white/20 transition-all uppercase group/link"
                      >
                        Scan Report
                        <ChevronRightIcon className="w-3.5 h-3.5 text-slate-500 group-hover/link:translate-x-1 group-hover/link:text-red-500 transition-all" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {frauds.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-24 h-24 bg-green-500/5 rounded-full flex items-center justify-center mx-auto border border-green-500/10 mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-500 opacity-40 shadow-[0_0_20px_rgba(34,197,94,0.2)]" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-2">Perimeter Clean</h3>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">No anomalous vectors detected in currently uploaded ledger.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-slate-600 px-4">
        <p className="text-[10px] font-bold uppercase tracking-widest">Displaying {frauds.length} Incident Vectors</p>
        <div className="flex gap-2">
           {[1, 2, 3].map(p => (
             <button key={p} className={`w-8 h-8 rounded-lg text-[10px] font-black border transition-all ${p === 1 ? 'border-red-500/20 bg-red-500/10 text-red-500' : 'border-white/5 bg-white/5 text-slate-600 hover:bg-white/10'}`}>
               {p}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
