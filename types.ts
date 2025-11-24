import React from 'react';

export type Language = 'en' | 'zh' | 'ja';

export enum DemoMode {
  PROFESSIONAL_EMAIL = 'Professional Email',
  SLACK_MESSAGE = 'Slack Update',
  PERSONAL_NOTE = 'Personal Note',
  CODE_COMMENT = 'Code Documentation',
  CREATIVE_WRITING = 'Creative Writing',
  REMOVE_FILLERS = 'Remove Fillers',
  REMOVE_ACCENTS = 'Remove Accents',
  // Agent Modes
  AGENT_EMAIL = 'Agent Email',
  AGENT_TWITTER = 'Agent Twitter',
  AGENT_CALENDAR = 'Agent Calendar',
  // Translation Modes
  TRANSLATION_SELECTION = 'Translation Selection',
  TRANSLATION_REPLY_TEXT = 'Translation Reply Text',
  TRANSLATION_REPLY_VOICE = 'Translation Reply Voice',
  // Summarize Modes
  SUMMARIZE_PDF = 'Summarize PDF',
  SUMMARIZE_MEETING = 'Summarize Meeting'
}

export interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colSpan?: string;
  lang: Language;
}

export interface InteractiveDemoProps {
  lang: Language;
}

export interface CommonProps {
  lang: Language;
}