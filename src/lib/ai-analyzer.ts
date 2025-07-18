import { Suggestion } from '@/types/writing';

// Simulated AI analysis patterns
const grammarPatterns = [
  { pattern: /\bi\s+am\s+\w+ing\b/gi, suggestion: 'Consider using simple present tense instead of present continuous', type: 'grammar' as const },
  { pattern: /\bthere\s+is\s+\w+\s+that\b/gi, suggestion: 'Consider removing "there is" for more direct writing', type: 'style' as const },
  { pattern: /\bvery\s+(\w+)\b/gi, suggestion: 'Consider using a stronger adjective instead of "very"', type: 'style' as const },
  { pattern: /\bin\s+order\s+to\b/gi, suggestion: 'Consider using "to" instead of "in order to"', type: 'clarity' as const },
  { pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi, suggestion: 'Consider using "because" instead', type: 'clarity' as const },
  { pattern: /\ba\s+lot\s+of\b/gi, suggestion: 'Consider using "many", "much", or "numerous"', type: 'style' as const },
  { pattern: /\bthat\s+that\b/gi, suggestion: 'Remove one "that" to avoid repetition', type: 'grammar' as const },
  { pattern: /\bmore\s+better\b/gi, suggestion: 'Use "better" instead of "more better"', type: 'grammar' as const },
];

const sentenceStarters = ['However,', 'Moreover,', 'Furthermore,', 'In addition,', 'Nevertheless,'];
const strongVerbs = ['demonstrates', 'illustrates', 'emphasizes', 'clarifies', 'establishes'];

export async function analyzeText(text: string): Promise<Suggestion[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const suggestions: Suggestion[] = [];

  // Apply pattern-based analysis
  grammarPatterns.forEach((patternData, index) => {
    const matches = Array.from(text.matchAll(patternData.pattern));
    
    matches.forEach((match, matchIndex) => {
      if (match.index !== undefined) {
        const suggestion: Suggestion = {
          id: `${index}-${matchIndex}`,
          type: patternData.type,
          severity: patternData.type === 'grammar' ? 'error' : patternData.type === 'style' ? 'warning' : 'info',
          originalText: match[0],
          replacement: generateReplacement(match[0], patternData.type),
          explanation: patternData.suggestion,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        };
        suggestions.push(suggestion);
      }
    });
  });

  // Add some contextual suggestions
  const sentences = text.split(/[.!?]+/);
  
  sentences.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) return;

    // Check for passive voice
    if (/\b(was|were|is|are|been|being)\s+\w*ed\b/i.test(trimmedSentence)) {
      suggestions.push({
        id: `passive-${index}`,
        type: 'style',
        severity: 'warning',
        originalText: trimmedSentence,
        replacement: undefined,
        explanation: 'Consider using active voice for more engaging writing',
        startIndex: text.indexOf(trimmedSentence),
        endIndex: text.indexOf(trimmedSentence) + trimmedSentence.length,
      });
    }

    // Check for long sentences
    const wordCount = trimmedSentence.split(/\s+/).length;
    if (wordCount > 25) {
      suggestions.push({
        id: `long-sentence-${index}`,
        type: 'clarity',
        severity: 'info',
        originalText: trimmedSentence,
        replacement: undefined,
        explanation: 'Consider breaking this long sentence into shorter ones for better readability',
        startIndex: text.indexOf(trimmedSentence),
        endIndex: text.indexOf(trimmedSentence) + trimmedSentence.length,
      });
    }

    // Suggest sentence variety
    if (index > 0 && trimmedSentence.split(/\s+/).length < 8) {
      suggestions.push({
        id: `variety-${index}`,
        type: 'style',
        severity: 'info',
        originalText: trimmedSentence,
        replacement: `${sentenceStarters[index % sentenceStarters.length]} ${trimmedSentence.toLowerCase()}`,
        explanation: 'Consider varying sentence structure for better flow',
        startIndex: text.indexOf(trimmedSentence),
        endIndex: text.indexOf(trimmedSentence) + trimmedSentence.length,
      });
    }
  });

  return suggestions.slice(0, 8); // Limit to avoid overwhelming the user
}

function generateReplacement(originalText: string, type: string): string | undefined {
  const lower = originalText.toLowerCase();
  
  if (lower.includes('very ')) {
    const adjective = lower.replace('very ', '');
    const strongAdjectives: { [key: string]: string } = {
      'good': 'excellent',
      'bad': 'terrible',
      'big': 'enormous',
      'small': 'tiny',
      'important': 'crucial',
      'interesting': 'fascinating',
      'nice': 'wonderful',
    };
    return strongAdjectives[adjective] || originalText.replace(/very\s+/i, '');
  }
  
  if (lower.includes('a lot of')) {
    return originalText.replace(/a\s+lot\s+of/i, 'many');
  }
  
  if (lower.includes('in order to')) {
    return originalText.replace(/in\s+order\s+to/i, 'to');
  }
  
  if (lower.includes('due to the fact that')) {
    return originalText.replace(/due\s+to\s+the\s+fact\s+that/i, 'because');
  }
  
  if (lower.includes('that that')) {
    return originalText.replace(/that\s+that/i, 'that');
  }
  
  if (lower.includes('more better')) {
    return originalText.replace(/more\s+better/i, 'better');
  }
  
  return undefined;
}