'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  HomeIcon, 
  ArrowUpTrayIcon, 
  PresentationChartBarIcon, 
  TableCellsIcon, 
  LightBulbIcon, 
  CpuChipIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon, public: true },
  { name: 'Upload', href: '/upload', icon: ArrowUpTrayIcon, public: false },
  { name: 'Dashboard', href: '/dashboard', icon: PresentationChartBarIcon, public: false },
  { name: 'Frauds', href: '/frauds', icon: ShieldExclamationIcon, public: false },
  { name: 'Transactions', href: '/transactions', icon: TableCellsIcon, public: false },
  { name: 'Explainability', href: '/explainability', icon: LightBulbIcon, public: false },
  { name: 'Pipeline', href: '/pipeline', icon: CpuChipIcon, public: false },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-[#0f1115] border-r border-slate-800 p-6 flex flex-col z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-slate-400">
          G
        </div>
        <h1 className="text-sm font-black tracking-[0.2em] text-slate-300 uppercase">Guardia Platform</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isDisabled = !user && !item.public;
          
          if (isDisabled) return null;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-slate-800 text-white border-l-2 border-slate-400' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-slate-200' : 'text-slate-600'}`} />
              <span className="uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        {user ? (
          <div className="p-4 bg-[#16191e] border border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <UserCircleIcon className="w-5 h-5 text-slate-600" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-slate-300 truncate">{user.email}</p>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Analyst Session</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full py-1.5 border border-slate-700 text-[9px] font-black uppercase text-slate-500 hover:bg-slate-800 hover:text-white transition-all"
            >
              Terminate Session
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link 
              href="/login" 
              className="w-full flex items-center justify-center py-2 border border-slate-700 text-[10px] font-bold uppercase text-slate-400 hover:bg-slate-800 transition-all font-sans"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="w-full flex items-center justify-center py-2 bg-slate-800 border border-slate-700 text-[10px] font-bold uppercase text-white hover:bg-slate-700 transition-all font-sans"
            >
              Registry
            </Link>
          </div>
        )}

        <div className="p-4 border border-dashed border-slate-800 bg-[#0f1115]">
          <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1 italic">Security Status</div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Network Secure</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
