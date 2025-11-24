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
      <div className="bg-[#FBFBFD] dark:bg-[#1C1C1E] rounded-[40px] p-8 md:p-12 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Title & Visual */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-10">
               {t.title}
             </h2>

             {/* 3D Shield Visual */}
             <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                {/* Rings */}
                <div className="absolute inset-0 border border-blue-200 dark:border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 border border-blue-100 dark:border-blue-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                
                {/* Floating Particles */}
                <div className="absolute w-full h-full animate-[spin_8s_linear_infinite]">
                   <div className="w-3 h-3 bg-blue-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2 blur-[1px] shadow-lg shadow-blue-500/50" />
                </div>

                {/* Shield Icon */}
                <div className="relative z-10 transform transition-transform duration-500 hover:scale-105 filter drop-shadow-2xl">
                   {/* Shield Shape */}
                   <svg width="140" height="180" viewBox="0 0 24 24" fill="none" stroke="none">
                      <defs>
                         <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#1D4ED8" />
                         </linearGradient>
                      </defs>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#shieldGradient)" />
                   </svg>
                   {/* Lock Icon Overlay */}
                   <div className="absolute inset-0 flex items-center justify-center pb-2">
                      <Lock className="w-12 h-12 text-white/90" strokeWidth={2.5} />
                   </div>
                </div>
                
                {/* Floor Reflection/Shadow */}
                <div className="absolute bottom-10 w-32 h-4 bg-blue-500/20 blur-xl rounded-full" />
             </div>
          </div>

          {/* Right Column: Features List */}
          <div className="flex flex-col justify-center space-y-8">
            {t.items.map((item, i) => (
              <div key={i} className="flex gap-5 items-start group text-left">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mt-1 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white group-hover:scale-110 shadow-sm border border-blue-100 dark:border-blue-500/20 group-hover:border-blue-500">
                  <item.icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1.5 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-[15px] font-normal">
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