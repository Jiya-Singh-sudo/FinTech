'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownTrayIcon, 
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  MapPinIcon,
  CreditCardIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const transactions = [
  { id: 'TRX_9421', user: 'USR_512', amount: '₹145,000', method: 'UPI', device: 'Mobile App', location: 'Mumbai, IN', risk: 94, reason: 'High amount vs average', status: 'Flagged', time: '2026-03-23 15:42' },
  { id: 'TRX_8412', user: 'USR_128', amount: '₹8,200', method: 'Card', device: 'Web Browser', location: 'London, UK', risk: 82, reason: 'New device detected', status: 'Flagged', time: '2026-03-23 15:30' },
  { id: 'TRX_7201', user: 'USR_392', amount: '₹22,500', method: 'NetBanking', device: 'ATM API', location: 'New York, US', risk: 78, reason: 'Unusual hour', status: 'Flagged', time: '2026-03-23 14:45' },
  { id: 'TRX_6619', user: 'USR_881', amount: '₹1,200', method: 'Wallet', device: 'POS Terminal', location: 'Delhi, IN', risk: 12, reason: 'Normal', status: 'Safe', time: '2026-03-23 14:20' },
  { id: 'TRX_5582', user: 'USR_210', amount: '₹4,500', method: 'UPI', device: 'Mobile App', location: 'Bangalore, IN', risk: 45, reason: 'Moderate velocity', status: 'Review', time: '2026-03-23 14:10' },
  { id: 'TRX_4109', user: 'USR_772', amount: '₹75,000', method: 'EMI', device: 'Mobile App', location: 'Hyderabad, IN', risk: 88, reason: 'Rapid repeat transactions', status: 'Flagged', time: '2026-03-23 13:55' },
  { id: 'TRX_3210', user: 'USR_101', amount: '₹2,100', method: 'BNPL', device: 'Web Browser', location: 'Paris, FR', risk: 8, reason: 'Normal', status: 'Safe', time: '2026-03-23 13:30' },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tx.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || tx.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 lg:p-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
            Real-time Monitoring
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-space text-white">Anomalous <span className="gradient-text">Transactions</span></h1>
          <p className="text-foreground/50 mt-2 font-medium italic">Comprehensive audit trail of transaction velocity and risk markers.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 glass-card border-white/5 text-sm font-bold text-white flex items-center gap-2 hover:bg-white/5 transition-all">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export Audit Logs
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-[400px]">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search by ID, user, or flags..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-bright border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all text-white placeholder:text-foreground/20 font-medium"
            />
          </div>
          <div className="flex items-center gap-2 glass-card p-1 border-white/5">
            {['All', 'Flagged', 'Review', 'Safe'].map((opt) => (
              <button 
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === opt ? 'bg-primary/20 text-primary' : 'text-foreground/40 hover:text-white'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <button className="px-4 py-2 text-xs font-bold text-foreground/40 flex items-center gap-2 hover:text-white transition-all">
          <FunnelIcon className="w-4 h-4" />
          Advanced Filters
        </button>
      </div>

      {/* Transactions Table Shell */}
      <div className="glass-card border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-bright/50 border-b border-white/5">
                {[
                  'Transaction ID', 
                  'User / Amount', 
                  'System Ingress', 
                  'Location / Date', 
                  'Risk Score', 
                  'Reasoning', 
                  'Status'
                ].map((th, i) => (
                  <th key={i} className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">{th}</th>
                ))}
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-primary/5 transition-all duration-300 group cursor-pointer" onClick={() => {}}>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white font-space tracking-tight">{tx.id}</span>
                      <span className="text-[10px] text-foreground/40 font-bold px-2 py-0.5 rounded bg-white/5 w-fit uppercase">{tx.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-white">
                        <UserIcon className="w-3.5 h-3.5 text-primary" />
                        {tx.user}
                      </div>
                      <span className="text-sm font-black text-primary/80">{tx.amount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground/60">
                      <DevicePhoneMobileIcon className="w-4 h-4 text-tertiary" />
                      {tx.device}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1 text-[11px] font-medium text-foreground/40">
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        {tx.location}
                      </div>
                      <span>{tx.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border font-bold text-[10px] font-space bg-surface border-white/10 text-white relative">
                        <div className="absolute inset-0 bg-primary/5 rounded-full" style={{ opacity: tx.risk / 100 }} />
                        {tx.risk}%
                      </div>
                      <div className="flex-1 h-1 w-12 bg-surface-bright rounded-full relative">
                        <div 
                          className={`absolute top-0 left-0 h-full rounded-full ${tx.risk > 80 ? 'bg-secondary' : tx.risk > 40 ? 'bg-primary' : 'bg-tertiary'}`} 
                          style={{ width: `${tx.risk}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="max-w-[150px] text-xs font-medium text-foreground/50 line-clamp-2">
                      {tx.reason}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold w-fit flex items-center gap-1 border
                      ${tx.status === 'Flagged' ? 'bg-secondary/10 text-secondary border-secondary/20 shadow-[0_0_10px_rgba(255,55,95,0.2)]' : 
                        tx.status === 'Review' ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(191,90,242,0.2)]' : 
                        'bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]'}`}
                    >
                      {tx.status === 'Flagged' ? <ExclamationTriangleIcon className="w-3.5 h-3.5" /> : 
                       tx.status === 'Safe' ? <ShieldCheckIcon className="w-3.5 h-3.5" /> : 
                       null}
                      {tx.status.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <Link href="/explainability" className="p-2 rounded-lg bg-surface-bright border border-white/5 opacity-0 group-hover:opacity-100 transition-all text-white hover:text-primary">
                      <ChevronRightIcon className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer / Pagination Mockup */}
        <div className="px-8 py-6 bg-surface-bright/30 flex items-center justify-between">
          <div className="text-xs font-medium text-foreground/40">Showing <span className="text-white">7</span> of <span className="text-white">1,428</span> flagged anomalies</div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-surface-bright border border-white/5 text-foreground/40 hover:text-white transition-all pointer-events-none">Prev</button>
            <button className="px-4 py-2 rounded-lg bg-primary/20 border border-primary/20 text-xs font-bold text-primary">1</button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold text-foreground/40 hover:text-white transition-all">2</button>
            <button className="px-4 py-2 rounded-lg text-xs font-bold text-foreground/40 hover:text-white transition-all">3</button>
            <button className="p-2 rounded-lg bg-surface-bright border border-white/5 text-foreground/60 hover:text-white transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
