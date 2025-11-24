import React, { useState, useEffect } from 'react';
import { Mic, Keyboard, RefreshCw, ShieldCheck, Zap, Send, MousePointer2, Mail, Loader2, Sparkles, CheckCircle2, TrendingUp, Lightbulb, Coffee, Search, Hash, User, Calendar, AlertCircle, Cloud, Globe, MessageCircle, Play, Pause, Languages, ArrowRightLeft, FileText, FileBarChart, Clock, Paperclip, MoreHorizontal, ChevronLeft, Volume2, X } from 'lucide-react';
import { DemoMode, Language } from '../types';

// Helper component for animated strikethrough
const AnimatedStrike: React.FC<{ children: React.ReactNode; show: boolean }> = ({ children, show }) => (
  <span className="relative inline-block">
    <span className={`transition-opacity duration-300 ${show ? 'opacity-50' : 'opacity-100'}`}>
      {children}
    </span>
    <span 
      className={`absolute top-1/2 left-0 h-[2px] bg-red-500 rounded-full transition-all duration-500 ease-out ${show ? 'w-full' : 'w-0'}`} 
      style={{ transform: 'translateY(-50%)' }}
    />
  </span>
);

// Helper component for animated underline (formatting indicator)
const AnimatedUnderline: React.FC<{ children: React.ReactNode; show: boolean }> = ({ children, show }) => (
  <span className="relative inline-block">
    <span className={`transition-all duration-300 ${show ? 'text-blue-600 dark:text-blue-400' : ''}`}>
      {children}
    </span>
    <span 
      className={`absolute bottom-[1px] left-0 h-[2px] bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500 ease-out ${show ? 'w-full' : 'w-0'}`} 
    />
  </span>
);

// Helper for Audio Waveform Animation
const AudioWaveform = () => (
  <div className="flex items-center gap-0.5 h-3.5 mx-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        className="w-1 bg-white/90 rounded-full animate-wave origin-bottom"
        style={{ 
          height: '100%', 
          animationDelay: `${i * 0.15}s`,
          animationDuration: '1s'
        }} 
      />
    ))}
  </div>
);

// Define rich scenarios for the demo visualization
interface ScenarioData {
  raw: string; // The user's spoken command
  clean: string; // The result text
  context?: string; // Original text/context for translation modes
  renderDiff: (lang: Language, showCorrections: boolean) => React.ReactNode; 
}

const SCENARIOS: Record<Language, Record<DemoMode, ScenarioData>> = {
  en: {
    [DemoMode.PROFESSIONAL_EMAIL]: {
      raw: "I think we should, should probably send the report tomorrow... yeah tomorrow.",
      clean: "I think we should probably send the report tomorrow.",
      renderDiff: (lang, show) => (
        <span>
          I think we should, <AnimatedStrike show={show}>should</AnimatedStrike> probably send the report <AnimatedStrike show={show}>tomorrow... yeah</AnimatedStrike> tomorrow.
        </span>
      )
    },
    [DemoMode.REMOVE_FILLERS]: {
      raw: "So, um, I was thinking we could, like, move it to tomorrow?",
      clean: "I was thinking we could move it to tomorrow?",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>So, um, </AnimatedStrike>I was thinking we could<AnimatedStrike show={show}>, like,</AnimatedStrike> move it to tomorrow?
        </span>
      )
    },
    [DemoMode.REMOVE_ACCENTS]: {
      raw: "I ain't gonna do that, ya know?",
      clean: "I am not going to do that, you know?",
      renderDiff: (lang, show) => (
        <span>
          I <AnimatedStrike show={show}>ain't gonna</AnimatedStrike> <AnimatedUnderline show={show}>am not going to</AnimatedUnderline> do that, <AnimatedStrike show={show}>ya</AnimatedStrike> <AnimatedUnderline show={show}>you</AnimatedUnderline> know?
        </span>
      )
    },
    [DemoMode.SLACK_MESSAGE]: {
      raw: "Let's meet on Friday afternoon. Actually wait, no — let's do Monday morning instead.",
      clean: "Let's meet on Monday morning.",
      renderDiff: (lang, show) => (
        <span>
          Let's meet <AnimatedStrike show={show}>on Friday afternoon. Actually wait, no — let's do</AnimatedStrike> Monday morning<AnimatedStrike show={show}> instead</AnimatedStrike>.
        </span>
      )
    },
    [DemoMode.PERSONAL_NOTE]: {
      raw: "Hey, for tomorrow's meeting, we need to finish the deck — design has two slides left. Also, check slide 4 numbers. Let's send Rachel the final copy before noon.",
      clean: "Tomorrow's Update:\n- Finish deck (waiting on design)\n- Check slide 4 numbers\n- Send Rachel final copy by 12 PM",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>Hey,</AnimatedStrike> <AnimatedUnderline show={show}>for tomorrow's meeting, we need to finish the deck — design has two slides left.</AnimatedUnderline> <AnimatedStrike show={show}>Also,</AnimatedStrike> <AnimatedUnderline show={show}>check slide 4 numbers.</AnimatedUnderline> <AnimatedStrike show={show}>Let's</AnimatedStrike> <AnimatedUnderline show={show}>send Rachel the final copy before noon.</AnimatedUnderline>
        </span>
      )
    },
    [DemoMode.CODE_COMMENT]: { raw: "", clean: "", renderDiff: () => null },
    [DemoMode.CREATIVE_WRITING]: { raw: "", clean: "", renderDiff: () => null },
    // Agent Modes
    [DemoMode.AGENT_EMAIL]: {
      raw: "Read the unread email from my boss, and draft a reply saying I'm working on it.",
      clean: "Subject: Re: Project Update\n\nHi Boss,\n\nI received your email. I am currently working on this and will provide an update shortly.\n\nBest,\n[Your Name]",
      renderDiff: (lang, show) => null
    },
    [DemoMode.AGENT_TWITTER]: {
      raw: "What is the AI community discussing recently? Summarize it for me and draft a tweet.",
      clean: "The AI world is buzzing about Multimodal Agents & 'Thinking' models! 🧠✨ From reasoning capabilities to autonomous workflows, the gap between demo and reality is closing fast. Exciting times ahead! 🚀 #AI #TechTrends #FutureOfWork",
      renderDiff: (lang, show) => null
    },
    [DemoMode.AGENT_CALENDAR]: {
      raw: "Move Tuesday's weekly meeting to Friday at 10 AM, and check for conflicts.",
      clean: "Event Rescheduled: Weekly Sync\nOld: Tue, 2:00 PM\nNew: Fri, 10:00 AM\nStatus: No Conflicts ✅",
      renderDiff: (lang, show) => null
    },
    // Summarize Modes
    [DemoMode.SUMMARIZE_PDF]: {
      context: "Q3_Financial_Report_2024.pdf",
      raw: "Summarize this article for me.",
      clean: "Q3 Financial Highlights:\n• Revenue grew by 15% YoY\n• Net profit margin reached 22%\n• R&D investment increased by $5M\n• Key risks: Market volatility",
      renderDiff: () => null
    },
    [DemoMode.SUMMARIZE_MEETING]: {
      context: "Audio Stream",
      raw: "Take meeting minutes for me.",
      clean: "Meeting Minutes:\n• Topic: Product Launch V2\n• Decision: Launch date set for Nov 15th\n• Action: Design team to finalize assets by Friday\n• Next Sync: Monday 10 AM",
      renderDiff: () => null
    },
    // Translation Modes
    [DemoMode.TRANSLATION_SELECTION]: {
      context: "Quantum computing harnesses the phenomena of quantum mechanics to deliver a huge leap forward in computation to solve certain problems.",
      raw: "Help me translate this.",
      clean: "量子计算利用量子力学现象，在解决特定问题上实现了计算能力的巨大飞跃。",
      renderDiff: () => null
    },
    [DemoMode.TRANSLATION_REPLY_TEXT]: {
      context: "¿Hola, dónde será la reunión del proyecto mañana?", // Spanish: Where is the project meeting tomorrow?
      raw: "Reply based on current language saying it's in Room 303.",
      clean: "La reunión será en la Sala 303 mañana.",
      renderDiff: () => null
    },
    [DemoMode.TRANSLATION_REPLY_VOICE]: {
      context: "AUDIO_MSG", // Placeholder for visual handling
      raw: "Reply based on this saying I understand and will be there.",
      clean: "Compris, je serai là à l'heure.", // French reply
      renderDiff: () => null
    }
  },
  zh: {
    [DemoMode.PROFESSIONAL_EMAIL]: {
      raw: "我觉得我们应该，应该明天发送报告... 对明天。",
      clean: "我觉得我们应该明天发送报告。",
      renderDiff: (lang, show) => (
        <span>
          我觉得我们应该，<AnimatedStrike show={show}>应该</AnimatedStrike>明天发送报告<AnimatedStrike show={show}>... 对明天</AnimatedStrike>。
        </span>
      )
    },
    [DemoMode.REMOVE_FILLERS]: {
      raw: "那个，我觉得吧，嗯，我们其实可以，就是说，明天再去？",
      clean: "我觉得我们可以明天再去？",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>那个，</AnimatedStrike>我觉得<AnimatedStrike show={show}>吧，嗯，</AnimatedStrike>我们<AnimatedStrike show={show}>其实可以，就是说，</AnimatedStrike>明天再去？
        </span>
      )
    },
    [DemoMode.REMOVE_ACCENTS]: {
      raw: "俺寻思这事儿不太行，你瞅瞅咋样？",
      clean: "我觉得这事不太行，你看看怎么样？",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>俺寻思</AnimatedStrike><AnimatedUnderline show={show}>我觉得</AnimatedUnderline>这<AnimatedStrike show={show}>事儿</AnimatedStrike><AnimatedUnderline show={show}>事</AnimatedUnderline>不太行，<AnimatedStrike show={show}>你瞅瞅咋样</AnimatedStrike><AnimatedUnderline show={show}>你看看怎么样</AnimatedUnderline>？
        </span>
      )
    },
    [DemoMode.SLACK_MESSAGE]: {
      raw: "我们约在周五下午。其实等等，不——还是周一早上吧。",
      clean: "我们约在周一早上吧。",
      renderDiff: (lang, show) => (
        <span>
          我们约在<AnimatedStrike show={show}>周五下午。其实等等，不——还是</AnimatedStrike>周一早上吧。
        </span>
      )
    },
    [DemoMode.PERSONAL_NOTE]: {
      raw: "明天的会议，需要搞定演示文稿，设计那边还差两页。还有，核对一下第四页的数据。中午之前把最终版发给 Rachel。",
      clean: "明天会议更新：\n- 完成演示文稿 (设计缺两页)\n- 核对第四页数据\n- 12点前发最终版给 Rachel",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedUnderline show={show}>明天的会议，需要搞定演示文稿，设计那边还差两页。</AnimatedUnderline><AnimatedStrike show={show}>还有，</AnimatedStrike><AnimatedUnderline show={show}>核对一下第四页的数据。</AnimatedUnderline><AnimatedUnderline show={show}>中午之前把最终版发给 Rachel。</AnimatedUnderline>
        </span>
      )
    },
    [DemoMode.CODE_COMMENT]: { raw: "", clean: "", renderDiff: () => null },
    [DemoMode.CREATIVE_WRITING]: { raw: "", clean: "", renderDiff: () => null },
    // Agent Modes
    [DemoMode.AGENT_EMAIL]: {
      raw: "读一下来自老板的未读邮件，然后帮我起草一个回复，说我正在处理",
      clean: "主题：回复：项目更新\n\n老板您好，\n\n已收到您的邮件。我目前正在处理此事，稍后会向您汇报最新进展。\n\n祝好，\n[你的名字]",
      renderDiff: (lang, show) => null
    },
    [DemoMode.AGENT_TWITTER]: {
      raw: "最近 AI 圈在讨论什么？，帮我总结下，并写成一条推文草稿",
      clean: "AI 圈最近炸锅了！🤯 大家的焦点都在“多模态 Agent”和“思考型模型”上。从单纯的对话到自主完成任务，AI 的进化速度简直惊人！🚀 未来已来，你准备好了吗？ #AI #科技趋势 #AgenticAI",
      renderDiff: (lang, show) => null
    },
    [DemoMode.AGENT_CALENDAR]: {
      raw: "帮我把周二下午的周会挪到周五上午十点，顺便查查有没有冲突。",
      clean: "已重新安排：周会\n原时间：周二 下午 2:00\n新时间：周五 上午 10:00\n状态：无冲突 ✅",
      renderDiff: (lang, show) => null
    },
    // Summarize Modes
    [DemoMode.SUMMARIZE_PDF]: {
      context: "2024年Q3财务报告.pdf",
      raw: "帮我总结这篇文章",
      clean: "Q3 财报核心摘要：\n• 营收同比增长 15%\n• 净利润率达到 22%\n• 研发投入增加 500 万美元\n• 潜在风险：市场波动加剧",
      renderDiff: () => null
    },
    [DemoMode.SUMMARIZE_MEETING]: {
      context: "Audio Stream",
      raw: "帮我记做下会议纪要",
      clean: "会议纪要：\n• 议题：V2版本产品发布会\n• 结论：定于11月15日正式上线\n• 待办：设计团队需在周五前定稿素材\n• 下次同步：下周一上午10点",
      renderDiff: () => null
    },
    // Translation Modes
    [DemoMode.TRANSLATION_SELECTION]: {
      context: "Quantum computing harnesses the phenomena of quantum mechanics to deliver a huge leap forward in computation to solve certain problems.",
      raw: "帮我翻译下。",
      clean: "量子计算利用量子力学现象，在解决特定问题上实现了计算能力的巨大飞跃。",
      renderDiff: () => null
    },
    [DemoMode.TRANSLATION_REPLY_TEXT]: {
      context: "¿Hola, dónde será la reunión del proyecto mañana?", // Spanish
      raw: "帮我根据当前语言回复说在303会议室。",
      clean: "La reunión será en la Sala 303 mañana.",
      renderDiff: () => null
    },
    [DemoMode.TRANSLATION_REPLY_VOICE]: {
      context: "AUDIO_MSG",
      raw: "根据当前语言回复他说我明白了，会准时到。",
      clean: "Entendido, estaré allí a tiempo.", // Spanish reply
      renderDiff: () => null
    }
  },
  ja: {
    [DemoMode.PROFESSIONAL_EMAIL]: {
      raw: "えっと、火曜日の会議、体調悪いので、たぶん欠席します。",
      clean: "体調不良のため、火曜日の会議を欠席いたします。",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>えっと、</AnimatedStrike>火曜日の会議、体調悪いので、<AnimatedStrike show={show}>たぶん</AnimatedStrike>欠席します。
        </span>
      )
    },
    [DemoMode.REMOVE_FILLERS]: {
      raw: "あのー、えっと、明日、まあ、移動できるかなと、その、思うんですけど。",
      clean: "明日移動できるかなと思うんですけど。",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>あのー、えっと、</AnimatedStrike>明日、<AnimatedStrike show={show}>まあ、</AnimatedStrike>移動できるかなと、<AnimatedStrike show={show}>その、</AnimatedStrike>思うんですけど。
        </span>
      )
    },
    [DemoMode.REMOVE_ACCENTS]: {
      raw: "これ、やらんほうがええと思うんやけど、どない？",
      clean: "これはやらない方がいいと思うのですが、どうでしょうか？",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>これ、やらんほうがええ</AnimatedStrike><AnimatedUnderline show={show}>これはやらない方がいい</AnimatedUnderline>と思う<AnimatedStrike show={show}>んやけど、どない</AnimatedStrike><AnimatedUnderline show={show}>のですが、どうでしょうか</AnimatedUnderline>？
        </span>
      )
    },
    [DemoMode.SLACK_MESSAGE]: {
      raw: "金曜日の午後に会いましょう。あ、待って、やっぱり月曜日の朝にしましょう。",
      clean: "月曜日の朝にしましょう。",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>金曜日の午後に会いましょう。あ、待って、やっぱり</AnimatedStrike>月曜日の朝にしましょう。
        </span>
      )
    },
    [DemoMode.PERSONAL_NOTE]: {
      raw: "ねえ、明日の会議だけど、資料を完成させなきゃ。デザインがあと2枚残ってるし。あと、スライド4の数字も確認して。正午までにレイチェルに最終版を送ろう。",
      clean: "明日の会議：\n- 資料完成 (デザイン残り2枚)\n- スライド4の数値確認\n- 12時までにレイチェルへ送付",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>ねえ、</AnimatedStrike><AnimatedUnderline show={show}>明日の会議</AnimatedUnderline><AnimatedStrike show={show}>だけど</AnimatedStrike><AnimatedUnderline show={show}>、資料を完成させなきゃ。デザインがあと2枚残ってる</AnimatedUnderline><AnimatedStrike show={show}>し</AnimatedStrike>。<AnimatedStrike show={show}>あと、</AnimatedStrike><AnimatedUnderline show={show}>スライド4の数字も確認して。</AnimatedUnderline><AnimatedStrike show={show}>正午までに</AnimatedStrike><AnimatedUnderline show={show}>レイチェルに最終版を送ろう。</AnimatedUnderline>
        </span>
      )
    },
    [DemoMode.CODE_COMMENT]: { raw: "", clean: "", renderDiff: () => null },
    [DemoMode.CREATIVE_WRITING]: { raw: "", clean: "", renderDiff: () => null },
    // Agent Modes
    [DemoMode.AGENT_EMAIL]: {
      raw: "上司からの未読メールを読んで、対応中であるという返信の下書きを作って。",
      clean: "件名: Re: プロジェクトの更新について\n\nお疲れ様です。\n\nメールを拝受いたしました。現在対応中ですので、進捗があり次第すぐにご報告させていただきます。\n\nよろしくお願いいたします。\n[あなたの名前]",
      renderDiff: (lang, show) => null
    },
    [DemoMode.AGENT_TWITTER]: {
      raw: "最近のAI界隈のトレンドは？要約してツイートの下書きを作って。",
      clean: "AI界隈が熱い！🔥 今の注目は「マルチモーダルAgent」と「思考するモデル」。単なる対話から、自律的なタスク実行へ。進化のスピードが凄まじいですね🚀 未来はもうすぐそこに！ #AI #テックトレンド #AgenticAI",
      renderDiff: (lang, show) => null
    },
    [DemoMode.AGENT_CALENDAR]: {
      raw: "火曜日の午後の定例会議を金曜日の午前10時に移動して。あと、重複がないか確認して。",
      clean: "再スケジュール：定例会議\n変更前：火曜日 14:00\n変更後：金曜日 10:00\nステータス：競合なし ✅",
      renderDiff: (lang, show) => null
    },
    // Summarize Modes
    [DemoMode.SUMMARIZE_PDF]: {
      context: "2024_Q3_Financial_Report.pdf",
      raw: "この記事を要約して。",
      clean: "Q3 決算ハイライト：\n• 売上高は前年比15%増\n• 純利益率は22%に到達\n• 研究開発費を500万ドル増額\n• 主なリスク：市場変動の拡大",
      renderDiff: () => null
    },
    [DemoMode.SUMMARIZE_MEETING]: {
      context: "Audio Stream",
      raw: "議事録をとって。",
      clean: "議事録：\n• 議題：製品V2のローンチについて\n• 決定事項：11月15日に正式リリース決定\n• アクション：デザインチームは金曜までに素材を完成\n• 次回定例：来週月曜 午前10時",
      renderDiff: () => null
    },
    // Translation Modes
    [DemoMode.TRANSLATION_SELECTION]: {
      context: "Quantum computing harnesses the phenomena of quantum mechanics to deliver a huge leap forward in computation to solve certain problems.",
      raw: "これを翻訳して。",
      clean: "量子コンピューティングは、量子力学の現象を利用して、特定の問題を解決するための計算能力に飛躍的な進歩をもたらします。",
      renderDiff: () => null
    },
    [DemoMode.TRANSLATION_REPLY_TEXT]: {
      context: "¿Hola, dónde será la reunión del proyecto mañana?", // Spanish
      raw: "303号室です、と現地の言葉で返信して。",
      clean: "La reunión será en la Sala 303 mañana.",
      renderDiff: () => null
    },
    [DemoMode.TRANSLATION_REPLY_VOICE]: {
      context: "AUDIO_MSG",
      raw: "了解、時間通りに行きます、と現地の言葉で返信して。",
      clean: "Entendido, estaré allí a tiempo.", // Spanish reply
      renderDiff: () => null
    }
  }
};

const CATEGORY_CONFIG = [
  {
    id: 'transcribe',
    label: { en: "Transcribe", zh: "语音转写", ja: "文字起こし" },
    modes: [DemoMode.PROFESSIONAL_EMAIL, DemoMode.SLACK_MESSAGE, DemoMode.PERSONAL_NOTE]
  },
  {
    id: 'translation',
    label: { en: "Translation", zh: "多语言翻译", ja: "多言語翻訳" },
    modes: [DemoMode.TRANSLATION_SELECTION, DemoMode.TRANSLATION_REPLY_TEXT, DemoMode.TRANSLATION_REPLY_VOICE]
  },
  {
    id: 'summarize',
    label: { en: "Summarize", zh: "总结摘要", ja: "要約" },
    modes: [DemoMode.SUMMARIZE_PDF, DemoMode.SUMMARIZE_MEETING]
  },
  {
    id: 'agent',
    label: { en: "Agent Mode", zh: "Agent模式", ja: "Agentモード" },
    modes: [DemoMode.AGENT_EMAIL, DemoMode.AGENT_TWITTER, DemoMode.AGENT_CALENDAR],
    comingSoon: true
  }
];

const MODE_LABELS: Record<Language, Record<DemoMode, string>> = {
  en: {
    [DemoMode.PROFESSIONAL_EMAIL]: "Refine Email",
    [DemoMode.SLACK_MESSAGE]: "Refine Message",
    [DemoMode.PERSONAL_NOTE]: "Refine Note",
    [DemoMode.REMOVE_FILLERS]: "Remove Fillers",
    [DemoMode.REMOVE_ACCENTS]: "Fix Grammar",
    [DemoMode.CODE_COMMENT]: "Code Comment",
    [DemoMode.CREATIVE_WRITING]: "Creative Writing",
    [DemoMode.AGENT_EMAIL]: "Draft Email",
    [DemoMode.AGENT_TWITTER]: "Draft Tweet",
    [DemoMode.AGENT_CALENDAR]: "Manage Calendar",
    [DemoMode.TRANSLATION_SELECTION]: "Translate",
    [DemoMode.TRANSLATION_REPLY_TEXT]: "Reply Text",
    [DemoMode.TRANSLATION_REPLY_VOICE]: "Reply Voice",
    [DemoMode.SUMMARIZE_PDF]: "Summarize PDF",
    [DemoMode.SUMMARIZE_MEETING]: "Meeting Minutes"
  },
  zh: {
    [DemoMode.PROFESSIONAL_EMAIL]: "邮件润色",
    [DemoMode.SLACK_MESSAGE]: "消息润色",
    [DemoMode.PERSONAL_NOTE]: "笔记润色",
    [DemoMode.REMOVE_FILLERS]: "去除口语",
    [DemoMode.REMOVE_ACCENTS]: "语法修正",
    [DemoMode.CODE_COMMENT]: "代码注释",
    [DemoMode.CREATIVE_WRITING]: "创意写作",
    [DemoMode.AGENT_EMAIL]: "起草邮件",
    [DemoMode.AGENT_TWITTER]: "起草推文",
    [DemoMode.AGENT_CALENDAR]: "管理日程",
    [DemoMode.TRANSLATION_SELECTION]: "选中翻译",
    [DemoMode.TRANSLATION_REPLY_TEXT]: "文本回复",
    [DemoMode.TRANSLATION_REPLY_VOICE]: "语音回复",
    [DemoMode.SUMMARIZE_PDF]: "PDF总结",
    [DemoMode.SUMMARIZE_MEETING]: "会议纪要"
  },
  ja: {
    [DemoMode.PROFESSIONAL_EMAIL]: "メール推敲",
    [DemoMode.SLACK_MESSAGE]: "チャット推敲",
    [DemoMode.PERSONAL_NOTE]: "メモ推敲",
    [DemoMode.REMOVE_FILLERS]: "フィラー除去",
    [DemoMode.REMOVE_ACCENTS]: "文法修正",
    [DemoMode.CODE_COMMENT]: "コードコメント",
    [DemoMode.CREATIVE_WRITING]: "クリエイティブ",
    [DemoMode.AGENT_EMAIL]: "メール起草",
    [DemoMode.AGENT_TWITTER]: "ツイート作成",
    [DemoMode.AGENT_CALENDAR]: "予定管理",
    [DemoMode.TRANSLATION_SELECTION]: "翻訳",
    [DemoMode.TRANSLATION_REPLY_TEXT]: "テキスト返信",
    [DemoMode.TRANSLATION_REPLY_VOICE]: "音声返信",
    [DemoMode.SUMMARIZE_PDF]: "PDF要約",
    [DemoMode.SUMMARIZE_MEETING]: "議事録作成"
  }
};

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({ lang }) => {
  const [activeCategory, setActiveCategory] = useState('transcribe');
  const [activeMode, setActiveMode] = useState(DemoMode.PROFESSIONAL_EMAIL);
  
  // 0: Idle (Wait for Fn), 1: Recording (User speaking), 2: Processing (Thinking), 3: Result (Output)
  const [step, setStep] = useState(0); 

  // Auto-play loop logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runSequence = () => {
      // 1. Idle phase (1.5s)
      setStep(0);
      timeout = setTimeout(() => {
        // 2. Recording phase (2s) - Typing the raw input
        setStep(1);
        timeout = setTimeout(() => {
          // 3. Processing phase (1.5s) - Spinner
          setStep(2);
          timeout = setTimeout(() => {
            // 4. Result phase (4s) - Show result
            setStep(3);
            timeout = setTimeout(() => {
              // Loop back
              runSequence();
            }, 6000);
          }, 1500);
        }, 2000);
      }, 1500);
    };

    runSequence();

    return () => clearTimeout(timeout);
  }, [activeMode]); // Restart when mode changes

  // Update active mode when category changes
  useEffect(() => {
    const category = CATEGORY_CONFIG.find(c => c.id === activeCategory);
    if (category && category.modes.length > 0) {
      setActiveMode(category.modes[0]);
    }
  }, [activeCategory]);

  const scenario = SCENARIOS[lang][activeMode];
  const isAgent = activeMode.startsWith('Agent');
  const isSummarize = activeMode === DemoMode.SUMMARIZE_PDF || activeMode === DemoMode.SUMMARIZE_MEETING;
  const isTranslate = activeMode.startsWith('Translation');
  
  // Custom render logic based on mode type
  const renderContent = () => {
    // 1. Idle State: Show Context or Placeholder
    if (step === 0) {
      if (isSummarize) {
         return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4 animate-in fade-in duration-500">
               {activeMode === DemoMode.SUMMARIZE_PDF ? (
                 <div className="w-24 h-32 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center justify-center flex-col gap-2 p-2 relative shadow-sm">
                    <div className="absolute top-0 right-0 p-2">
                       <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                    <FileText className="w-8 h-8 text-red-500/60" />
                    <span className="text-[10px] text-center font-medium text-red-700 dark:text-red-300 leading-tight line-clamp-2">
                      {scenario.context}
                    </span>
                 </div>
               ) : (
                  <div className="w-24 h-24 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-full flex items-center justify-center relative animate-pulse-slow">
                     <Mic className="w-8 h-8 text-blue-500/60" />
                  </div>
               )}
               <p className="text-sm font-medium opacity-70">
                 {lang === 'zh' ? '按下 Fn 键...' : lang === 'ja' ? 'Fnキーを押して...' : 'Press Fn...'}
               </p>
            </div>
         );
      }
      if (isTranslate && scenario.context && activeMode !== DemoMode.TRANSLATION_REPLY_VOICE) {
         return (
            <div className="flex flex-col justify-center h-full text-left px-4 animate-in fade-in duration-500">
               <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Original Context</span>
               <p className="text-lg text-zinc-500 dark:text-zinc-400 font-serif italic leading-relaxed">
                  "{scenario.context}"
               </p>
            </div>
         );
      }
      return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-300 dark:text-zinc-600 gap-3">
          <Keyboard className="w-12 h-12 stroke-[1]" />
          <p className="text-sm font-medium">Waiting for input...</p>
        </div>
      );
    }

    // 2. Recording State: Show user input
    if (step === 1) {
      return (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in-95 duration-300 relative">
          {/* For Summarize: Show Voice Command Overlay over Context */}
          {isSummarize ? (
            <>
               <div className="absolute inset-0 flex items-center justify-center opacity-30 blur-sm scale-90">
                  {/* Background context faded */}
                  {activeMode === DemoMode.SUMMARIZE_PDF ? (
                    <FileText className="w-20 h-20 text-zinc-300" />
                  ) : (
                    <Mic className="w-20 h-20 text-zinc-300" />
                  )}
               </div>
               <div className="z-10 bg-white dark:bg-zinc-800 shadow-2xl border border-zinc-100 dark:border-zinc-700 px-6 py-4 rounded-2xl flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-lg font-medium text-zinc-800 dark:text-white">
                    {scenario.raw}
                  </p>
                  <AudioWaveform />
               </div>
            </>
          ) : (
            <>
              <div className="mb-6 p-4 bg-blue-500/10 rounded-full">
                <Mic className="w-8 h-8 text-blue-500 animate-pulse" />
              </div>
              <p className="text-xl md:text-2xl text-zinc-900 dark:text-white font-medium text-center px-8 leading-relaxed">
                "{scenario.raw}"
              </p>
            </>
          )}
        </div>
      );
    }

    // 3. Processing State
    if (step === 2) {
      return (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-20 animate-pulse" />
            <Loader2 className="w-10 h-10 text-zinc-400 animate-spin relative z-10" />
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-500 animate-pulse">
            {lang === 'zh' ? 'Villdo 思考中...' : lang === 'ja' ? 'Villdo 考え中...' : 'Villdo is thinking...'}
          </p>
        </div>
      );
    }

    // 4. Result State
    return (
      <div className="h-full flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 text-left px-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
             {MODE_LABELS[lang][activeMode] || 'Refined'}
          </span>
        </div>
        
        {isAgent || isSummarize || isTranslate ? (
          <div className="bg-zinc-50 dark:bg-black/20 rounded-xl p-6 border border-zinc-100 dark:border-white/5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300 shadow-inner">
            {scenario.clean}
          </div>
        ) : (
          <div className="text-xl md:text-2xl text-zinc-900 dark:text-white leading-relaxed">
             {scenario.renderDiff(lang, true)}
          </div>
        )}

        <div className="mt-6 flex gap-2">
           <button className="text-xs font-medium bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 transition-colors">
              Copy
           </button>
           <button className="text-xs font-medium bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 px-3 py-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 transition-colors">
              Insert
           </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* Category Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-zinc-100 dark:bg-white/5 p-1 rounded-full border border-zinc-200/50 dark:border-white/5 shadow-sm overflow-x-auto max-w-full">
          {CATEGORY_CONFIG.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                 setActiveCategory(cat.id);
                 setStep(0); // Reset animation
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selector (Pills) */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
         {CATEGORY_CONFIG.find(c => c.id === activeCategory)?.modes.map(mode => (
            <button
               key={mode}
               onClick={() => {
                  setActiveMode(mode);
                  setStep(0);
               }}
               className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  activeMode === mode
                     ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400'
                     : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5'
               }`}
            >
               {MODE_LABELS[lang][mode]}
            </button>
         ))}
      </div>

      {/* Main Demo Display Area */}
      <div className="relative bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-black/50 overflow-hidden transition-all duration-500 h-[400px] md:h-[320px]">
        
        {/* Top Bar (Mac Traffic Lights) */}
        <div className="absolute top-0 left-0 w-full h-12 border-b border-zinc-100 dark:border-white/5 flex items-center px-4 gap-2 z-20 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
           <div className="w-3 h-3 rounded-full bg-red-400/80" />
           <div className="w-3 h-3 rounded-full bg-amber-400/80" />
           <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
           <div className="ml-4 px-3 py-1 bg-zinc-100 dark:bg-white/5 rounded-md flex items-center gap-2">
              {step === 1 ? <Mic className="w-3 h-3 text-red-500 animate-pulse" /> : <MousePointer2 className="w-3 h-3 text-zinc-400" />}
              <span className="text-[10px] text-zinc-400 font-mono tracking-wide uppercase">
                 {step === 0 ? 'Idle' : step === 1 ? 'Listening' : step === 2 ? 'Processing' : 'Done'}
              </span>
           </div>
        </div>

        {/* Content Area */}
        <div className="pt-12 p-8 h-full relative text-left">
           {renderContent()}
        </div>

        {/* Progress Bar (at bottom) */}
        <div className="absolute bottom-0 left-0 h-1 bg-blue-500/20 w-full">
           <div 
             className="h-full bg-blue-500 transition-all duration-300 ease-linear"
             style={{ 
               width: `${step === 0 ? 0 : step === 1 ? 33 : step === 2 ? 66 : 100}%`,
               opacity: step === 0 ? 0 : 1
             }}
           />
        </div>

      </div>
    </div>
  );
};