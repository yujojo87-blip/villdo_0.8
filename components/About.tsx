import React from 'react';
import { Language } from '../types';
import { Globe, Users, Sparkles, Cpu, Mic, Zap, Trophy, GraduationCap } from 'lucide-react';

interface AboutProps {
  lang: Language;
}

const ABOUT_CONTENT = {
  en: {
    hero: {
      label: "About Us",
      title: "VUIlabs",
      subtitle: "Redefining the Future of Human-Computer Interaction",
    },
    cards: {
      mission: {
        title: "Mission",
        headline: "Listening & Speaking",
        text: "VUIlabs is an innovation leader in Voice AI, building world-leading multimodal conversational models and Agentic AI platforms. We are redefining HCI through continuous technological breakthroughs.",
      },
      team: {
        title: "Leadership",
        headline: "Scientific Excellence",
        text: "Founded by Prof. Yanmin Qian (Changjiang Scholar, SJTU). Our core team unites global top scientists and elite engineers from world-class universities and tech giants.",
      },
      global: {
        title: "Global Vision",
        headline: "Empowering the World",
        text: "More than a tech company, we are an innovation platform cultivating deep roots in North America, Europe, Japan, and Korea to provide high-quality, emotional voice experiences.",
      }
    },
    badges: {
      ledByLabel: "Led By",
      ledByValue: "Prof. Yanmin Qian",
      bgLabel: "Backgrounds",
      bgValue: "Top Global Universities"
    }
  },
  zh: {
    hero: {
      label: "关于我们",
      title: "宇生月伴",
      subtitle: "重新定义人机交互的未来",
    },
    cards: {
      mission: {
        title: "核心使命",
        headline: "以“能听会说”为核心",
        text: "宇生月伴是语音AI领域的创新领航者，专注于打造全球领先的多模态语音对话大模型与Agentic AI平台。我们正通过持续的技术突破，重塑未来的交互方式。",
      },
      team: {
        title: "顶尖团队",
        headline: "科学家领衔创立",
        text: "由知名科学家、长江学者、上海交大钱彦旻教授创立。核心团队汇聚全球顶尖科学家与来自头部大厂的资深精英，共同推动语音AI进入全新阶段。",
      },
      global: {
        title: "全球视野",
        headline: "赋能全球创新平台",
        text: "我们深耕北美、欧洲、日韩等关键市场，不仅仅是一家技术公司，更是赋能全球的创新平台，为用户提供富有情感深度的语音交互体验。",
      }
    },
    badges: {
      ledByLabel: "领衔创立",
      ledByValue: "钱彦旻教授",
      bgLabel: "团队背景",
      bgValue: "世界一流大学"
    }
  },
  ja: {
    hero: {
      label: "私たちについて",
      title: "VUIlabs",
      subtitle: "人間とコンピュータの相互作用を再定義する",
    },
    cards: {
      mission: {
        title: "ミッション",
        headline: "「聞く・話す」を革新する",
        text: "VUIlabsは音声AIのイノベーションリーダーとして、世界最先端のマルチモーダル対話モデルとAgentic AIプラットフォームを構築。技術的ブレークスルーで未来を再定義します。",
      },
      team: {
        title: "リーダーシップ",
        headline: "科学的卓越性",
        text: "著名な科学者であり上海交通大学教授の銭彦旻氏が設立。世界一流大学やテック企業のトップエリートが集結し、音声AIを新たなステージへ押し上げます。",
      },
      global: {
        title: "グローバルビジョン",
        headline: "世界に力を与える",
        text: "北米、欧州、日本、韓国などの主要市場で深く展開。単なる技術企業を超え、感情豊かで高品質な音声体験を世界中のユーザーに提供するイノベーションプラットフォームです。",
      }
    },
    badges: {
      ledByLabel: "リーダー",
      ledByValue: "銭彦旻 教授",
      bgLabel: "バックグラウンド",
      bgValue: "世界トップ大学"
    }
  }
};

export const About: React.FC<AboutProps> = ({ lang }) => {
  const t = ABOUT_CONTENT[lang];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Hero Section */}
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-medium tracking-wider uppercase mb-6 border border-blue-100 dark:border-blue-500/20">
          <Sparkles className="w-3 h-3" />
          {t.hero.label}
        </span>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 relative z-10">
          {t.hero.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed relative z-10">
          {t.hero.subtitle}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr">
        
        {/* Card 1: Mission (Large - Left) */}
        <div className="md:col-span-7 group relative bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
             <Mic className="w-32 h-32 text-purple-500 rotate-12" />
          </div>
          <div className="p-8 md:p-10 flex flex-col h-full relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
               <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">{t.cards.mission.title}</h3>
            <h2 className="text-2xl md:text-3xl font-medium text-zinc-900 dark:text-white mb-4">{t.cards.mission.headline}</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
              {t.cards.mission.text}
            </p>
          </div>
        </div>

        {/* Card 2: Global (Tall - Right) */}
        <div className="md:col-span-5 group relative bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col">
          <div className="absolute -bottom-10 -right-10 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-700">
             <Globe className="w-40 h-40 text-blue-500" />
          </div>
          <div className="p-8 md:p-10 flex flex-col h-full relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
               <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">{t.cards.global.title}</h3>
            <h2 className="text-2xl md:text-3xl font-medium text-zinc-900 dark:text-white mb-4">{t.cards.global.headline}</h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base flex-grow">
              {t.cards.global.text}
            </p>
            
            {/* Visual indicator of markets */}
            <div className="mt-8 flex gap-2 flex-wrap">
               {['North America', 'Europe', 'Japan', 'Korea'].map((region, i) => (
                 <span key={i} className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 text-xs font-medium text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">
                   {region}
                 </span>
               ))}
            </div>
          </div>
        </div>

        {/* Card 3: Team (Wide - Bottom) */}
        <div className="md:col-span-12 group relative bg-white dark:bg-gradient-to-br dark:from-zinc-800 dark:to-black border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl transition-all duration-500 hover:scale-[1.01]">
          {/* Abstract Background Decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {/* Light mode blobs (Subtle) */}
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50/50 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 mix-blend-multiply dark:mix-blend-normal" />
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-50/50 dark:bg-blue-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 mix-blend-multiply dark:mix-blend-normal" />
          </div>

          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start md:items-center">
             <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <Users className="w-5 h-5 text-zinc-900 dark:text-white" />
                   </div>
                   <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t.cards.team.title}</span>
                </div>
                
                <h2 className="text-2xl md:text-4xl font-medium text-zinc-900 dark:text-white mb-6 leading-tight">
                   {t.cards.team.headline}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg max-w-2xl">
                   {t.cards.team.text}
                </p>
             </div>

             {/* Credibility Badges */}
             <div className="flex flex-col gap-4 min-w-[240px]">
                <div className="bg-zinc-50/80 dark:bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-zinc-100 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/15 transition-colors shadow-sm dark:shadow-none">
                   <div className="bg-yellow-100 dark:bg-yellow-500/20 p-2 rounded-lg text-yellow-600 dark:text-yellow-400">
                      <Trophy className="w-5 h-5" />
                   </div>
                   <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{t.badges.ledByLabel}</div>
                      <div className="font-medium text-zinc-900 dark:text-white">{t.badges.ledByValue}</div>
                   </div>
                </div>
                <div className="bg-zinc-50/80 dark:bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-zinc-100 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/15 transition-colors shadow-sm dark:shadow-none">
                   <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                      <GraduationCap className="w-5 h-5" />
                   </div>
                   <div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{t.badges.bgLabel}</div>
                      <div className="font-medium text-zinc-900 dark:text-white">{t.badges.bgValue}</div>
                   </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};