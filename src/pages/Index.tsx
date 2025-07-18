import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Lightbulb, Zap, BookOpen } from 'lucide-react';
import { analyzeText } from '@/lib/ai-analyzer';
import { SuggestionCard } from '@/components/SuggestionCard';
import { WritingStats } from '@/components/WritingStats';
import { Suggestion } from '@/types/writing';

const Index = () => {
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleTextChange = useCallback((value: string) => {
    setText(value);
  }, []);

  const analyzeWriting = useCallback(async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 200);

      const results = await analyzeText(text);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setSuggestions(results);
      
      setTimeout(() => {
        setAnalysisProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text]);

  const applySuggestion = useCallback((suggestion: Suggestion) => {
    if (suggestion.replacement) {
      const newText = text.replace(suggestion.originalText, suggestion.replacement);
      setText(newText);
      
      // Remove applied suggestion
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    }
  }, [text]);

  const dismissSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  // Auto-analyze when text changes (debounced)
  useEffect(() => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      analyzeWriting();
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [text, analyzeWriting]);

  const grammarSuggestions = suggestions.filter(s => s.type === 'grammar');
  const styleSuggestions = suggestions.filter(s => s.type === 'style');
  const claritySuggestions = suggestions.filter(s => s.type === 'clarity');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Writing Assistant
          </h1>
          <p className="text-xl text-gray-600">
            Improve your writing with intelligent suggestions for grammar, style, and clarity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Writing Editor */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Your Writing
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isAnalyzing && (
                    <div className="flex items-center gap-2">
                      <div className="w-32">
                        <Progress value={analysisProgress} className="h-2" />
                      </div>
                      <span className="text-sm text-gray-500">Analyzing...</span>
                    </div>
                  )}
                  <Button 
                    onClick={analyzeWriting}
                    disabled={isAnalyzing || !text.trim()}
                    size="sm"
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Analyze
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start writing here... Your text will be automatically analyzed for grammar, style, and clarity improvements."
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="min-h-[400px] text-base leading-relaxed resize-none"
                />
                
                {text && (
                  <div className="mt-4">
                    <WritingStats text={text} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Suggestions Panel */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Suggestions
                  {suggestions.length > 0 && (
                    <Badge variant="secondary">{suggestions.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {text.trim() ? 'No issues found! Your writing looks great.' : 'Start writing to see suggestions here.'}
                    </p>
                  </div>
                ) : (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all" className="text-xs">
                        All ({suggestions.length})
                      </TabsTrigger>
                      <TabsTrigger value="grammar" className="text-xs">
                        Grammar ({grammarSuggestions.length})
                      </TabsTrigger>
                      <TabsTrigger value="style" className="text-xs">
                        Style ({styleSuggestions.length})
                      </TabsTrigger>
                      <TabsTrigger value="clarity" className="text-xs">
                        Clarity ({claritySuggestions.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4 space-y-3">
                      {suggestions.map(suggestion => (
                        <SuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          onApply={() => applySuggestion(suggestion)}
                          onDismiss={() => dismissSuggestion(suggestion.id)}
                        />
                      ))}
                    </TabsContent>

                    <TabsContent value="grammar" className="mt-4 space-y-3">
                      {grammarSuggestions.map(suggestion => (
                        <SuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          onApply={() => applySuggestion(suggestion)}
                          onDismiss={() => dismissSuggestion(suggestion.id)}
                        />
                      ))}
                    </TabsContent>

                    <TabsContent value="style" className="mt-4 space-y-3">
                      {styleSuggestions.map(suggestion => (
                        <SuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          onApply={() => applySuggestion(suggestion)}
                          onDismiss={() => dismissSuggestion(suggestion.id)}
                        />
                      ))}
                    </TabsContent>

                    <TabsContent value="clarity" className="mt-4 space-y-3">
                      {claritySuggestions.map(suggestion => (
                        <SuggestionCard
                          key={suggestion.id}
                          suggestion={suggestion}
                          onApply={() => applySuggestion(suggestion)}
                          onDismiss={() => dismissSuggestion(suggestion.id)}
                        />
                      ))}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;