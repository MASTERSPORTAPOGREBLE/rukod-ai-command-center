
import { useState } from 'react';
import { toast } from 'sonner';

interface TerminalInfo {
  version: string;
  status: string;
  activeEnvironment: string;
  memoryUsage: string;
}

interface UseTerminalStateResult {
  terminalInfo: TerminalInfo;
  setTerminalInfo: React.Dispatch<React.SetStateAction<TerminalInfo>>;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  terminalInput: string;
  setTerminalInput: React.Dispatch<React.SetStateAction<string>>;
  selectedFile: string;
  setSelectedFile: React.Dispatch<React.SetStateAction<string>>;
  handleTerminalKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleTerminalInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useTerminalState = (
  onSubmitCommand: () => void,
  onHistoryNavigation: (direction: 'up' | 'down') => void
): UseTerminalStateResult => {
  const [terminalInfo, setTerminalInfo] = useState({
    version: '1.0.0',
    status: 'active',
    activeEnvironment: 'python',
    memoryUsage: '128MB'
  });
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [selectedFile, setSelectedFile] = useState('main.py');

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      toast.success("Полноэкранный режим включен");
    }
  };
  
  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmitCommand();
    } else if (e.key === 'ArrowUp') {
      // Navigate history upwards
      e.preventDefault();
      onHistoryNavigation('up');
    } else if (e.key === 'ArrowDown') {
      // Navigate history downwards
      e.preventDefault();
      onHistoryNavigation('down');
    }
  };
  
  const handleTerminalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerminalInput(e.target.value);
  };

  return {
    terminalInfo,
    setTerminalInfo,
    isFullscreen,
    toggleFullscreen,
    terminalInput,
    setTerminalInput,
    selectedFile,
    setSelectedFile,
    handleTerminalKeyDown,
    handleTerminalInput
  };
};
