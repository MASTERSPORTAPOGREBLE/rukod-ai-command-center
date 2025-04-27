
import React, { useEffect, useRef } from 'react';
import { useCommandContext, CommandOutputItem } from '@/context/CommandContext';
import { Loader2, Code, ExternalLink, Globe } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Helper function to detect and highlight code blocks
const detectAndHighlightCode = (text: string) => {
  // Look for code blocks between triple backticks
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
  let result = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      result.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add the code block with syntax highlighting
    const language = match[1] || 'javascript';
    const code = match[2];
    result.push(
      <div key={`code-${match.index}`} className="my-2 rounded-md overflow-hidden">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          className="text-sm"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text
  if (lastIndex < text.length) {
    result.push(
      <span key={`text-${lastIndex}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return result.length > 0 ? result : text;
};

interface CodeBlockProps {
  language: string;
  code: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code, title }) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    // Could add toast here for feedback
  };
  
  return (
    <div className="my-3 rounded-md overflow-hidden border border-rukod-purple border-opacity-30">
      {title && (
        <div className="bg-rukod-purple bg-opacity-20 px-3 py-1 flex items-center justify-between">
          <div className="flex items-center">
            <Code className="h-4 w-4 mr-2 text-rukod-purple" />
            <span className="text-xs font-mono">{title}</span>
          </div>
          <div className="flex space-x-1">
            <button 
              className="text-xs hover:text-rukod-purple transition-colors" 
              title="Copy code"
              onClick={handleCopyCode}
            >
              <Code className="h-3.5 w-3.5" />
            </button>
            <button className="text-xs hover:text-rukod-purple transition-colors" title="Open in editor">
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={atomDark}
        className="text-sm"
        customStyle={{ margin: 0, padding: '1rem' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const CommandItem: React.FC<{ item: CommandOutputItem }> = ({ item }) => {
  // Check for special formatted content like code examples
  const renderOutput = () => {
    if (typeof item.output === 'string' && item.output.includes('```')) {
      return detectAndHighlightCode(item.output);
    }
    
    return item.output;
  };

  return (
    <div className="mb-4 animate-fade-in">
      {item.command && (
        <div className="flex items-center mb-1">
          <span className="text-rukod-purple terminal-text mr-2">$</span>
          <span className="terminal-text">{item.command}</span>
          
          {/* Show translation indicator if available */}
          {item.translatedCommand && (
            <div className="ml-2 flex items-center text-xs text-gray-400">
              <Globe className="h-3 w-3 mr-1" />
              <span>{item.translatedCommand}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="pl-4 border-l-2 border-rukod-purple border-opacity-50">
        <div className="terminal-text whitespace-pre-wrap">
          {item.status === 'processing' ? (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="animate-spin h-3 w-3 mr-2" />
              {item.output}
            </div>
          ) : item.status === 'error' ? (
            <span className="text-red-400">{item.output}</span>
          ) : (
            <span>{renderOutput()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommandOutput: React.FC = () => {
  const { history } = useCommandContext();
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when history changes
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div 
      ref={outputRef}
      className="flex-1 overflow-y-auto p-4 terminal-text code-editor-like"
      style={{ scrollBehavior: 'smooth' }}>
      {history.map((item) => (
        <CommandItem key={item.id} item={item} />
      ))}
    </div>
  );
};
