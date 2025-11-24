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
    nav: { manifesto: "Manifesto", pricing: "Pricing", about: "About" }
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
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to Light Mode
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
        <nav className="fixed top-0 w-full z-50 h-24 flex items-center justify-between px-6 md:px-16 bg-gradient-to-b from-[#F5F5F7]/90 to-transparent dark:from-black/90 backdrop-blur-sm pointer-events-none">
          <div 
            onClick={() => setCurrentPage('manifesto')}
            className="pointer-events-auto flex items-center gap-3 font-medium tracking-tight opacity-80 hover:opacity-100 transition-opacity cursor-pointer z-20"
          >
            <div className="w-2 h-2 bg-black dark:bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] dark:shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-colors duration-500" />
            <span className="text-black dark:text-white transition-colors duration-500">Villdo</span>
          </div>

          {/* Center Navigation */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20 hidden md:block">
            <div className="flex gap-1 bg-white/50 dark:bg-white/5 backdrop-blur-md p-1 rounded-full border border-zinc-200/50 dark:border-white/5 shadow-sm">
              <button 
                onClick={() => setCurrentPage('manifesto')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentPage === 'manifesto' 
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {t.nav.manifesto}
              </button>
              <button 
                onClick={() => setCurrentPage('pricing')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentPage === 'pricing' 
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {t.nav.pricing}
              </button>
              <button 
                onClick={() => setCurrentPage('about')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  currentPage === 'about' 
                    ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {t.nav.about}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Dropdown (Alternative to center nav for small screens) - Simplified to just icons or similar if needed, but for now we rely on desktop layout or simple stacking */}

          <div className="pointer-events-auto flex items-center gap-4 z-20">
            {/* Language Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all text-xs font-medium tracking-wide"
                aria-label="Switch language"
              >
                 <Globe className="w-4 h-4" />
                 <span className="uppercase">{LANG_OPTIONS.find(l => l.code === lang)?.short}</span>
                 <ChevronDown className={`w-3 h-3 opacity-50 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white/80 dark:bg-[#1c1c1e]/90 backdrop-blur-xl backdrop-saturate-150 border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-20 flex flex-col py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
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
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 transition-all"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="hidden md:block bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition-all shadow-lg shadow-black/10 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              {t.beta}
            </button>
          </div>
        </nav>
        
        {/* Mobile Page Navigation (Visible only on small screens) */}
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-lg border border-zinc-200 dark:border-white/10 rounded-full shadow-2xl p-1.5 flex gap-1">
           <button 
             onClick={() => setCurrentPage('manifesto')}
             className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${currentPage === 'manifesto' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-500 dark:text-zinc-400'}`}
           >
             {t.nav.manifesto}
           </button>
           <button 
             onClick={() => setCurrentPage('pricing')}
             className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${currentPage === 'pricing' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-500 dark:text-zinc-400'}`}
           >
             {t.nav.pricing}
           </button>
           <button 
             onClick={() => setCurrentPage('about')}
             className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${currentPage === 'about' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-zinc-500 dark:text-zinc-400'}`}
           >
             {t.nav.about}
           </button>
        </div>

        <main className="relative z-10 pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center mb-16">
            {currentPage === 'manifesto' ? (
              <>
                <h1 className="text-5xl md:text-8xl font-medium tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-white/40 animate-in fade-in slide-in-from-bottom-8 duration-1000 transition-all">
                  {t.title}
                </h1>
                
                <p className="text-xl text-zinc-500 dark:text-zinc-500 font-light mb-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                  {t.subtitle} <kbd className="bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 px-2 py-1 rounded text-zinc-600 dark:text-zinc-300 text-sm mx-1 shadow-sm transition-colors font-sans">Fn</kbd> {t.subtitleEnd}
                </p>

                {/* Interactive Demo Container */}
                <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300 mb-20">
                  <InteractiveDemo lang={lang} />
                </div>

                {/* Privacy Section */}
                <Privacy lang={lang} />

                {/* Download Button Section */}
                <div className="flex flex-col items-center mb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 mt-20">
                   <button className="group flex items-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full text-lg font-medium hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-white/20 transition-all duration-300 relative overflow-hidden ease-out">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <AppleLogo className="w-6 h-6 mb-1" />
                      <span>{t.download}</span>
                   </button>
                   <span className="mt-4 text-xs font-medium text-zinc-400 dark:text-zinc-600 tracking-wide">
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