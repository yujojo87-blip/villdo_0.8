import React, { useState } from 'react';
import { Sun, Moon, Globe, ChevronDown, Check } from 'lucide-react';
import { InteractiveDemo } from './components/InteractiveDemo';
import { Footer } from './components/Footer';
import { WaveBackground } from './components/WaveBackground';
import { Pricing } from './components/Pricing';
import { About } from './components/About';
import { Privacy } from './components/Privacy';
import { Language } from './types';

// Simple Apple Logo SVG Component
const AppleLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 384 512" fill="currentColor" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
  </svg>
);

const CONTENT = {
  en: {
    title: "Voice Will Do",
    subtitle: "Press",
    subtitleEnd: "to connect everything with voice.",
    beta: "Get Beta",
    download: "Download for Mac",
    version: "v1.0.0 • Apple Silicon & Intel",
    nav: { manifesto: "Product", pricing: "Pricing", about: "About" }
  },
  zh: {
    title: "Voice Will Do",
    subtitle: "按下",
    subtitleEnd: "键，用声音串联一切。",
    beta: "获取内测",
    download: "下载 macOS 版本",
    version: "v1.0.0 • 支持 Apple Silicon & Intel",
    nav: { manifesto: "产品", pricing: "定价", about: "关于" }
  },
  ja: {
    title: "Voice Will Do",
    subtitle: "[Fn] キーを",
    subtitleEnd: "押して、声ですべてをつなぐ。",
    beta: "ベータ版を入手",
    download: "macOS版をダウンロード",
    version: "v1.0.0 • Apple Silicon & Intel",
    nav: { manifesto: "プロダクト", pricing: "料金", about: "概要" }
  }
};

const LANG_OPTIONS: { code: Language; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'zh', label: '中文', short: '中' },
  { code: 'ja', label: '日本語', short: '日' },
];

type Page = 'manifesto' | 'pricing' | 'about';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to Dark Mode
  const [lang, setLang] = useState<Language>('en'); // Default to English
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('manifesto');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const t = CONTENT[lang];

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-zinc-900 dark:text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans transition-colors duration-700">
        <WaveBackground isDarkMode={isDarkMode} />
        
        {/* Minimal Header */}
        <nav className="fixed top-0 w-full z-50 h-[64px] flex items-center justify-between px-6 md:px-8 lg:px-12 bg-[#F5F5F7]/80 dark:bg-black/70 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5 dark:border-white/5 transition-all duration-500">
          <div 
            onClick={() => setCurrentPage('manifesto')}
            className="flex items-center gap-3 font-medium tracking-tight hover:opacity-80 transition-opacity cursor-pointer z-20 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-zinc-800 to-black dark:from-white dark:to-zinc-300 rounded-[8px] shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="w-3 h-3 bg-white dark:bg-black rounded-full" />
            </div>
            <span className="text-zinc-900 dark:text-white text-lg font-semibold tracking-tighter">Villdo</span>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
            <div className="flex p-1 bg-zinc-200/50 dark:bg-white/10 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/5 shadow-inner">
              {(['manifesto', 'pricing', 'about'] as Page[]).map((page) => (
                 <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-6 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]' 
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {t.nav[page]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 z-20">
            {/* Language Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all text-xs font-medium tracking-wide border border-transparent hover:border-black/5 dark:hover:border-white/10"
                aria-label="Switch language"
              >
                 <Globe className="w-3.5 h-3.5" />
                 <span className="uppercase">{LANG_OPTIONS.find(l => l.code === lang)?.short}</span>
                 <ChevronDown className={`w-3 h-3 opacity-50 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white/80 dark:bg-[#1c1c1e]/90 backdrop-blur-xl backdrop-saturate-150 border border-black/5 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-20 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    {LANG_OPTIONS.map((option) => (
                      <button
                        key={option.code}
                        onClick={() => {
                          setLang(option.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`px-4 py-2.5 text-xs text-left flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${
                          lang === option.code 
                            ? 'text-blue-600 dark:text-blue-400 font-medium' 
                            : 'text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        {option.label}
                        {lang === option.code && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all border border-transparent hover:border-black/5 dark:hover:border-white/10"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button className="hidden md:block bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-xs font-semibold hover:scale-105 transition-all shadow-lg shadow-black/10 dark:shadow-white/10">
              {t.beta}
            </button>
          </div>
        </nav>
        
        {/* Mobile Page Navigation (Floating Dock) */}
        <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl backdrop-saturate-150 border border-black/5 dark:border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-1.5 flex gap-1 transform transition-all duration-300 hover:scale-105">
           {(['manifesto', 'pricing', 'about'] as Page[]).map((page) => (
              <button 
               key={page}
               onClick={() => setCurrentPage(page)}
               className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all ${
                 currentPage === page 
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                  : 'text-zinc-500 dark:text-zinc-400'
               }`}
             >
               {t.nav[page]}
             </button>
           ))}
        </div>

        <main className="relative z-10 pt-32 pb-24 px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            {currentPage === 'manifesto' ? (
              <>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-b from-black via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-100 dark:to-zinc-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 leading-[1.1]">
                  {t.title}
                </h1>
                
                <p className="text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-normal mb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-100 tracking-tight max-w-2xl mx-auto leading-relaxed">
                  {t.subtitle} <kbd className="bg-gradient-to-b from-zinc-50 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border border-b-2 border-zinc-300 dark:border-black/50 px-2.5 py-0.5 rounded-[6px] text-zinc-800 dark:text-zinc-200 text-sm mx-1 font-sans shadow-sm font-medium">Fn</kbd> {t.subtitleEnd}
                </p>

                {/* Interactive Demo Container */}
                <div className="animate-in fade-in zoom-in-95 duration-1000 delay-200 mb-32">
                  <InteractiveDemo lang={lang} />
                </div>

                {/* Privacy Section */}
                <div className="mb-32">
                   <Privacy lang={lang} />
                </div>

                {/* Download Button Section */}
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                   <button className="group relative flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black px-10 py-5 rounded-full text-lg font-medium hover:scale-105 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_40px_-12px_rgba(255,255,255,0.3)] transition-all duration-500 ease-out">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <AppleLogo className="w-6 h-6 mb-0.5" />
                      <span className="tracking-tight">{t.download}</span>
                   </button>
                   <span className="mt-6 text-xs font-medium text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">
                      {t.version}
                   </span>
                </div>
              </>
            ) : currentPage === 'pricing' ? (
              <Pricing lang={lang} />
            ) : (
              <About lang={lang} />
            )}
          </div>
          
        </main>

        <Footer lang={lang} />
      </div>
    </div>
  );
};

export default App;