export interface Suggestion {
  id: string;
  type: 'grammar' | 'style' | 'clarity';
  severity: 'error' | 'warning' | 'info';
  originalText: string;
  replacement?: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
}

export interface WritingAnalysis {
  suggestions: Suggestion[];
  stats: {
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
    paragraphCount: number;
    averageWordsPerSentence: number;
    readabilityScore: number;
  };
}