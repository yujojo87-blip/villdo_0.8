import React from 'react';
import { Shield, Lock, Ban, Laptop } from 'lucide-react';
import { Language } from '../types';

const CONTENT = {
  en: {
    title: "Private by design",
    items: [
      {
        title: "Zero data retention",
        desc: "Your voice dictations are private with zero data retention.",
        icon: Shield
      },
      {
        title: "Never store or train on your data",
        desc: "None of your dictation data will be stored or used for model training by us or third party.",
        icon: Ban
      },
      {
        title: "Everything stays local",
        desc: "All history stays local on your device.",
        icon: Laptop
      }
    ]
  },
  zh: {
    title: "隐私至上",
    items: [
      {
        title: "零数据保留",
        desc: "您的语音听写完全私密，我们在服务器上不保留任何数据。",
        icon: Shield
      },
      {
        title: "从不存储或训练您的数据",
        desc: "我们或第三方绝不会存储您的听写数据，也不会将其用于模型训练。",
        icon: Ban
      },
      {
        title: "一切都在本地",
        desc: "所有历史记录都仅保存在您的本地设备上。",
        icon: Laptop
      }
    ]
  },
  ja: {
    title: "プライバシー重視のデザイン",
    items: [
      {
        title: "データ保持ゼロ",
        desc: "音声入力は完全にプライベートであり、データは一切保持されません。",
        icon: Shield
      },
      {
        title: "データの保存・学習利用は一切なし",
        desc: "お客様のディクテーションデータが保存されたり、モデルのトレーニングに使用されたりすることは一切ありません。",
        icon: Ban
      },
      {
        title: "すべてはローカルに",
        desc: "すべての履歴はデバイス内にのみ保存されます。",
        icon: Laptop
      }
    ]
  }
};

export const Privacy: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = CONTENT[lang];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
      {/* Premium Card Container */}
      <div className="bg-white/80 dark:bg-[#151516] rounded-[48px] p-8 md:p-16 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/5 dark:to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Column: Title & Visual */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-zinc-900 dark:text-white mb-12">
               {t.title}
             </h2>

             {/* 3D Shield Visual */}
             <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                {/* Rings */}
                <div className="absolute inset-0 border border-blue-200/50 dark:border-blue-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-8 border border-blue-100/50 dark:border-blue-500/10 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
                
                {/* Floating Particles */}
                <div className="absolute w-full h-full animate-[spin_12s_linear_infinite]">
                   <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2 blur-[1px] shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                </div>

                {/* Shield Icon */}
                <div className="relative z-10 transform transition-transform duration-500 hover:scale-105 filter drop-shadow-2xl">
                   {/* Shield Shape */}
                   <svg width="140" height="180" viewBox="0 0 24 24" fill="none" stroke="none">
                      <defs>
                         <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#2563EB" />
                         </linearGradient>
                      </defs>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#shieldGradient)" />
                   </svg>
                   {/* Lock Icon Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center pb-2">
                      <Lock className="w-12 h-12 text-white/95 drop-shadow-md" strokeWidth={2.5} />
                   </div>
                </div>
                
                {/* Floor Reflection/Shadow */}
                <div className="absolute bottom-10 w-40 h-6 bg-blue-500/20 blur-2xl rounded-full" />
             </div>
          </div>

          {/* Right Column: Features List */}
          <div className="flex flex-col justify-center space-y-10">
            {t.items.map((item, i) => (
              <div key={i} className="flex gap-6 items-start group text-left">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black group-hover:scale-110 shadow-lg shadow-zinc-200/50 dark:shadow-black/20 border border-zinc-100 dark:border-white/5">
                  <item.icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};