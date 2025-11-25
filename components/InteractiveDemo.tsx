import React, { useState, useEffect } from 'react';
import { Mic, Keyboard, RefreshCw, ShieldCheck, Zap, Send, MousePointer2, Mail, Loader2, Sparkles, CheckCircle2, TrendingUp, Lightbulb, Coffee, Search, Hash, User, Calendar, AlertCircle, Cloud, Globe, MessageCircle, Play, Pause, Languages, ArrowRightLeft, FileText, FileBarChart, Clock, Paperclip, MoreHorizontal, ChevronLeft } from 'lucide-react';
import { DemoMode, Language } from '../types';

// Helper component for animated strikethrough
const AnimatedStrike: React.FC<{ children: React.ReactNode; show: boolean }> = ({ children, show }) => (
  <span className="relative inline-block">
    <span className={`transition-opacity duration-300 ${show ? 'opacity-40' : 'opacity-100'}`}>
      {children}
    </span>
    <span 
      className={`absolute top-1/2 left-0 h-[1.5px] bg-red-500/80 rounded-full transition-all duration-500 ease-out ${show ? 'w-full' : 'w-0'}`} 
      style={{ transform: 'translateY(-50%)' }}
    />
  </span>
);

// Helper component for animated underline (formatting indicator)
const AnimatedUnderline: React.FC<{ children: React.ReactNode; show: boolean }> = ({ children, show }) => (
  <span className="relative inline-block">
    <span className={`transition-all duration-300 ${show ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}`}>
      {children}
    </span>
  </span>
);

// Helper for Audio Waveform Animation
const AudioWaveform = () => (
  <div className="flex items-center gap-0.5 h-3.5 mx-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        className="w-0.5 bg-white/90 rounded-full animate-wave origin-bottom"
        style={{ 
          height: '100%', 
          animationDelay: `${i * 0.1}s`,
          animationDuration: '0.8s'
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
    [DemoMode.PROFESSIONAL_EMAIL]: "Polishing",
    [DemoMode.REMOVE_FILLERS]: "Removes Filler",
    [DemoMode.REMOVE_ACCENTS]: "Remove Accents",
    [DemoMode.SLACK_MESSAGE]: "Intent",
    [DemoMode.PERSONAL_NOTE]: "Structuring",
    [DemoMode.CODE_COMMENT]: "Summarizing",
    [DemoMode.CREATIVE_WRITING]: "Polishing",
    [DemoMode.AGENT_EMAIL]: "Email",
    [DemoMode.AGENT_TWITTER]: "X (Twitter)",
    [DemoMode.AGENT_CALENDAR]: "Calendar",
    [DemoMode.TRANSLATION_SELECTION]: "Web",
    [DemoMode.TRANSLATION_REPLY_TEXT]: "Reply",
    [DemoMode.TRANSLATION_REPLY_VOICE]: "Voice",
    [DemoMode.SUMMARIZE_PDF]: "Chat PDF",
    [DemoMode.SUMMARIZE_MEETING]: "Minutes"
  },
  zh: {
    [DemoMode.PROFESSIONAL_EMAIL]: "润色优化",
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
    [DemoMode.TRANSLATION_REPLY_VOICE]: "语音回复",
    [DemoMode.SUMMARIZE_PDF]: "聊天文件总结",
    [DemoMode.SUMMARIZE_MEETING]: "会议纪要"
  },
  ja: {
    [DemoMode.PROFESSIONAL_EMAIL]: "文章推敲",
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
    [DemoMode.TRANSLATION_REPLY_VOICE]: "音声返信",
    [DemoMode.SUMMARIZE_PDF]: "PDF要約",
    [DemoMode.SUMMARIZE_MEETING]: "議事録作成"
  }
};

const UI_TEXT: Record<Language, any> = {
  en: {
    tryIt: "Try it yourself",
    pressMic: "Press the microphone button below and read:",
    listening: "Listening...",
    reset: "Reset",
    analysis: "Capabilities",
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
    // Summarize Demo
    summarizeDemo: {
      pdfTitle: "Chat Context",
      pdfDesc: "In your chat app, select a PDF file, voice your command, and Villdo instantly drafts a summary in your input box, ready to send.",
      meetTitle: "Meeting Intelligence",
      meetDesc: "Record offline meetings. Villdo identifies speakers and structures the chaos into clear minutes automatically.",
      reading: "Reading File...",
      listening: "Listening to Room...",
      generating: "Generating Summary...",
      drafting: "Drafting in Input Box..."
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
    analysis: "功能演示",
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
    // Summarize Demo
    summarizeDemo: {
      pdfTitle: "聊天语境",
      pdfDesc: "在聊天窗口直接选中 PDF 文件，说出指令，Villdo 会直接将总结草拟在您的输入框中，供您发送。",
      meetTitle: "会议智能",
      meetDesc: "录制线下会议。Villdo 能够识别发言人，并将混乱的讨论结构化为清晰的纪要。",
      reading: "正在读取文件...",
      listening: "正在聆听会议...",
      generating: "正在生成摘要...",
      drafting: "正在输入框草拟..."
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
    // Summarize Demo
    summarizeDemo: {
      pdfTitle: "チャットコンテキスト",
      pdfDesc: "チャット画面でPDFを選択し話しかけるだけで、Villdoが入力欄に要約をドラフト作成します。",
      meetTitle: "会議インテリジェンス",
      meetDesc: "オフライン会議を録音。Villdoが話者を識別し、議論を明確な議事録に構造化します。",
      reading: "ファイルを読み込み中...",
      listening: "会議を聞き取り中...",
      generating: "要約を作成中...",
      drafting: "入力欄に作成中..."
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
  
  // Agent & Translation & Summarize Demo State
  // 0: Idle
  // 1: Interaction (Selection/Play/Record)
  // 2: Trigger Voice Command
  // 3: Processing
  // 4: Show Result (Draft/Card)
  // 5: Highlight Action (e.g. Send Button)
  const [agentStep, setAgentStep] = useState(0);

  const scenario = SCENARIOS[lang][selectedMode];
  const ui = UI_TEXT[lang];

  // Derive active category from selected mode
  const activeCategory = CATEGORY_CONFIG.find(cat => cat.modes.includes(selectedMode));
  const isAgentMode = activeCategory?.id === 'agent';
  const isTranslationMode = activeCategory?.id === 'translation';
  const isSummarizeMode = activeCategory?.id === 'summarize';
  const isComplexMode = isAgentMode || isTranslationMode || isSummarizeMode;

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

  // --- Animation Loop (Agent & Translation & Summarize Demo) ---
  useEffect(() => {
    if (!isComplexMode) {
      setAgentStep(0);
      return;
    }
    
    // SEQUENCE for TRANSLATION MODES
    if (isTranslationMode) {
      setAgentStep(0);
      const t0 = setTimeout(() => setAgentStep(1), 500); // Select/Play
      const t1 = setTimeout(() => setAgentStep(2), 2000); // Trigger Mic
      const t2 = setTimeout(() => setAgentStep(3), 4500); // Processing
      const t3 = setTimeout(() => setAgentStep(4), 6500); // Result
      return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }

    // SEQUENCE for SUMMARIZE MODES
    if (isSummarizeMode) {
      setAgentStep(0);
      const t0 = setTimeout(() => setAgentStep(1), 500);  // Step 1: Interaction (Select File / Record)
      const t1 = setTimeout(() => setAgentStep(2), 2500); // Step 2: Voice Command
      const t2 = setTimeout(() => setAgentStep(3), 4500); // Step 3: Processing
      const t3 = setTimeout(() => setAgentStep(4), 6500); // Step 4: Result (Draft / Card)
      const t4 = setTimeout(() => setAgentStep(5), 8000); // Step 5: Action (Highlight Send / etc)
      return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
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
  }, [selectedMode, isComplexMode, isAgentMode, isTranslationMode, isSummarizeMode]);

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
      
      {/* Top Navigation Tabs - Segmented Control Style */}
      <div className="flex flex-col items-center mb-10 gap-5">
        {/* Level 1: Categories - Segmented Control */}
        <div className="overflow-x-auto py-2 scrollbar-hide w-full flex justify-center">
          <div className="bg-zinc-200/50 dark:bg-white/10 backdrop-blur-md p-1 rounded-full border border-black/5 dark:border-white/5 flex gap-0.5 shadow-sm">
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
                  className={`relative py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 whitespace-nowrap flex items-center justify-center ${
                    isComingSoon ? 'px-4' : 'px-5'
                  } ${
                    isActive
                      ? 'bg-white dark:bg-zinc-600 text-black dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  {category.label[lang]}
                  {category.comingSoon && (
                    <span className="absolute -top-1.5 -right-2 bg-black dark:bg-white text-white dark:text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 leading-none tracking-tight shadow-sm">
                        SOON
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Level 2: Sub-options */}
        <div className="flex justify-center animate-in fade-in slide-in-from-top-2 duration-300 min-h-[32px]">
            {(activeCategory?.modes.length || 0) > 1 && (
            <div className="flex gap-2 overflow-x-auto max-w-full px-4">
              {activeCategory?.modes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setSelectedMode(mode);
                    setEditorText("");
                  }}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all duration-300 whitespace-nowrap border ${
                    selectedMode === mode
                      ? 'bg-black dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                      : 'bg-white/50 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20'
                  }`}
                >
                  {MODE_LABELS[lang][mode]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* ---------------- LEFT CARD ---------------- */}
        <div className="bg-white/80 dark:bg-[#151516]/80 backdrop-blur-2xl backdrop-saturate-150 rounded-[32px] border border-black/5 dark:border-white/10 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden flex flex-col h-[480px] relative group transition-transform duration-700 hover:shadow-3xl">
           {/* Header */}
           <div className="h-14 border-b border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/5 flex items-center justify-between px-6 backdrop-blur-sm">
              <div className="flex gap-2 opacity-60 hover:opacity-100 transition-opacity">
                 <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                 <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                 <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                {isComplexMode ? 'Capabilities' : ui.analysis}
              </span>
           </div>

           {/* Content Area */}
           <div className="flex-1 p-8 flex flex-col justify-center relative bg-gradient-to-br from-zinc-50/50 to-white/50 dark:from-black/20 dark:to-zinc-900/20">
              
              {isComplexMode ? (
                // --- Agent & Translation & Summarize: Capabilities (Left Side - Strict Left Align) ---
                <div className="flex flex-col gap-4 animate-in fade-in duration-500 w-full text-left">
                    
                    {/* TRANSLATION CAPABILITIES */}
                    {isTranslationMode && (
                        <>
                           <div className={`bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm transition-all duration-300 flex flex-col items-start text-left ${selectedMode === DemoMode.TRANSLATION_SELECTION ? 'ring-1 ring-blue-500/20 shadow-md transform scale-[1.01]' : 'opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                        <MousePointer2 className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {ui.translationDemo.selTitle}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                                   {ui.translationDemo.selDesc}
                                </p>
                            </div>
                            <div className={`bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm transition-all duration-300 flex flex-col items-start text-left ${selectedMode === DemoMode.TRANSLATION_REPLY_TEXT ? 'ring-1 ring-blue-500/20 shadow-md transform scale-[1.01]' : 'opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
                                        <MessageCircle className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {ui.translationDemo.replyTitle}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                                   {ui.translationDemo.replyDesc}
                                </p>
                            </div>
                            <div className={`bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm transition-all duration-300 flex flex-col items-start text-left ${selectedMode === DemoMode.TRANSLATION_REPLY_VOICE ? 'ring-1 ring-blue-500/20 shadow-md transform scale-[1.01]' : 'opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                        <Play className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {ui.translationDemo.voiceTitle}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                                   {ui.translationDemo.voiceDesc}
                                </p>
                            </div>
                        </>
                    )}

                    {/* SUMMARIZE CAPABILITIES */}
                    {isSummarizeMode && (
                        <>
                           <div className={`bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm transition-all duration-300 flex flex-col items-start text-left ${selectedMode === DemoMode.SUMMARIZE_PDF ? 'ring-1 ring-red-500/20 shadow-md transform scale-[1.01]' : 'opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {ui.summarizeDemo.pdfTitle}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                                   {ui.summarizeDemo.pdfDesc}
                                </p>
                            </div>
                            <div className={`bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm transition-all duration-300 flex flex-col items-start text-left ${selectedMode === DemoMode.SUMMARIZE_MEETING ? 'ring-1 ring-indigo-500/20 shadow-md transform scale-[1.01]' : 'opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                                        <Mic className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        {ui.summarizeDemo.meetTitle}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                                   {ui.summarizeDemo.meetDesc}
                                </p>
                            </div>
                        </>
                    )}

                    {/* EMAIL CAPABILITIES */}
                    {selectedMode === DemoMode.AGENT_EMAIL && (
                      <>
                        <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentEmailDemo?.cap1Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                               {ui.agentEmailDemo?.cap1Desc}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentEmailDemo?.cap2Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                               {ui.agentEmailDemo?.cap2Desc}
                            </p>
                        </div>
                      </>
                    )}

                    {/* TWITTER CAPABILITIES */}
                    {selectedMode === DemoMode.AGENT_TWITTER && (
                      <>
                        <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentTwitterDemo?.cap1Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                               {ui.agentTwitterDemo?.cap1Desc}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400">
                                    <Lightbulb className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentTwitterDemo?.cap2Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                               {ui.agentTwitterDemo?.cap2Desc}
                            </p>
                        </div>
                      </>
                    )}

                    {/* CALENDAR CAPABILITIES */}
                    {selectedMode === DemoMode.AGENT_CALENDAR && (
                      <>
                        <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentCalendarDemo?.cap1Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                               {ui.agentCalendarDemo?.cap1Desc}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#1E1E1E] p-5 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                    {ui.agentCalendarDemo?.cap2Title}
                                </h3>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed text-left pl-1">
                               {ui.agentCalendarDemo?.cap2Desc}
                            </p>
                        </div>
                      </>
                    )}
                </div>
              ) : (
                // --- Transcribe Mode: Visualizer (Left Side) ---
                <>
                  <div className="relative z-10 mb-6 transition-all duration-500" key={selectedMode}>
                     <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md p-6 rounded-2xl rounded-tl-sm shadow-sm border border-black/5 dark:border-white/10">
                        <div className="flex items-start gap-4">
                           <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition