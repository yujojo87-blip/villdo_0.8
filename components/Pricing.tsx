import React from 'react';
import { Check, Sparkles, Info } from 'lucide-react';
import { Language } from '../types';

interface PricingProps {
  lang: Language;
}

const PRICING_CONTENT = {
  en: {
    mostPopular: "Most Popular",
    pro: {
      title: "Pro",
      subtitle: "Best for power users",
      price: "$12",
      currency: "USD",
      period: "/ member / month, billed yearly",
      monthly: "$30 billed monthly",
      button: "Get Started",
      features: [
        "Includes all Free features",
        "Unlimited words per week",
        "Priority feature requests",
        "Early access to new features",
        "Team member management"
      ]
    },
    free: {
      title: "Free",
      subtitle: "Best for beginners",
      price: "$0",
      currency: "USD",
      period: "/ member / month",
      button: "Your Current Plan",
      features: [
        "2,000 words per week",
        "Lightning-fast voice typing",
        "AI auto-editing with transcription",
        "Add words to dictionary",
        "Support 100+ languages"
      ]
    }
  },
  zh: {
    mostPopular: "最受欢迎",
    pro: {
      title: "Pro",
      subtitle: "适合高级用户",
      price: "$12",
      currency: "USD",
      period: "/ 成员 / 月，按年计费",
      monthly: "$30 按月计费时",
      button: "开始使用",
      features: [
        "包含免费版的所有功能",
        "每周无限单词",
        "优先处理功能请求",
        "提前体验新功能",
        "团队成员管理"
      ]
    },
    free: {
      title: "Free",
      subtitle: "适合初学者",
      price: "$0",
      currency: "USD",
      period: "/ 成员 / 月",
      button: "您当前的计划",
      features: [
        "每周 2,000 个单词",
        "闪电般快速的语音输入",
        "带听写的 AI 自动编辑",
        "添加单词到词典",
        "支持 100+ 种语言"
      ]
    }
  },
  ja: {
    mostPopular: "一番人気",
    pro: {
      title: "Pro",
      subtitle: "パワーユーザー向け",
      price: "$12",
      currency: "USD",
      period: "/ メンバー / 月、年払い",
      monthly: "$30 月払いの場合",
      button: "始める",
      features: [
        "無料版の全機能を含む",
        "毎週無制限の単語",
        "機能リクエストの優先対応",
        "新機能への早期アクセス",
        "チームメンバー管理"
      ]
    },
    free: {
      title: "Free",
      subtitle: "初心者向け",
      price: "$0",
      currency: "USD",
      period: "/ メンバー / 月",
      button: "現在のプラン",
      features: [
        "毎週 2,000 単語",
        "電光石火の音声入力",
        "文字起こし付きAI自動編集",
        "辞書への単語追加",
        "100以上の言語をサポート"
      ]
    }
  }
};

export const Pricing: React.FC<PricingProps> = ({ lang }) => {
  const t = PRICING_CONTENT[lang];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16 md:hidden">
        <h2 className="text-3xl font-medium text-zinc-900 dark:text-white mb-4">Pricing</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Pro Plan */}
        <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 ring-4 ring-blue-500/5 dark:ring-blue-500/10">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
          <div className="absolute top-6 right-6 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-blue-100 dark:border-blue-500/20">
             {t.mostPopular} <Sparkles className="w-3 h-3" fill="currentColor" />
          </div>
          <div className="p-8 md:p-10">
            <h3 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">{t.pro.title}</h3>
            <p className="text-zinc-500 text-sm mb-8 font-medium">{t.pro.subtitle}</p>
            
            <div className="flex items-baseline gap-1 mb-2">
               <span className="text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">{t.pro.price}</span>
               <span className="text-xl text-zinc-500 font-medium">{t.pro.currency}</span>
            </div>
            <p className="text-zinc-500 text-sm mb-1">{t.pro.period}</p>
            <p className="text-zinc-400 text-xs mb-8">{t.pro.monthly}</p>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-4 font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 mb-10 text-sm">
              {t.pro.button}
            </button>

            <ul className="space-y-4">
              {t.pro.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={3} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Free Plan */}
        <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-white/5 rounded-[32px] p-8 md:p-10 relative md:top-4">
          <h3 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">{t.free.title}</h3>
          <p className="text-zinc-500 text-sm mb-8 font-medium">{t.free.subtitle}</p>
          
          <div className="flex items-baseline gap-1 mb-2">
             <span className="text-5xl font-bold text-zinc-900 dark:text-white tracking-tight">{t.free.price}</span>
             <span className="text-xl text-zinc-500 font-medium">{t.free.currency}</span>
          </div>
          <p className="text-zinc-500 text-sm mb-1">{t.free.period}</p>
          <div className="h-5 mb-8 hidden md:block"></div> {/* Spacer */}

          <button className="w-full bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 rounded-full py-4 font-medium cursor-default mb-10 transition-colors border border-transparent dark:border-white/5 text-sm">
            {t.free.button}
          </button>

          <ul className="space-y-4">
            {t.free.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                <div className="mt-0.5 w-5 h-5 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-zinc-400 dark:text-zinc-500" strokeWidth={3} />
                </div>
                <div className="flex items-center gap-1.5 group">
                  <span>{feature}</span>
                  {i === 2 && <Info className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-500 transition-colors cursor-help" />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};