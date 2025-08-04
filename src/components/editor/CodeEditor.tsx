import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Save, Play, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { useTheme } from 'next-themes';

export interface CodeFile {
  id: string;
  filename: string;
  content: string;
  language: string;
  isDirty?: boolean;
}

interface CodeEditorProps {
  file: CodeFile;
  onContentChange?: (content: string) => void;
  onLanguageChange?: (language: string) => void;
  onSave?: (file: CodeFile) => void;
  onRun?: (file: CodeFile) => void;
  className?: string;
  readOnly?: boolean;
}

const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'sql', label: 'SQL' },
  { value: 'php', label: 'PHP' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'dart', label: 'Dart' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'swift', label: 'Swift' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'shell', label: 'Shell' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  file,
  onContentChange,
  onLanguageChange,
  onSave,
  onRun,
  className = '',
  readOnly = false
}) => {
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Configure Monaco Editor options
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize: 14,
        wordWrap: 'on',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        lineNumbers: 'on',
        renderWhitespace: 'selection',
        contextmenu: true,
        mouseWheelZoom: true,
        copyWithSyntaxHighlighting: true,
      });
    }
  }, []);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) onSave(file);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.F11, () => {
      setIsFullscreen(!isFullscreen);
    });
  };

  const handleContentChange = (value: string | undefined) => {
    if (value !== undefined && onContentChange) {
      onContentChange(value);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(file.content);
      // TODO: Add toast notification
    } catch (err) {
      console.error('Ошибка копирования в буфер обмена:', err);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const getFileExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    return ext;
  };

  const editorLanguage = (() => {
    const ext = getFileExtension(file.filename);
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'xml': 'xml',
      'sql': 'sql',
      'php': 'php',
      'go': 'go',
      'rs': 'rust',
      'dart': 'dart',
      'kt': 'kotlin',
      'swift': 'swift',
      'rb': 'ruby',
      'sh': 'shell',
      'yml': 'yaml',
      'yaml': 'yaml',
      'md': 'markdown',
    };
    return langMap[ext] || file.language || 'plaintext';
  })();

  const editorWrapperClass = isFullscreen 
    ? 'fixed inset-0 z-50 bg-background' 
    : className;

  return (
    <div className={editorWrapperClass}>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{file.filename}</CardTitle>
              {file.isDirty && (
                <Badge variant="secondary" className="text-xs">
                  Несохранено
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {editorLanguage}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <Select 
                value={file.language} 
                onValueChange={onLanguageChange}
                disabled={readOnly}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  title="Копировать код"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadFile}
                  title="Скачать файл"
                >
                  <Download className="w-4 h-4" />
                </Button>

                {!readOnly && onSave && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSave(file)}
                    title="Сохранить (Ctrl+S)"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                )}

                {onRun && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRun(file)}
                    title="Запустить код"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  title="Настройки редактора"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Settings Panel */}
          {showSettings && (
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={formatCode}
                  disabled={readOnly}
                >
                  Форматировать код
                </Button>
                <span className="text-muted-foreground">
                  Строк: {file.content.split('\n').length}
                </span>
                <span className="text-muted-foreground">
                  Символов: {file.content.length}
                </span>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 p-0">
          <div className="h-full border-t">
            <Editor
              height="100%"
              language={editorLanguage}
              value={file.content}
              onChange={handleContentChange}
              onMount={handleEditorDidMount}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                readOnly,
                fontSize: 14,
                wordWrap: 'on',
                minimap: { enabled: !isFullscreen },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                contextmenu: true,
                mouseWheelZoom: true,
                copyWithSyntaxHighlighting: true,
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true,
                },
                suggest: {
                  showKeywords: true,
                  showSnippets: true,
                },
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true,
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};