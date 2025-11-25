import React from 'react';
import { Download, Mic, MonitorDown } from 'lucide-react';
import { Language } from '../types';

const STEPS = {
  en: [
    { title: "Download App", icon: MonitorDown },
    { title: "Press Fn", icon: "FN_KEY" },
    { title: "Speak Freely", icon: Mic }
  ],
  zh: [
    { title: "下载应用", icon: MonitorDown },
    { title: "按下 Fn", icon: "FN_KEY" },
    { title: "自由表达", icon: Mic }
  ],
  ja: [
    { title: "アプリをダウンロード", icon: MonitorDown },
    { title: "Fnキーを押す", icon: "FN_KEY" },
    { title: "自由に話す", icon: Mic }
  ]
};

// Realistic Fn Key Component
const FnKey = () => (
  <div className="group/key relative w-20 h-20">
    {/* Key Base (Shadow/Side) */}
    <div className="absolute inset-0 bg-[#bdc1c6] dark:bg-[#0d0d0d] rounded-2xl translate-y-1.5 shadow-lg" />
    {/* Key Top */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f7] to-[#e1e1e6] dark:from-[#2c2c2e] dark:to-[#1c1c1e] rounded-2xl border-t border-white/80 dark:border-white/10 shadow-sm flex items-end justify-start p-3 transition-transform duration-100 group-hover/key:translate-y-1">
      <span className="font-sans font-medium text-zinc-400 dark:text-zinc-400 text-sm">fn</span>
    </div>
  </div>
);

export const HowItWorks: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 dark:via-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-16 relative">
          
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-[5.5rem] left-16 right-16 h-[2px] bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent z-0" />

          {STEPS[lang].map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              
              {/* Number Badge */}
              <div className="mb-6 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full z-20 shadow-sm">
                 <span className="font-mono text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-widest">0{i + 1}</span>
              </div>

              {/* Visual Container */}
              <div className="w-36 h-36 mb-8 rounded-[32px] bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-white/10 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 relative backdrop-blur-xl">
                {/* Glow effect behind icon */}
                <div className="absolute inset-0 bg-blue-500/5 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {step.icon === "FN_KEY" ? (
                   <FnKey />
                ) : (
                   // @ts-ignore - render icon component
                   <step.icon className="w-12 h-12 text-zinc-800 dark:text-zinc-200 stroke-[1.5] relative z-10 drop-shadow-lg" />
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                {step.title}
              </h3>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};