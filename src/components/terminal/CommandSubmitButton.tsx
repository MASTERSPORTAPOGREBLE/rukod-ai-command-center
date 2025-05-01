
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommandSubmitButtonProps {
  command: string;
  isProcessing: boolean;
  handleSubmit: () => void;
}

export const CommandSubmitButton: React.FC<CommandSubmitButtonProps> = ({
  command,
  isProcessing,
  handleSubmit
}) => {
  return (
    <Button 
      onClick={handleSubmit}
      disabled={!command.trim() || isProcessing}
      variant="ghost"
      size="icon"
      className="ml-1 hover:bg-rukod-purple hover:bg-opacity-20"
    >
      <Play className="h-4 w-4 text-rukod-purple" />
    </Button>
  );
};
