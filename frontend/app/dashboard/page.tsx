'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  ShieldCheckIcon, 
  ChartBarIcon,
  CircleStackIcon,
  FingerPrintIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const fraudByHourData = [
  { hour: '00:00', count: 42 },
  { hour: '04:00', count: 18 },
  { hour: '08:00', count: 65 },
  { hour: '12:00', count: 120 },
  { hour: '16:00', count: 145 },
  { hour: '20:00', count: 88 }
];

const paymentMethodData = [
  { name: 'UPI', value: 450, color: '#4F46E5' },
  { name: 'Card', value: 320, color: '#E11D48' },
  { name: 'NetBanking', value: 150, color: '#0891B2' },
  { name: 'Wallet', value: 80, color: '#7C3AED' }
];

const riskByDeviceData = [
  { device: 'Mobile App', risk: 12 },
  { device: 'Web Browser', risk: 34 },
  { device: 'ATM API', risk: 78 },
  { device: 'POS Terminal', risk: 45 }
];

const highRiskTransactions = [
  { id: 'TRX_9421', amount: '₹145,000', risk: 94, method: 'UPI', time: '17:42:01' },
  { id: 'TRX_8412', amount: '₹8,200', risk: 82, method: 'Card', time: '17:35:15' },
  { id: 'TRX_7201', amount: '₹22,500', risk: 78, method: 'NetBanking', time: '16:50:30' },
  { id: 'TRX_6190', amount: '₹5,000', risk: 65, method: 'UPI', time: '16:42:10' },
  { id: 'TRX_5089', amount: '₹1,20,000', risk: 88, method: 'Card', time: '16:15:45' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 text-[10px] text-white">
        <p className="font-bold border-b border-slate-700 pb-1 mb-1 uppercase tracking-tighter">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: <span className="font-black">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user }: any = useAuth();
  const [mounted, setMounted] = useState(false);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 p-6 font-sans">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-left">
            <ShieldCheckIcon className="w-6 h-6 text-slate-400" />
            ANALYTIC THREAT MONITORING
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1 text-left">
            Real-time Anomaly Detection Active • {mounted && new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Analyst</p>
            <p className="text-xs font-bold text-slate-300">{userName}</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Operational</span>
          </div>
        </div>
      </div>

      {/* 1. TOP METRICS BAR */}
      <div className="grid grid-cols-4 gap-0 mb-6 border border-slate-800 bg-[#16191e]">
        {[
          { label: 'Total Transactions', value: '124,592', color: 'slate' },
          { label: 'Fraud Detected', value: '1,428', color: 'red-500' },
          { label: 'Fraud Rate', value: '1.14%', color: 'rose-400' },
          { label: 'Model F1 Score', value: '0.982', color: 'emerald-400' }
        ].map((metric, i) => (
          <div key={i} className={`p-5 flex flex-col justify-center border-r last:border-r-0 border-slate-800`}>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{metric.label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-mono text-${metric.color}`}>{metric.value}</span>
              <span className="text-[10px] text-slate-600">↑ 1.2%</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. MAIN CONTENT AREA (Grid) */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* Main Analytics: Fraud Over Time */}
        <div className="col-span-12 lg:col-span-8 bg-[#16191e] border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Incident Frequency (v/h)</h3>
            <div className="flex gap-1">
              <button className="px-2 py-1 text-[10px] font-bold bg-slate-700 text-white border border-slate-600">24H</button>
              <button className="px-2 py-1 text-[10px] font-bold bg-[#1d2127] text-slate-500 border border-slate-800">7D</button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fraudByHourData}>
                <CartesianGrid strokeDasharray="0" stroke="#1f242d" vertical={false} />
                <XAxis 
                  dataKey="hour" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={{ stroke: '#1f242d' }} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={{ stroke: '#1f242d' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#E11D48" 
                  strokeWidth={2} 
                  fill="#E11D48" 
                  fillOpacity={0.1} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Component: Payment Distribution */}
        <div className="col-span-12 lg:col-span-4 bg-[#16191e] border border-slate-800 p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Payment Vector Analysis</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4">
            {paymentMethodData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{item.name}</span>
                <span className="text-[10px] font-mono font-bold text-slate-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Flagged Transactions Table */}
        <div className="col-span-12 lg:col-span-9 bg-[#16191e] border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 bg-[#1d2127] border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">High Risk Active Transactions</h3>
            <span className="text-[10px] font-bold text-rose-500 animate-pulse">CRITICAL ASSET MONITORING</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#1a1e24] text-slate-500 uppercase font-black tracking-tighter border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-bold">Transaction ID</th>
                  <th className="px-6 py-3 font-bold">Amount</th>
                  <th className="px-6 py-3 font-bold">Risk Score</th>
                  <th className="px-6 py-3 font-bold">Method</th>
                  <th className="px-6 py-3 font-bold">Time (UTC)</th>
                  <th className="px-6 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {highRiskTransactions.map((tx, idx) => (
                  <tr key={idx} className={`hover:bg-slate-800/30 transition-colors group ${tx.risk > 90 ? 'bg-rose-950/20' : ''}`}>
                    <td className="px-6 py-3 font-mono text-slate-400">{tx.id}</td>
                    <td className="px-6 py-3 font-bold text-slate-300">{tx.amount}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-slate-800 h-1 max-w-[60px]">
                          <div className={`h-full ${tx.risk > 90 ? 'bg-red-500' : 'bg-rose-500'}`} style={{ width: `${tx.risk}%` }} />
                        </div>
                        <span className={`font-bold ${tx.risk > 90 ? 'text-red-500' : 'text-rose-400'}`}>{tx.risk}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-500 font-bold uppercase tracking-widest">{tx.method}</td>
                    <td className="px-6 py-3 font-mono text-slate-500">{tx.time}</td>
                    <td className="px-6 py-3">
                      <button className="text-[9px] font-black uppercase text-slate-400 border border-slate-700 px-2 py-0.5 hover:bg-slate-700 hover:text-white transition-all">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Insights / System Health */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-[#16191e] border border-slate-800 p-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Device Risk Clustering</h3>
            <div className="space-y-4">
              {riskByDeviceData.map((d, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">{d.device}</span>
                    <span className="text-slate-300">{d.risk}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1">
                    <div className="h-full bg-indigo-500" style={{ width: `${d.risk}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0f1115] border border-dashed border-slate-800 p-5">
            <div className="flex items-center gap-3 mb-3">
              <ClockIcon className="w-4 h-4 text-slate-600" />
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Logs / Feed</p>
            </div>
            <div className="space-y-3 font-mono text-[9px]">
              <div className="text-slate-600 border-l-2 border-slate-800 pl-2">
                <span className="text-slate-700 underline">[17:41:02]</span> SYSTEM_READY: Latency 14ms
              </div>
              <div className="text-rose-400 border-l-2 border-rose-500 pl-2">
                <span className="text-rose-500 underline">[17:42:01]</span> ALERT: TRX_9421 High Risk (94%)
              </div>
              <div className="text-slate-600 border-l-2 border-slate-800 pl-2">
                <span className="text-slate-700 underline">[17:42:15]</span> PATTERN matched: UPI_CLUSTERING_V4
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
