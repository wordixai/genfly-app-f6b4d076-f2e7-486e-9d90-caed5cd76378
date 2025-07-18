import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, FileText, Clock, Target } from 'lucide-react';

interface WritingStatsProps {
  text: string;
}

export const WritingStats: React.FC<WritingStatsProps> = ({ text }) => {
  const stats = React.useMemo(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    const averageWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
    
    // Simple readability score (Flesch-like approximation)
    const averageSentenceLength = averageWordsPerSentence;
    const averageSyllables = words.reduce((acc, word) => acc + countSyllables(word), 0) / words.length || 0;
    const readabilityScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * averageSentenceLength) - (84.6 * averageSyllables)
    ));
    
    const readingTime = Math.ceil(words.length / 200); // 200 WPM average
    
    return {
      wordCount: words.length,
      characterCount: characters,
      characterCountNoSpaces: charactersNoSpaces,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      averageWordsPerSentence: Math.round(averageWordsPerSentence * 10) / 10,
      readabilityScore: Math.round(readabilityScore),
      readingTime,
    };
  }, [text]);

  const getReadabilityLabel = (score: number) => {
    if (score >= 90) return { label: 'Very Easy', color: 'text-green-600' };
    if (score >= 80) return { label: 'Easy', color: 'text-green-500' };
    if (score >= 70) return { label: 'Fairly Easy', color: 'text-yellow-600' };
    if (score >= 60) return { label: 'Standard', color: 'text-yellow-500' };
    if (score >= 50) return { label: 'Fairly Difficult', color: 'text-orange-500' };
    if (score >= 30) return { label: 'Difficult', color: 'text-red-500' };
    return { label: 'Very Difficult', color: 'text-red-600' };
  };

  const readabilityInfo = getReadabilityLabel(stats.readabilityScore);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
        <FileText className="h-5 w-5 text-blue-600" />
        <div>
          <div className="text-sm text-gray-600">Words</div>
          <div className="font-semibold text-blue-900">{stats.wordCount}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
        <BarChart3 className="h-5 w-5 text-green-600" />
        <div>
          <div className="text-sm text-gray-600">Characters</div>
          <div className="font-semibold text-green-900">{stats.characterCount}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
        <Target className="h-5 w-5 text-purple-600" />
        <div>
          <div className="text-sm text-gray-600">Sentences</div>
          <div className="font-semibold text-purple-900">{stats.sentenceCount}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
        <Clock className="h-5 w-5 text-orange-600" />
        <div>
          <div className="text-sm text-gray-600">Read Time</div>
          <div className="font-semibold text-orange-900">{stats.readingTime} min</div>
        </div>
      </div>
      
      <div className="col-span-2 md:col-span-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Readability Score</span>
          <span className={`text-sm font-semibold ${readabilityInfo.color}`}>
            {stats.readabilityScore}/100 - {readabilityInfo.label}
          </span>
        </div>
        <Progress value={stats.readabilityScore} className="h-2" />
        <div className="mt-2 text-xs text-gray-500">
          Average {stats.averageWordsPerSentence} words per sentence
        </div>
      </div>
    </div>
  );
};

// Helper function to count syllables (simplified)
function countSyllables(word: string): number {
  const vowels = 'aeiouAEIOU';
  let count = 0;
  let previousWasVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }
  
  // Handle silent 'e'
  if (word.endsWith('e') && count > 1) {
    count--;
  }
  
  return Math.max(1, count);
}