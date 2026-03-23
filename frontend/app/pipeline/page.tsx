'use client';

import { 
  CircleStackIcon, 
  CpuChipIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  CloudArrowUpIcon,
  VariableIcon,
  MagnifyingGlassIcon,
  Square3Stack3DIcon,
  PresentationChartBarIcon,
  ChevronDoubleRightIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/outline';

const architectureSteps = [
  {
    id: 'ingestion',
    label: 'Raw Dataset Ingestion',
    tech: 'CSV / Cloud Stream',
    desc: 'Support for high-throughput financial logs and real-time transaction streaming.',
    icon: CloudArrowUpIcon,
    color: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'cleaning',
    label: 'Data Pre-processing',
    tech: 'Pandas / Scipy',
    desc: 'Removing outliers, handling missing values, and normalizing currency baselines.',
    icon: Square3Stack3DIcon,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'feature',
    label: 'Feature Engineering',
    tech: 'Scikit-learn',
    desc: 'Extracting payment velocity, merchant risk factors, and behavioral clusters.',
    icon: VariableIcon,
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'model',
    label: 'Model Inference',
    tech: 'XGBoost / LightGBM',
    desc: 'Ensemble gradient boosting used for high-accuracy fraud probability scoring.',
    icon: CpuChipIcon,
    color: 'from-emerald-400 to-green-600'
  },
  {
    id: 'explainability',
    label: 'Explainability Engine',
    tech: 'SHAP / LIME',
    desc: 'Generating local and global feature importance for model transparency.',
    icon: MagnifyingGlassIcon,
    color: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'output',
    label: 'Dashboard Visualization',
    tech: 'Next.js / Recharts',
    desc: 'Real-time populated analytics dashboard for human-in-the-loop review.',
    icon: PresentationChartBarIcon,
    color: 'from-indigo-500 to-violet-600'
  }
];

const techBadges = [
  { name: 'Next.js 15', category: 'Frontend' },
  { name: 'FastAPI', category: 'Backend' },
  { name: 'XGBoost', category: 'ML Engine' },
  { name: 'Recharts', category: 'Viz' },
  { name: 'PostgreSQL', category: 'Storage' },
  { name: 'Redis', category: 'Cache' }
];

export default function PipelinePage() {
  return (
    <div className="p-8 lg:p-12 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
            System Architecture
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-space text-white">Full <span className="gradient-text">Engineering</span> Pipeline</h1>
          <p className="text-foreground/50 mt-2 font-medium italic italic">Visual representation of the end-to-end fraud intelligence pipeline.</p>
        </div>
      </div>

      {/* Main Architecture Flow */}
      <div className="space-y-4">
        {architectureSteps.map((step, idx) => (
          <div key={idx} className="relative">
            <div className="glass-card p-6 border-white/5 flex flex-col md:flex-row items-center gap-10 hover:border-primary/20 hover:bg-primary/5 transition-all group">
              {/* Icon / Color Side */}
              <div className="flex-shrink-0 w-24 h-24 rounded-3xl bg-surface-bright border border-white/5 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform">
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                <step.icon className={`w-10 h-10 relative z-10 text-white/80 group-hover:text-white transition-colors`} />
              </div>

              {/* Text Side */}
              <div className="flex-1 space-y-3 py-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold text-white font-space tracking-tight">{step.label}</h3>
                  <div className="px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-foreground/40 uppercase tracking-widest">{step.tech}</div>
                </div>
                <p className="text-sm text-foreground/50 font-medium leading-relaxed max-w-2xl italic italic">
                  {step.desc}
                </p>
              </div>

              {/* Status / Connection Side */}
              <div className="flex flex-col items-center gap-2 px-10">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
              </div>
            </div>

            {/* Connecting Line (Vertical) */}
            {idx < architectureSteps.length - 1 && (
              <div className="flex justify-center h-16 w-full pointer-events-none -my-2 relative z-0">
                <div className="w-[2px] h-full bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />
                <ChevronDoubleRightIcon className="w-5 h-5 text-primary/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Info Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
        <div className="glass-card p-8 border-white/5 space-y-6">
          <h3 className="text-sm font-bold font-space uppercase tracking-widest text-white/60">Core Technology Stack</h3>
          <div className="flex flex-wrap gap-4">
            {techBadges.map((badge, idx) => (
              <div key={idx} className="group cursor-default">
                <div className="px-4 py-2 rounded-xl bg-surface border border-white/5 flex flex-col group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                  <span className="text-xs font-black text-white">{badge.name}</span>
                  <span className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">{badge.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 border-white/5 flex flex-col justify-center text-center space-y-4">
          <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-tertiary/20 h-[1px] w-full" />
          <h3 className="text-xl font-bold text-white font-space">Production Ready</h3>
          <p className="text-xs text-foreground/40 italic italic font-medium leading-relaxed">
            This architecture is designed for 99.99% availability and supports auto-scaling 
            based on transaction velocity spikes during major retail events.
          </p>
          <div className="flex justify-center gap-10 pt-4">
             <div className="flex flex-col">
               <span className="text-2xl font-black text-white font-space">250ms</span>
               <span className="text-[10px] font-bold text-foreground/30 uppercase">Latency</span>
             </div>
             <div className="flex flex-col">
               <span className="text-2xl font-black text-white font-space">10M+</span>
               <span className="text-[10px] font-bold text-foreground/30 uppercase">Capacity/Hour</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
