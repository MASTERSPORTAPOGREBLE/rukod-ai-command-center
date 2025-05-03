
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowDown, Copy, Download } from 'lucide-react';

interface CodeExecutionResultProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  output: string;
  fileName: string;
  executionTime?: number;
  language: string;
  hasError?: boolean;
  suggestions?: {
    text: string;
    action: () => void;
    label: string;
  }[];
}

export const CodeExecutionResult: React.FC<CodeExecutionResultProps> = ({
  open,
  onOpenChange,
  output,
  fileName,
  executionTime = 0,
  language,
  hasError = false,
  suggestions = []
}) => {
  const handleCopyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-slate-950 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            Результат выполнения {fileName}
            {executionTime > 0 && <span className="ml-2 text-xs text-muted-foreground">({executionTime} ms)</span>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <span className="font-medium mr-2 text-gray-300">Язык:</span> 
              <span className="text-rukod-purple">{language}</span>
            </div>
            <div>
              {hasError ? (
                <span className="text-red-500">✗ Ошибка выполнения</span>
              ) : (
                <span className="text-green-500">✓ Выполнено успешно</span>
              )}
            </div>
          </div>
          
          <ScrollArea className="h-80">
            <div className={`p-4 rounded-md border font-mono text-sm whitespace-pre-wrap ${hasError ? 'bg-red-950 border-red-800 text-red-100' : 'bg-slate-900 border-slate-700 text-white'}`}>
              {output}
            </div>
          </ScrollArea>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyOutput} className="text-white border-slate-600 hover:bg-slate-800">
              <Copy className="h-4 w-4 mr-2" />
              Копировать
            </Button>
          </div>

          {hasError && suggestions && suggestions.length > 0 && (
            <div className="bg-amber-950 border border-amber-900 p-3 rounded-md">
              <h4 className="text-amber-400 font-semibold mb-2">Предложения по исправлению:</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <p className="text-sm text-amber-200">{suggestion.text}</p>
                    <Button size="sm" variant="outline" className="border-amber-600 text-amber-400 hover:bg-amber-900" onClick={suggestion.action}>
                      {suggestion.label}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
