
import React from 'react';
import { Button } from './button';
import { Play } from 'lucide-react';

interface TerminalButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

export const RunButton = ({ 
  onClick, 
  disabled = false, 
  loading = false,
  children = "Run"
}: TerminalButtonProps) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className="bg-green-600 hover:bg-green-700"
    >
      <Play className="mr-2 h-4 w-4" />
      {loading ? 'Running...' : children}
    </Button>
  );
};
