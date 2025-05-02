
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodeExecutionResultProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  output: string;
  fileName: string;
  executionTime?: number;
  language: string;
}

export const CodeExecutionResult: React.FC<CodeExecutionResultProps> = ({
  open,
  onOpenChange,
  output,
  fileName,
  executionTime = 0,
  language
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Результат выполнения {fileName}
            {executionTime > 0 && <span className="ml-2 text-xs text-muted-foreground">({executionTime} ms)</span>}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <span className="font-medium mr-2">Язык:</span> 
              <span className="text-rukod-purple">{language}</span>
            </div>
            <div>
              <span className="text-green-500">✓</span> Выполнено успешно
            </div>
          </div>
          
          <ScrollArea className="h-80">
            <div className="bg-slate-900 p-4 rounded-md border border-slate-700 font-mono text-sm whitespace-pre-wrap">
              {output}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
