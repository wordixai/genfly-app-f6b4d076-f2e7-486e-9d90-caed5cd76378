import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info, Check, X } from 'lucide-react';
import { Suggestion } from '@/types/writing';

interface SuggestionCardProps {
  suggestion: Suggestion;
  onApply: () => void;
  onDismiss: () => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onApply,
  onDismiss,
}) => {
  const getSeverityIcon = () => {
    switch (suggestion.severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeColor = () => {
    switch (suggestion.type) {
      case 'grammar':
        return 'bg-red-100 text-red-800';
      case 'style':
        return 'bg-yellow-100 text-yellow-800';
      case 'clarity':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getSeverityColor = () => {
    switch (suggestion.severity) {
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
    }
  };

  return (
    <Card className={`border-l-4 ${getSeverityColor()} hover:shadow-md transition-shadow`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getSeverityIcon()}
            <Badge className={getTypeColor()} variant="secondary">
              {suggestion.type}
            </Badge>
          </div>
          <div className="flex gap-1">
            {suggestion.replacement && (
              <Button
                size="sm"
                variant="outline"
                onClick={onApply}
                className="h-6 px-2 text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Apply
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Issue: </span>
            <span className="bg-red-50 px-1 py-0.5 rounded text-red-800">
              "{suggestion.originalText}"
            </span>
          </div>
          
          {suggestion.replacement && (
            <div className="text-sm">
              <span className="font-medium">Suggested: </span>
              <span className="bg-green-50 px-1 py-0.5 rounded text-green-800">
                "{suggestion.replacement}"
              </span>
            </div>
          )}
          
          <p className="text-sm text-gray-600">{suggestion.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
};