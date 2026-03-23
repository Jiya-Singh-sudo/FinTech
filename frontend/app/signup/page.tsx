'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SignupPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      console.error(error.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f1115] overflow-hidden font-sans">
      {/* LEFT PANEL: Branding & Registration Portal Info */}
      <div className="hidden md:flex flex-col flex-1 relative p-16 justify-center border-r border-slate-800 bg-[#0c0e12]">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-xl space-y-12 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-slate-400">
              G
            </div>
            <h1 className="text-sm font-black tracking-[0.3em] text-slate-300 uppercase">Guardia Analytic Systems</h1>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold font-mono text-white leading-tight tracking-tighter uppercase">
              Analyst <span className="text-slate-500">Registration</span> Registry
            </h2>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest leading-relaxed max-w-sm">
              Global threat intelligence network registry. Initialize your identity within the secure monitoring ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
            {[
              { label: 'Network Class', val: 'Primary' },
              { label: 'Asset Protection', val: 'Enterprise' },
              { label: 'Identity Vector', val: 'OAuth Enabled' },
              { label: 'Security Class', val: 'System Access' }
            ].map((stat, i) => (
              <div key={i} className="border-l-2 border-slate-800 pl-4">
                <div className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-xs font-bold text-slate-400 font-mono tracking-tight">{stat.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Registration Card */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0f1115]">
        <div className="max-w-sm w-full border border-slate-800 bg-[#16191e] p-8 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4">
            <LockClosedIcon className="w-4 h-4 text-slate-800" />
          </div>

          <div className="text-center space-y-2 mb-10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Registry Initialization</h3>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Connect Identity to Continue</p>
          </div>

          <div className="w-full space-y-3">
            <button 
              disabled={!!loading}
              onClick={() => handleOAuthLogin('google')}
              className={`w-full py-4 border border-slate-700 bg-slate-800/50 text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:bg-slate-800 hover:text-white group ${loading === 'google' ? 'opacity-50' : ''}`}
            >
              {loading === 'google' ? (
                <div className="w-3 h-3 border border-slate-500 border-t-white rounded-full animate-spin" />
              ) : (
                <FaGoogle className="w-4 h-4" />
              )}
              <span>Continue with Google</span>
            </button>

            <button 
              disabled={!!loading}
              onClick={() => handleOAuthLogin('github')}
              className={`w-full py-4 border border-slate-700 bg-slate-800/50 text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:bg-slate-800 hover:text-white group ${loading === 'github' ? 'opacity-50' : ''}`}
            >
              {loading === 'github' ? (
                <div className="w-3 h-3 border border-slate-500 border-t-white rounded-full animate-spin" />
              ) : (
                <FaGithub className="w-4 h-4" />
              )}
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">
              Authorized access only. By continuing, you agree to comply with system identity protocols.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
              <span>Already registered?</span>
              <Link href="/login" className="text-white font-black uppercase tracking-widest underline decoration-slate-700 decoration-2 underline-offset-4 hover:decoration-slate-400">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
