import React from 'react';
import { Language } from '../types';

const LINKS = {
  en: { privacy: "Privacy", twitter: "Twitter", contact: "Contact", tagline: "Designed for focus." },
  zh: { privacy: "隐私政策", twitter: "Twitter", contact: "联系我们", tagline: "为专注而设计。" },
  ja: { privacy: "プライバシー", twitter: "Twitter", contact: "お問い合わせ", tagline: "集中のためにデザインされた。" }
};

export const Footer: React.FC<{ lang: Language }> = ({ lang }) => (
  <footer className="py-20 bg-transparent text-center relative z-10 border-t border-zinc-200/50 dark:border-white/5">
    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <p className="mb-6 text-sm text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">{LINKS[lang].tagline}</p>
        <div className="flex justify-center gap-8 mb-8">
        <a href="#" className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">{LINKS[lang].privacy}</a>
        <a href="#" className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">{LINKS[lang].twitter}</a>
        <a href="#" className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">{LINKS[lang].contact}</a>
        </div>
        <p className="text-xs text-zinc-300 dark:text-zinc-700">© 2024 Villdo AI.</p>
    </div>
  </footer>
);