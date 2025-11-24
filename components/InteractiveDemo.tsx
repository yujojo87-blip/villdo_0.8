import React, { useState, useEffect } from 'react';
import { Mic, Keyboard, RefreshCw, ShieldCheck, Zap, Send, MousePointer2, Mail, Loader2, Sparkles, CheckCircle2, TrendingUp, Lightbulb, Coffee, Search, Hash, User, Calendar, AlertCircle, Cloud, Globe, MessageCircle, Play, Pause, Languages, ArrowRightLeft } from 'lucide-react';
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
    [DemoMode.CODE_COMMENT]: {
      raw: "so this function basically takes the user id and then it checks the database to see if they exist",
      clean: "Checks database for existence of provided User ID.",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>so</AnimatedStrike> this function <AnimatedStrike show={show}>basically</AnimatedStrike> takes the user id <AnimatedStrike show={show}>and then it</AnimatedStrike> checks the database to see if they exist
        </span>
      )
    },
    [DemoMode.CREATIVE_WRITING]: { raw: "", clean: "", renderDiff: () => null }, // Deprecated
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
    [DemoMode.CODE_COMMENT]: {
      raw: "所以这个函数基本上就是获取用户id然后额去查数据库看他们存不存在",
      clean: "根据用户 ID 检查数据库中是否存在该用户。",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>所以</AnimatedStrike>这个函数<AnimatedStrike show={show}>基本上就是</AnimatedStrike>获取用户id<AnimatedStrike show={show}>然后额去</AnimatedStrike>查数据库看他们存不存在
        </span>
      )
    },
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
    [DemoMode.CODE_COMMENT]: {
      raw: "つまりこの関数は、ユーザーIDをとって、データベースにいるか見るやつです。",
      clean: "ユーザーIDがデータベースに存在するか確認する。",
      renderDiff: (lang, show) => (
        <span>
          <AnimatedStrike show={show}>つまり</AnimatedStrike>この関数は、ユーザーIDをとって、データベースにいるか見る<AnimatedStrike show={show}>やつです</AnimatedStrike>。
        </span>
      )
    },
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
    modes: [DemoMode.CODE_COMMENT]
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
    [DemoMode.PROFESSIONAL_EMAIL]: "Removes Repetition",
    [DemoMode.REMOVE_FILLERS]: "Removes Filler",
    [DemoMode.REMOVE_ACCENTS]: "Remove Accents",
    [DemoMode.SLACK_MESSAGE]: "Understand Intent",
    [DemoMode.PERSONAL_NOTE]: "Structuring",
    [DemoMode.CODE_COMMENT]: "Summarizing",
    [DemoMode.CREATIVE_WRITING]: "Polishing",
    [DemoMode.AGENT_EMAIL]: "Email",
    [DemoMode.AGENT_TWITTER]: "X (Twitter)",
    [DemoMode.AGENT_CALENDAR]: "Calendar",
    [DemoMode.TRANSLATION_SELECTION]: "Web Translation",
    [DemoMode.TRANSLATION_REPLY_TEXT]: "Text Reply",
    [DemoMode.TRANSLATION_REPLY_VOICE]: "Voice Reply"
  },
  zh: {
    [DemoMode.PROFESSIONAL_EMAIL]: "去除重复",
    [DemoMode.REMOVE_FILLERS]: "去除语气词",
    [DemoMode.REMOVE_ACCENTS]: "去除口音",
    [DemoMode.SLACK_MESSAGE]: "理解意图",
    [DemoMode.PERSONAL_NOTE]: "智能结构",
    [DemoMode.CODE_COMMENT]: "总结摘要",
    [DemoMode.CREATIVE_WRITING]: "润色优化",
    [DemoMode.AGENT_EMAIL]: "邮箱",
    [DemoMode.AGENT_TWITTER]: "X (Twitter)",
    [DemoMode.AGENT_CALENDAR]: "日程",
    [DemoMode.TRANSLATION_SELECTION]: "网页翻译",
    [DemoMode.TRANSLATION_REPLY_TEXT]: "外文回复",
    [DemoMode.TRANSLATION_REPLY_VOICE]: "语音回复"
  },
  ja: {
    [DemoMode.PROFESSIONAL_EMAIL]: "重複削除",
    [DemoMode.REMOVE_FILLERS]: "言い淀み削除",
    [DemoMode.REMOVE_ACCENTS]: "方言修正",
    [DemoMode.SLACK_MESSAGE]: "意図理解",
    [DemoMode.PERSONAL_NOTE]: "構造化",
    [DemoMode.CODE_COMMENT]: "要約",
    [DemoMode.CREATIVE_WRITING]: "文章推敲",
    [DemoMode.AGENT_EMAIL]: "メール",
    [DemoMode.AGENT_TWITTER]: "X (Twitter)",
    [DemoMode.AGENT_CALENDAR]: "カレンダー",
    [DemoMode.TRANSLATION_SELECTION]: "Web翻訳",
    [DemoMode.TRANSLATION_REPLY_TEXT]: "チャット返信",
    [DemoMode.TRANSLATION_REPLY_VOICE]: "音声返信"
  }
};

const UI_TEXT: Record<Language, any> = {
  en: {
    tryIt: "Try it yourself",
    pressMic: "Press the microphone button below and read:",
    listening: "Listening...",
    reset: "Reset",
    analysis: "Analysis",
    micError: "Microphone access denied. Please check permissions.",
    // Translation Demo
    translationDemo: {
      selTitle: "Selection Translation",
      selDesc: "Browse any webpage, select unknown text, and ask Villdo to translate instantly via popup.",
      replyTitle: "Native Reply",
      replyDesc: "Select a foreign message, speak your reply in your language, and Villdo writes it in theirs.",
      voiceTitle: "Voice Analysis",
      voiceDesc: "Listen to foreign voice messages, analyze via ASR, and reply fluently in the sender's language.",
      translating: "Translating...",
      analyzingAudio: "ASR & Analyzing...",
      generatingReply: "Generating Native Reply..."
    },
    // Agent Email Specific
    agentEmailDemo: {
      input: "Read the unread email from my boss, and draft a reply saying I'm working on it.",
      cap1Title: "Voice Operation",
      cap1Desc: "Support checking emails and instantly transforming your dictation into professional drafts (Draft Mode).",
      cap2Title: "Safety Boundary",
      cap2Desc: "Adhere to 'Assist, not assume'. We draft, you decide when to send.",
      contextFinding: "Found 1 unread email from 'Boss'",
      contextAction: "Drafting response..."
    },
    // Agent Twitter Specific
    agentTwitterDemo: {
      input: "What is the AI community discussing recently? Summarize it for me and draft a tweet.",
      cap1Title: "Trend Briefing",
      cap1Desc: "Stop scrolling. One sentence to get global tech & industry summaries.",
      cap2Title: "Instant Inspiration",
      cap2Desc: "Capture fleeting ideas. Voice input -> AI polish -> Tweet draft.",
      cap3Title: "Anti-Anxiety",
      cap3Desc: "High-value info only. Save time for thinking and creating.",
      scanning: "Scanning Trending Topics...",
      drafting: "Generating Draft..."
    },
    // Agent Calendar Specific
    agentCalendarDemo: {
      input: "Move Tuesday's weekly meeting to Friday at 10 AM, and check for conflicts.",
      cap1Title: "Natural Language Scheduling",
      cap1Desc: "No manual clicking. Schedule events just like talking to a secretary.",
      cap2Title: "Smart Conflict Detection",
      cap2Desc: "MCP connects to calendar data in real-time, identifying conflicts instantly.",
      cap3Title: "Seamless Sync",
      cap3Desc: "Instantly syncs to all your devices after voice confirmation. Stable and reliable.",
      checking: "Checking Calendar...",
      moving: "Rescheduling & Checking Conflicts..."
    }
  },
  zh: {
    tryIt: "亲自试一试",
    pressMic: "点击右下角的麦克风按钮，并朗读：",
    listening: "正在聆听...",
    reset: "重置",
    analysis: "分析演示",
    micError: "无法访问麦克风，请检查权限。",
     // Translation Demo
    translationDemo: {
      selTitle: "划词翻译",
      selDesc: "浏览网页时选中不懂的文字，语音指令直接唤起悬浮翻译弹窗。",
      replyTitle: "母语回复",
      replyDesc: "选中外语消息，用中文口述回复，Villdo 自动以对方语言写入回复。",
      voiceTitle: "语音分析",
      voiceDesc: "收到外语语音条？自动进行 ASR 识别并生成地道的原语言回复。",
      translating: "正在翻译...",
      analyzingAudio: "ASR 识别与分析中...",
      generatingReply: "正在生成外文回复..."
    },
    // Agent Email Specific
    agentEmailDemo: {
      input: "读一下来自老板的未读邮件，然后帮我起草一个回复，说我正在处理",
      cap1Title: "语音操作",
      cap1Desc: "支持查收邮件，并将您的口述瞬间转化为商务风格的邮件草稿 (Draft Mode)。",
      cap2Title: "安全边界",
      cap2Desc: "坚持“辅助而不越权”。我们负责起草，发送权永远在您手中。",
      contextFinding: "已发现 1 封来自“老板”的未读邮件",
      contextAction: "正在根据上下文起草..."
    },
    // Agent Twitter Specific
    agentTwitterDemo: {
      input: "最近 AI 圈在讨论什么？，帮我总结下，并写成一条推文草稿",
      cap1Title: "趋势听报",
      cap1Desc: "告别无休止的信息流滑动。一句话，获取全球科技与行业热点摘要。",
      cap2Title: "灵感速记",
      cap2Desc: "抓住稍纵即逝的灵感。语音输入，AI 自动润色并生成推文草稿。",
      cap3Title: "拒绝焦虑",
      cap3Desc: "只获取高价值信息，把时间留给思考与创作。",
      scanning: "正在扫描热点话题...",
      drafting: "正在生成推文..."
    },
    // Agent Calendar Specific
    agentCalendarDemo: {
      input: "帮我把周二下午的周会挪到周五上午十点，顺便查查有没有冲突。",
      cap1Title: "自然语言排期",
      cap1Desc: "无需手动点击，像和秘书对话一样安排日程。",
      cap2Title: "智能冲突检测",
      cap2Desc: "MCP 实时连接日历数据，瞬间识别时间冲突并提供最优建议。",
      cap3Title: "无缝同步",
      cap3Desc: "语音确认后，即刻同步至您的所有设备，稳定可靠。",
      checking: "正在检查日程...",
      moving: "正在重新安排并检查冲突..."
    }
  },
  ja: {
    tryIt: "試してみる",
    pressMic: "下のマイクボタンを押して、読み上げてください：",
    listening: "聞き取り中...",
    reset: "リセット",
    analysis: "分析プロセス",
    micError: "マイクへのアクセスが拒否されました。権限を確認してください。",
    // Translation Demo
    translationDemo: {
      selTitle: "選択翻訳",
      selDesc: "Web閲覧中、不明なテキストを選択して話しかけるだけで、ポップアップ翻訳を表示。",
      replyTitle: "ネイティブ返信",
      replyDesc: "外国語のメッセージを選択し、母国語で返信を話すと、相手の言語で自動入力。",
      voiceTitle: "音声分析",
      voiceDesc: "外国語のボイスメッセージをASR分析し、送信者の言語で流暢に返信を作成。",
      translating: "翻訳中...",
      analyzingAudio: "ASR分析中...",
      generatingReply: "ネイティブ返信を作成中..."
    },
    // Agent Email Specific
    agentEmailDemo: {
      input: "上司からの未読メールを読んで、対応中であるという返信の下書きを作って",
      cap1Title: "音声操作",
      cap1Desc: "メールの確認から、口述内容を即座にビジネスメールの下書き(Draft Mode)へ変換することをサポートします。",
      cap2Title: "安全の境界線",
      cap2Desc: "「推測ではなく支援」を徹底。AIが下書きを作成し、送信の最終決定権は常にあなたの手にあります。",
      contextFinding: "「上司」からの未読メールを1件確認",
      contextAction: "文脈に基づいて下書きを作成中..."
    },
    // Agent Twitter Specific
    agentTwitterDemo: {
      input: "最近のAI界隈のトレンドは？要約してツイートの下書きを作って。",
      cap1Title: "トレンド把握",
      cap1Desc: "無限スクロールは不要。一言で世界のテックトレンドを要約。",
      cap2Title: "瞬時のひらめき",
      cap2Desc: "音声入力からAIが自動でツイートを作成。アイデアを逃しません。",
      cap3Title: "不安を解消",
      cap3Desc: "高価値な情報だけを取得し、思考と創作に時間を。",
      scanning: "トレンドをスキャン中...",
      drafting: "ドラフトを作成中..."
    },
    // Agent Calendar Specific
    agentCalendarDemo: {
      input: "火曜日の午後の定例会議を金曜日の午前10時に移動して。あと、重複がないか確認して。",
      cap1Title: "自然言語スケジューリング",
      cap1Desc: "手動入力は不要。秘書に話しかけるように予定を管理できます。",
      cap2Title: "スマートな競合検出",
      cap2Desc: "MCPがリアルタイムでカレンダーを分析。重複を即座に検出し、最適な時間を提案します。",
      cap3Title: "シームレス同期",
      cap3Desc: "音声で確認後、すべてのデバイスに即座に同期されます。",
      checking: "予定を確認中...",
      moving: "再スケジュールと競合を確認中..."
    }
  }
};

interface InteractiveDemoProps {
  lang: Language;
}

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({ lang }) => {
  const [selectedMode, setSelectedMode] = useState<DemoMode>(DemoMode.PROFESSIONAL_EMAIL);
  // Stages: 0:Start, 1:Typing, 2:Done/Pause, 3:Correction, 4:Result
  const [animStage, setAnimStage] = useState(0); 
  const [displayedRaw, setDisplayedRaw] = useState("");
  const [editorText, setEditorText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  // Agent & Translation Demo State
  // 0: Idle
  // 1: Interaction (Selection/Play)
  // 2: Recording Input
  // 3: Processing
  // 4: Show Result
  // 5: Highlight Action (Optional)
  const [agentStep, setAgentStep] = useState(0);

  const scenario = SCENARIOS[lang][selectedMode];
  const ui = UI_TEXT[lang];

  // Derive active category from selected mode
  const activeCategory = CATEGORY_CONFIG.find(cat => cat.modes.includes(selectedMode));
  const isAgentMode = activeCategory?.id === 'agent';
  const isTranslationMode = activeCategory?.id === 'translation';
  const isComplexMode = isAgentMode || isTranslationMode;

  // --- Animation Loop (Left Side - Transcribe) ---
  useEffect(() => {
    if (isComplexMode) {
      setAnimStage(0);
      return;
    }

    let typingInterval: ReturnType<typeof setInterval>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;
    let t4: ReturnType<typeof setTimeout>;

    setAnimStage(0);
    setDisplayedRaw("");
    
    const rawText = scenario.raw;
    let charIndex = 0;

    // Start typing slightly faster
    const startDelay = setTimeout(() => {
      setAnimStage(1);
      typingInterval = setInterval(() => {
        if (charIndex < rawText.length) {
          setDisplayedRaw(rawText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setAnimStage(2); // Typing done
          
          // Trigger Correction
          t3 = setTimeout(() => setAnimStage(3), 400);
          // Show Result
          t4 = setTimeout(() => setAnimStage(4), 1200);
        }
      }, 20);
    }, 100);

    return () => {
      clearTimeout(startDelay);
      clearInterval(typingInterval);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [selectedMode, lang, isComplexMode]);

  // --- Animation Loop (Agent & Translation Demo) ---
  useEffect(() => {
    if (!isComplexMode) {
      setAgentStep(0);
      return;
    }
    
    // SEQUENCE for TRANSLATION MODES
    if (selectedMode === DemoMode.TRANSLATION_SELECTION || 
        selectedMode === DemoMode.TRANSLATION_REPLY_TEXT || 
        selectedMode === DemoMode.TRANSLATION_REPLY_VOICE) {
      
      setAgentStep(0);
      // Step 1: Simulate User Selection or Playing Audio
      const t0 = setTimeout(() => setAgentStep(1), 500);
      // Step 2: Trigger FN/Mic (Simulated Recording)
      const t1 = setTimeout(() => setAgentStep(2), 2000); 
      // Step 3: Processing (ASR or Translation)
      const t2 = setTimeout(() => setAgentStep(3), 4500); 
      // Step 4: Show Result (Popup or Input Fill)
      const t3 = setTimeout(() => setAgentStep(4), 6500); 
      
      return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }

    // SEQUENCE for AGENT MODES
    else if (isAgentMode) {
      // ... existing agent sequence ...
      if (selectedMode === DemoMode.AGENT_EMAIL) {
        setAgentStep(0);
        const t1 = setTimeout(() => setAgentStep(1), 100);  // Start Recording
        const t2 = setTimeout(() => setAgentStep(2), 3000); // Stop Recording
        const t3 = setTimeout(() => setAgentStep(3), 3500); // Context: Reading Email
        const t4 = setTimeout(() => setAgentStep(4), 5000); // Drafting Spinner
        const t5 = setTimeout(() => setAgentStep(5), 6500); // Show Draft
        const t6 = setTimeout(() => setAgentStep(6), 7500); // Highlight Send
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); };
      } 
      // ... (other agent modes kept same) ...
       else if (selectedMode === DemoMode.AGENT_TWITTER) {
        setAgentStep(0);
        const t1 = setTimeout(() => setAgentStep(1), 100);  // Start Recording
        const t2 = setTimeout(() => setAgentStep(2), 3000); // Stop Recording
        const t3 = setTimeout(() => setAgentStep(3), 3500); // Scanning Trends
        const t4 = setTimeout(() => setAgentStep(4), 5500); // Drafting Spinner
        const t5 = setTimeout(() => setAgentStep(5), 6500); // Show Draft
        const t6 = setTimeout(() => setAgentStep(6), 7500); // Highlight Post
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); };
      }
      else if (selectedMode === DemoMode.AGENT_CALENDAR) {
        setAgentStep(0);
        const t1 = setTimeout(() => setAgentStep(1), 100);  // Start Recording
        const t2 = setTimeout(() => setAgentStep(2), 3000); // Stop Recording
        const t3 = setTimeout(() => setAgentStep(3), 3500); // Checking Calendar
        const t4 = setTimeout(() => setAgentStep(4), 5500); // Moving & Checking Conflict
        const t5 = setTimeout(() => setAgentStep(5), 7000); // Show Result
        const t6 = setTimeout(() => setAgentStep(6), 8000); // Highlight Confirm
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); clearTimeout(t6); };
      }
    }
  }, [selectedMode, isComplexMode, isAgentMode]);

  // --- Interaction Logic (Right Side) ---
  const handleMicClick = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setEditorText("");
      stream.getTracks().forEach(track => track.stop());
      setTimeout(() => {
        setIsRecording(false);
        simulateTyping(scenario.clean);
      }, 1500); 
    } catch (err) {
      console.error("Microphone permission denied or error:", err);
      alert(ui.micError);
    }
  };

  const simulateTyping = (text: string) => {
    let i = 0;
    const interval = setInterval(() => {
      setEditorText(text.slice(0, i + 1));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
  };

  return (
    <div className="w-full max-w-6xl mx-auto relative">
      
      {/* Top Navigation Tabs */}
      <div className="flex flex-col items-center mb-8 gap-4">
        {/* Level 1: Categories */}
        <div className="overflow-x-auto py-3 scrollbar-hide w-full flex justify-center">
          <div className="bg-white/70 dark:bg-white/10 backdrop-blur-xl backdrop-saturate-150 p-1.5 rounded-full border border-zinc-200 dark:border-white/10 shadow-sm flex gap-1">
            {CATEGORY_CONFIG.map((category) => {
              const isActive = activeCategory?.id === category.id;
              const isComingSoon = category.comingSoon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedMode(category.modes[0]);
                    setEditorText("");
                  }}
                  className={`relative py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center justify-center ${
                    isComingSoon ? 'px-4' : 'px-5'
                  } ${
                    isActive
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-md transform scale-105'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {category.label[lang]}
                  {category.comingSoon && (
                    <span className="absolute -top-1.5 -right-3 border border-indigo-500/40 text-indigo-500 dark:text-indigo-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 leading-none">
                        SOON
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level 2: Sub-options */}
        <div className="flex justify-center animate-in fade-in slide-in-from-top-2 duration-300 min-h-[36px]">
            {(activeCategory?.modes.length || 0) > 1 && (
            <div className="bg-zinc-100/50 dark:bg-white/5 backdrop-blur-md p-1 rounded-full flex gap-1 overflow-x-auto max-w-full">
              {activeCategory?.modes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setSelectedMode(mode);
                    setEditorText("");
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedMode === mode
                      ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {MODE_LABELS[lang][mode]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* ---------------- LEFT CARD ---------------- */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden flex flex-col h-[420px] relative group transition-transform duration-700">
           {/* Header */}
           <div className="h-12 border-b border-zinc-100 dark:border-white/5 bg-white/40 dark:bg-white/5 flex items-center justify-between px-6">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                {isComplexMode ? 'Capabilities' : ui.analysis}
              </span>
           </div>

           {/* Content Area */}
           <div className="flex-1 p-8 flex flex-col justify-center relative bg-zinc-50/50 dark:bg-black/20">
              
              {isComplexMode ? (
                // --- Agent & Translation: Capabilities (Left Side - Strict Left Align) ---
                <div className="flex flex-col gap-4 animate-in fade-in duration-500 w-full text-left">
                    
                    {/* TRANSLATION CAPABILITIES */}
                    {isTranslationMode && (
                        <>
                           <div className={`bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/5 shadow-sm transition-all duration-300 flex flex-col items-start text-left ${selectedMode === DemoMode.TRANSLATION_SELECTION ? 'ring-2 ring-blue-500/20 bg-blue-50/30' : 'opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="p-1 bg-blue-100 dark:bg-blue-900/40 rounded text-blue-600 dark:text-blue-300">
                                        <MousePointer2 className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {ui.translationDemo.selTitle}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                                   {ui.translationDemo.selDesc}
                                </p>
                            </div>
                            <div className={`bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/5 shadow-sm transition-all duration-300 flex flex-col items-start text-left ${selectedMode === DemoMode.TRANSLATION_REPLY_TEXT ? 'ring-2 ring-blue-500/20 bg-blue-50/30' : 'opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="p-1 bg-green-100 dark:bg-green-900/40 rounded text-green-600 dark:text-green-300">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {ui.translationDemo.replyTitle}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                                   {ui.translationDemo.replyDesc}
                                </p>
                            </div>
                            <div className={`bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/5 shadow-sm transition-all duration-300 flex flex-col items-start text-left ${selectedMode === DemoMode.TRANSLATION_REPLY_VOICE ? 'ring-2 ring-blue-500/20 bg-blue-50/30' : 'opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="p-1 bg-purple-100 dark:bg-purple-900/40 rounded text-purple-600 dark:text-purple-300">
                                        <Play className="w-3.5 h-3.5" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {ui.translationDemo.voiceTitle}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                                   {ui.translationDemo.voiceDesc}
                                </p>
                            </div>
                        </>
                    )}

                    {/* EMAIL CAPABILITIES */}
                    {selectedMode === DemoMode.AGENT_EMAIL && (
                      <>
                        <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600 dark:text-blue-300">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentEmailDemo?.cap1Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                               {ui.agentEmailDemo?.cap1Desc}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-300">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentEmailDemo?.cap2Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                               {ui.agentEmailDemo?.cap2Desc}
                            </p>
                        </div>
                      </>
                    )}

                    {/* TWITTER CAPABILITIES */}
                    {selectedMode === DemoMode.AGENT_TWITTER && (
                      <>
                        <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="p-1 bg-purple-100 dark:bg-purple-900/40 rounded text-purple-600 dark:text-purple-300">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentTwitterDemo?.cap1Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                               {ui.agentTwitterDemo?.cap1Desc}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="p-1 bg-orange-100 dark:bg-orange-900/40 rounded text-orange-600 dark:text-orange-300">
                                    <Lightbulb className="w-3.5 h-3.5" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentTwitterDemo?.cap2Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                               {ui.agentTwitterDemo?.cap2Desc}
                            </p>
                        </div>
                      </>
                    )}

                    {/* CALENDAR CAPABILITIES */}
                    {selectedMode === DemoMode.AGENT_CALENDAR && (
                      <>
                        <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="p-1 bg-indigo-100 dark:bg-indigo-900/40 rounded text-indigo-600 dark:text-indigo-300">
                                    <Calendar className="w-3.5 h-3.5" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentCalendarDemo?.cap1Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                               {ui.agentCalendarDemo?.cap1Desc}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-zinc-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-2 mb-1.5">
                                <div className="p-1 bg-red-100 dark:bg-red-900/40 rounded text-red-600 dark:text-red-300">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentCalendarDemo?.cap2Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left">
                               {ui.agentCalendarDemo?.cap2Desc}
                            </p>
                        </div>
                      </>
                    )}
                </div>
              ) : (
                // --- Transcribe Mode: Visualizer (Left Side) ---
                <>
                  <div className="relative z-10 mb-4 transition-all duration-500" key={selectedMode}>
                     <div className="bg-blue-50/80 dark:bg-blue-500/20 backdrop-blur-md p-6 rounded-2xl rounded-tl-none shadow-sm border border-blue-100 dark:border-blue-500/10">
                        <div className="flex items-start gap-4">
                           <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                             animStage === 1 ? 'bg-blue-500 animate-pulse' : 'bg-blue-200 dark:bg-blue-500/40'
                           }`}>
                              <Mic className={`w-4 h-4 ${animStage === 1 ? 'text-white' : 'text-blue-600 dark:text-blue-100'}`} />
                           </div>
                           
                           <div className={`leading-relaxed text-zinc-700 dark:text-blue-50 font-medium min-h-[3.5rem] ${
                             selectedMode === DemoMode.PERSONAL_NOTE
                               ? 'text-sm md:text-base' 
                               : 'text-base md:text-lg'
                           }`}>
                              {animStage >= 2 ? (
                                 scenario.renderDiff(lang, animStage >= 3)
                              ) : (
                                 <span>
                                   {displayedRaw}
                                   {animStage === 1 && <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-blink align-middle" />}
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>
                     {/* Tail */}
                     <div className="absolute -left-1.5 top-4 w-4 h-4 bg-blue-50/80 dark:bg-blue-500/20 rotate-45 rounded-sm border-l border-b border-blue-100 dark:border-blue-500/10 z-0 backdrop-blur-md"></div>
                  </div>

                  {/* Arrow & Label */}
                  <div className={`flex justify-end pr-10 transition-all duration-500 transform ${animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                     <div className="flex flex-col items-center">
                        <div className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg mb-1">
                           {MODE_LABELS[lang][selectedMode]}
                        </div>
                        <svg width="20" height="20" viewBox="0 0 50 50" fill="none" className="text-blue-500 rotate-12">
                           <path d="M25 5 C 25 20, 20 35, 10 40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                           <path d="M10 40 L 20 38 M 10 40 L 14 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                     </div>
                  </div>

                  {/* Final Result */}
                  <div className={`mt-2 bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 p-5 rounded-xl shadow-xl transition-all duration-700 transform ${animStage >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                     <div className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap text-left">
                        {scenario.clean}
                     </div>
                  </div>
                </>
              )}

           </div>
        </div>


        {/* ---------------- RIGHT CARD ---------------- */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl backdrop-saturate-150 rounded-3xl border border-zinc-200 dark:border-white/[0.08] shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 overflow-hidden flex flex-col h-[420px] relative group transition-transform duration-700">
           {/* Header */}
           <div className="h-12 border-b border-zinc-100 dark:border-white/5 bg-white/40 dark:bg-white/5 flex items-center justify-between px-6">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400/80 shadow-sm"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80 shadow-sm"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-400/80 shadow-sm"></div>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">{isComplexMode ? 'Demo' : 'Editor'}</span>
           </div>

           {/* Content Area */}
           <div className="flex-1 p-8 relative bg-white/50 dark:bg-black/20 flex flex-col justify-center overflow-hidden">
              
              {isComplexMode ? (
                // --- Agent & Translation Mode: Workflow Animation (Right Side) ---
                <div className="w-full h-full relative flex flex-col justify-center items-center">
                    
                    {/* --- TRANSLATION SCENARIOS --- */}
                    {isTranslationMode && (
                        <>
                           {/* Scenario 1: Browser Selection */}
                           {selectedMode === DemoMode.TRANSLATION_SELECTION && (
                             <div className="relative w-full max-w-[90%] mx-auto bg-white dark:bg-[#1E1E1E] rounded-xl shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden transform scale-100 transition-all">
                                {/* Fake Browser Header */}
                                <div className="bg-zinc-100 dark:bg-zinc-800 p-2 flex items-center gap-2 border-b border-zinc-200 dark:border-white/5">
                                   <div className="flex gap-1">
                                      <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                                      <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                                   </div>
                                   <div className="flex-1 bg-white dark:bg-black/20 rounded h-4 mx-2"></div>
                                </div>
                                <div className="p-6 text-left relative">
                                   <p className="text-zinc-400 text-xs mb-2">Science Daily</p>
                                   <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-300">
                                      {scenario.context}
                                   </p>
                                   {/* Highlight Overlay (Step 1+) */}
                                   <div className={`absolute top-[4.5rem] left-6 right-6 h-12 bg-blue-500/20 rounded mix-blend-multiply dark:mix-blend-screen transition-opacity duration-500 ${agentStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                                      {/* Selection Cursor */}
                                      <div className={`absolute -bottom-3 -right-3 text-black dark:text-white transition-opacity duration-500 ${agentStep === 1 ? 'opacity-100' : 'opacity-0'}`}>
                                          <MousePointer2 className="w-5 h-5 fill-current" />
                                      </div>
                                   </div>

                                   {/* Translation Popover (Step 4+) */}
                                   <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] bg-zinc-900/95 dark:bg-white/95 text-white dark:text-black p-4 rounded-xl shadow-2xl backdrop-blur-md transition-all duration-500 transform ${agentStep >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10 dark:border-black/10">
                                         <Languages className="w-4 h-4 text-blue-400 dark:text-blue-600" />
                                         <span className="text-xs font-bold uppercase tracking-wider">Translation</span>
                                      </div>
                                      <p className="text-sm font-medium leading-relaxed">
                                        {scenario.clean}
                                      </p>
                                   </div>
                                </div>
                             </div>
                           )}

                           {/* Scenario 2: Chat Reply Text */}
                           {selectedMode === DemoMode.TRANSLATION_REPLY_TEXT && (
                             <div className="relative w-full max-w-[90%] mx-auto bg-[#ECE5DD] dark:bg-[#111b21] rounded-xl shadow-2xl overflow-hidden h-[300px] flex flex-col">
                                 {/* Chat Header */}
                                 <div className="bg-[#008069] dark:bg-[#202c33] p-3 flex items-center gap-3 text-white">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                       <User className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-medium">Juan</div>
                                 </div>
                                 
                                 {/* Chat Area */}
                                 <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                    {/* Incoming Message */}
                                    <div className={`self-start bg-white dark:bg-[#202c33] p-3 rounded-lg rounded-tl-none shadow max-w-[80%] text-left text-sm text-black dark:text-white relative transition-all duration-300 ${agentStep >= 1 ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-black' : ''}`}>
                                        {scenario.context}
                                        <div className="text-[10px] text-zinc-400 text-right mt-1">10:00 AM</div>
                                    </div>
                                 </div>

                                 {/* Input Area */}
                                 <div className="bg-[#F0F2F5] dark:bg-[#202c33] p-2 px-3 flex items-center gap-2">
                                     <div className="bg-white dark:bg-[#2a3942] flex-1 rounded-full px-4 py-2 text-sm text-black dark:text-white transition-all duration-300 h-9 flex items-center">
                                         {agentStep >= 4 && (
                                            <span className="animate-in fade-in duration-500">{scenario.clean}</span>
                                         )}
                                         {agentStep === 3 && (
                                            <span className="text-zinc-400 italic text-xs animate-pulse">{ui.translationDemo.generatingReply}</span>
                                         )}
                                     </div>
                                     <div className="w-9 h-9 rounded-full bg-[#008069] flex items-center justify-center text-white">
                                        <Send className="w-4 h-4" />
                                     </div>
                                 </div>
                             </div>
                           )}

                           {/* Scenario 3: Chat Reply Voice */}
                           {selectedMode === DemoMode.TRANSLATION_REPLY_VOICE && (
                              <div className="relative w-full max-w-[90%] mx-auto bg-[#ECE5DD] dark:bg-[#111b21] rounded-xl shadow-2xl overflow-hidden h-[300px] flex flex-col">
                                 {/* Chat Header */}
                                 <div className="bg-[#008069] dark:bg-[#202c33] p-3 flex items-center gap-3 text-white">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                       <User className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-medium">Pierre</div>
                                 </div>
                                 
                                 {/* Chat Area */}
                                 <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                                    {/* Incoming Voice Message */}
                                    <div className={`self-start bg-white dark:bg-[#202c33] p-3 rounded-lg rounded-tl-none shadow max-w-[80%] flex items-center gap-3 relative transition-all duration-300 ${agentStep >= 1 ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-black' : ''}`}>
                                        <div className="text-zinc-500 dark:text-zinc-400">
                                            {agentStep === 1 || agentStep === 3 ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                                        </div>
                                        <div className="h-6 w-24 flex items-center gap-0.5">
                                            {(agentStep === 1 || agentStep === 3) ? (
                                                <AudioWaveform />
                                            ) : (
                                                <div className="w-full h-0.5 bg-zinc-300 dark:bg-zinc-600 rounded"></div>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-zinc-400 self-end">0:12</div>
                                    </div>
                                    
                                    {/* ASR Analysis Status */}
                                    {agentStep === 3 && (
                                        <div className="flex justify-center">
                                            <span className="text-[10px] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full text-zinc-500 dark:text-zinc-400 animate-pulse">
                                               {ui.translationDemo.analyzingAudio}
                                            </span>
                                        </div>
                                    )}
                                 </div>

                                 {/* Input Area */}
                                 <div className="bg-[#F0F2F5] dark:bg-[#202c33] p-2 px-3 flex items-center gap-2">
                                     <div className="bg-white dark:bg-[#2a3942] flex-1 rounded-full px-4 py-2 text-sm text-black dark:text-white transition-all duration-300 h-9 flex items-center">
                                         {agentStep >= 4 && (
                                            <span className="animate-in fade-in duration-500">{scenario.clean}</span>
                                         )}
                                          {agentStep === 3 && (
                                            <span className="text-zinc-400 italic text-xs animate-pulse">Processing...</span>
                                         )}
                                     </div>
                                     <div className="w-9 h-9 rounded-full bg-[#008069] flex items-center justify-center text-white">
                                        <Send className="w-4 h-4" />
                                     </div>
                                 </div>
                              </div>
                           )}

                           {/* Shared: Voice Command Overlay (Step 2 & 3) */}
                           <div className={`absolute top-4 w-full flex justify-center transition-all duration-500 z-20 ${agentStep === 2 || agentStep === 3 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                                <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
                                    {agentStep === 2 && <Mic className="w-4 h-4 animate-pulse" />}
                                    {agentStep === 3 && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span className="text-sm font-medium">
                                        {agentStep === 2 ? scenario.raw : ui.translationDemo.translating}
                                    </span>
                                </div>
                           </div>
                        </>
                    )}


                    {/* --- AGENT SCENARIOS (Existing) --- */}
                    {/* Step 1 & 2: Recording Input with Waveform & Typed Text */}
                    {isAgentMode && (
                        <>
                        <div className={`absolute top-0 w-full transition-all duration-700 transform ${agentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${agentStep >= 3 ? 'opacity-40 scale-95 blur-[1px]' : ''}`}>
                             <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-lg text-sm max-w-[90%] ml-auto relative">
                                 {/* Mic Icon & Waveform - Only Visible during 'Recording' (step 1) */}
                                 <div className={`flex items-center gap-2 mb-2 ${agentStep === 1 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'} transition-all duration-300`}>
                                    <Mic className="w-3 h-3 text-white/80" />
                                    <AudioWaveform />
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-white/80 ml-auto">Recording</span>
                                 </div>
                                 
                                 {/* Text Content */}
                                 <span className={agentStep === 1 ? 'animate-pulse' : ''}>
                                   {selectedMode === DemoMode.AGENT_TWITTER ? ui.agentTwitterDemo?.input : 
                                    selectedMode === DemoMode.AGENT_CALENDAR ? ui.agentCalendarDemo?.input :
                                    ui.agentEmailDemo?.input}
                                 </span>
                                 
                                 <div className="absolute -right-1.5 top-0 w-4 h-4 bg-blue-600 transform -rotate-45 rounded-sm z-0"></div>
                             </div>
                        </div>

                        {/* Step 3: Context Analysis / Scanning */}
                        <div className={`absolute top-24 w-full flex justify-center transition-all duration-500 z-10 ${agentStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                             {selectedMode === DemoMode.AGENT_EMAIL ? (
                                <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl p-3 pr-5 rounded-xl border border-zinc-200 dark:border-white/10 shadow-xl flex items-center gap-3 w-max max-w-full">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                       <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <div className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Context</div>
                                      <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                                        {ui.agentEmailDemo?.contextFinding}
                                      </div>
                                    </div>
                                    <div className="ml-2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in duration-300">
                                       <CheckCircle2 className="w-3 h-3 text-white" />
                                    </div>
                                </div>
                             ) : selectedMode === DemoMode.AGENT_TWITTER ? (
                                 <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl p-3 px-5 rounded-xl border border-zinc-200 dark:border-white/10 shadow-xl flex flex-col gap-2 w-max max-w-full">
                                    <div className="flex items-center gap-2 mb-1 border-b border-zinc-100 dark:border-white/5 pb-1">
                                        <Search className="w-3 h-3 text-zinc-400" />
                                        <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">{ui.agentTwitterDemo?.scanning}</span>
                                    </div>
                                    <div className="flex gap-2">
                                       <span className="text-xs bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 animate-pulse">#AI</span>
                                       <span className="text-xs bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 animate-pulse delay-75">#Agents</span>
                                       <span className="text-xs bg-zinc-100 dark:bg-white/5 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-300 animate-pulse delay-150">#Tech</span>
                                    </div>
                                 </div>
                             ) : selectedMode === DemoMode.AGENT_CALENDAR ? (
                                <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl p-3 px-5 rounded-xl border border-zinc-200 dark:border-white/10 shadow-xl flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                      {ui.agentCalendarDemo?.checking}
                                    </span>
                                </div>
                             ) : null}
                        </div>

                        {/* Step 4: Processing Spinner */}
                        <div className={`absolute top-24 w-full flex justify-center transition-all duration-500 z-10 ${agentStep === 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                             <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10 shadow-lg flex items-center gap-2">
                                 <Loader2 className="w-3 h-3 text-purple-500 animate-spin" />
                                 <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                                    {selectedMode === DemoMode.AGENT_TWITTER ? ui.agentTwitterDemo?.drafting : 
                                     selectedMode === DemoMode.AGENT_CALENDAR ? ui.agentCalendarDemo?.moving :
                                     ui.agentEmailDemo?.contextAction}
                                 </span>
                             </div>
                        </div>

                        {/* Step 5 & 6: Result UI */}
                        <div className={`absolute bottom-0 w-full transition-all duration-700 transform ${agentStep >= 5 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                             
                             {selectedMode === DemoMode.AGENT_EMAIL ? (
                                <div className="bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden mx-auto w-full">
                                    {/* Email Window Header */}
                                    <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-zinc-500">Draft</span>
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                                            <div className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                                        </div>
                                    </div>
                                    {/* Email Body */}
                                    <div className="p-4 space-y-3 text-left">
                                        <div className="flex items-center gap-2 text-xs text-zinc-400 border-b border-zinc-100 dark:border-white/5 pb-2">
                                            <span>To:</span>
                                            <span className="bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">Boss</span>
                                        </div>
                                        <div className="text-[10px] leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap font-mono bg-zinc-50 dark:bg-black/20 p-3 rounded border border-zinc-100 dark:border-white/5">
                                            {scenario.clean}
                                        </div>
                                    </div>
                                    {/* Action Footer */}
                                    <div className="p-3 border-t border-zinc-100 dark:border-white/5 flex justify-end gap-2 bg-zinc-50 dark:bg-zinc-800/50">
                                        <button className="px-3 py-1.5 rounded text-[10px] font-medium text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Cancel</button>
                                        <button className={`px-3 py-1.5 rounded text-[10px] font-medium text-white bg-blue-600 flex items-center gap-1.5 transition-all duration-500 ${agentStep === 6 ? 'animate-pulse ring-4 ring-blue-500/20 scale-105' : ''}`}>
                                            <Send className="w-3 h-3" />
                                            Send
                                        </button>
                                    </div>
                                </div>
                             ) : selectedMode === DemoMode.AGENT_TWITTER ? (
                                <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden mx-auto w-full p-4">
                                   <div className="flex gap-3 text-left">
                                      {/* Avatar */}
                                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                         <User className="w-5 h-5 text-zinc-400" />
                                      </div>
                                      <div className="flex-1">
                                         <div className="flex items-center gap-1 mb-0.5">
                                            <span className="font-bold text-sm text-black dark:text-white">You</span>
                                            <span className="text-zinc-500 text-xs">@user</span>
                                            <span className="text-zinc-500 text-xs">·</span>
                                            <span className="text-zinc-500 text-xs">1m</span>
                                         </div>
                                         <p className="text-xs text-zinc-900 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap mb-3">
                                            {scenario.clean}
                                         </p>
                                         <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                                            <div className="flex gap-4 text-zinc-400">
                                               <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-700"></div>
                                               <div className="w-4 h-4 rounded border border-zinc-300 dark:border-zinc-700"></div>
                                            </div>
                                            <button className={`px-4 py-1.5 rounded-full text-xs font-bold text-white bg-[#1D9BF0] transition-all duration-500 ${agentStep === 6 ? 'animate-pulse ring-4 ring-[#1D9BF0]/20 scale-105' : ''}`}>
                                                Post
                                            </button>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             ) : selectedMode === DemoMode.AGENT_CALENDAR ? (
                               <div className="bg-white dark:bg-[#1E1E1E] border border-zinc-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden mx-auto w-full p-4 relative">
                                  <div className="flex items-start gap-4 mb-4">
                                     <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 border border-red-100 dark:border-red-500/20">
                                        <span className="text-[8px] font-bold text-red-500 uppercase">OCT</span>
                                        <span className="text-base font-bold text-zinc-900 dark:text-white">24</span>
                                     </div>
                                     <div className="flex-1 text-left">
                                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">Weekly Sync</h4>
                                        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                           <span className="line-through opacity-50">Tue, 2:00 PM</span>
                                           <span className="text-zinc-300 dark:text-zinc-600">→</span>
                                           <span className="text-green-600 dark:text-green-400 font-medium">Fri, 10:00 AM</span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded w-fit border border-green-100 dark:border-green-500/20">
                                           <CheckCircle2 className="w-3 h-3" />
                                           No Conflicts Found
                                        </div>
                                     </div>
                                  </div>
                                  <div className="flex justify-end pt-3 border-t border-zinc-100 dark:border-white/5">
                                     <button className={`px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-zinc-900 dark:bg-white dark:text-black transition-all duration-500 ${agentStep === 6 ? 'animate-pulse ring-4 ring-zinc-500/20 scale-105' : ''}`}>
                                         Confirm
                                     </button>
                                  </div>
                               </div>
                             ) : null}
                             
                             {/* Fake Cursor Animation */}
                             <div className={`absolute transition-all duration-1000 ease-in-out ${agentStep === 6 ? 'bottom-4 right-8 opacity-100' : 'bottom-0 right-0 opacity-0'}`}>
                                 <MousePointer2 className="w-5 h-5 text-black dark:text-white fill-current" />
                             </div>
                        </div>
                        </>
                    )}

                </div>
              ) : (
                // --- Standard Interactive Editor (Right Side) ---
                <>
                  {!editorText && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700 pointer-events-none">
                      
                      {/* Header - Hides when recording to focus on text */}
                      <div className={`transition-all duration-500 flex flex-col items-center ${isRecording ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 mb-6'}`}>
                        <div className="bg-zinc-100 dark:bg-white/10 px-4 py-2 rounded-xl mb-3 backdrop-blur-sm">
                          <Keyboard className="w-6 h-6 text-zinc-400" />
                        </div>
                        <h3 className="text-zinc-900 dark:text-white font-medium mb-1">
                          {ui.tryIt}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                          {ui.pressMic}
                        </p>
                      </div>

                      {/* Example Text Card */}
                      <div className={`
                          relative px-6 py-4 rounded-2xl border transition-all duration-500 ease-out flex flex-col items-center max-w-xs md:max-w-sm
                          ${isRecording 
                            ? 'bg-blue-50/90 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30 scale-110 shadow-xl backdrop-blur-md' 
                            : 'bg-white/80 dark:bg-black/40 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300 shadow-sm backdrop-blur-md'
                          }
                      `}>
                          <p className={`text-sm md:text-base font-medium italic transition-colors duration-300 leading-relaxed ${isRecording ? 'text-blue-700 dark:text-blue-100' : ''}`}>
                            "{scenario.raw}"
                          </p>
                          
                          {/* Active Recording Indicator */}
                          {isRecording && (
                              <div className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-300 animate-in fade-in slide-in-from-top-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider">{ui.listening}</span>
                              </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Editor Output */}
                  {editorText && (
                    <div className="h-full flex flex-col">
                      <div className="text-lg text-zinc-800 dark:text-zinc-200 font-light leading-relaxed animate-in fade-in duration-300 whitespace-pre-wrap">
                          {editorText}
                          <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-blink align-middle" />
                      </div>
                    </div>
                  )}

                  {/* Floating Action Button */}
                  <div className="absolute bottom-8 right-8 z-20">
                    <button
                      onClick={handleMicClick}
                      disabled={isRecording}
                      className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-500 ease-out ${
                        isRecording 
                          ? 'bg-red-500 scale-110 shadow-red-500/30' 
                          : 'bg-zinc-900 dark:bg-white hover:scale-110 hover:-translate-y-1 shadow-zinc-900/20 dark:shadow-white/10'
                      }`}
                    >
                      <Mic className={`w-6 h-6 transition-colors duration-300 ${isRecording ? 'text-white' : 'text-white dark:text-black'}`} />
                    </button>
                  </div>

                  {/* Clear Button */}
                  {editorText && !isRecording && (
                    <div className="absolute bottom-8 left-8 z-20">
                      <button 
                        onClick={() => setEditorText("")}
                        className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1.5 transition-colors bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 hover:border-zinc-300"
                      >
                          <RefreshCw className="w-3 h-3" />
                          {ui.reset}
                      </button>
                    </div>
                  )}
                </>
              )}

           </div>
        </div>

      </div>
    </div>
  );
};