
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  File, 
  Save, 
  SaveAll, 
  FileText, 
  FileCode, 
  Folder,
  Copy, 
  Trash2, 
  Undo, 
  Redo,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { pluginRegistry } from '../plugins/languagePlugin';
import { ProgrammingLanguage } from '../models/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { useCommandContext } from '../context/CommandContext';

interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: ProgrammingLanguage;
  path: string;
  isSaved: boolean;
}

export const CodeEditor: React.FC = () => {
  const { currentTheme } = useTheme();
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('python');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { addCommand } = useCommandContext();

  const createNewFile = (language: ProgrammingLanguage = selectedLanguage) => {
    const newFileId = `file-${Date.now()}`;
    const fileExtension = getFileExtension(language);
    const newFileName = `untitled${files.length + 1}${fileExtension}`;
    
    const newFile: CodeFile = {
      id: newFileId,
      name: newFileName,
      content: getTemplateForLanguage(language),
      language,
      path: `/${newFileName}`,
      isSaved: false
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFileId);
    setSelectedLanguage(language);
    toast.success(`Новый файл ${newFileName} создан`);
  };

  const getTemplateForLanguage = (language: ProgrammingLanguage): string => {
    switch(language) {
      case 'python': 
        return '# Новый Python файл\n\ndef main():\n    print("Привет, мир!")\n\nif __name__ == "__main__":\n    main()';
      case 'cpp':
        return '#include <iostream>\n\nint main() {\n    std::cout << "Привет, мир!" << std::endl;\n    return 0;\n}';
      case 'lua':
        return '-- Новый Lua файл\n\nfunction main()\n    print("Привет, мир!")\nend\n\nmain()';
      case 'rust':
        return 'fn main() {\n    println!("Привет, мир!");\n}';
      case 'ruby':
        return '# Новый Ruby файл\n\ndef main\n    puts "Привет, мир!"\nend\n\nmain';
      case 'javascript':
        return '// Новый JavaScript файл\n\nfunction main() {\n    console.log("Привет, мир!");\n}\n\nmain();';
      default:
        return '// Новый файл';
    }
  };

  const getFileExtension = (language: ProgrammingLanguage): string => {
    switch(language) {
      case 'python': return '.py';
      case 'cpp': return '.cpp';
      case 'lua': return '.lua';
      case 'rust': return '.rs';
      case 'ruby': return '.rb';
      case 'javascript': return '.js';
      default: return '.txt';
    }
  };

  const saveFile = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, isSaved: true } 
        : file
    ));
    
    const file = files.find(f => f.id === fileId);
    if (file) {
      toast.success(`Файл ${file.name} сохранен`);
    }
  };

  const saveAllFiles = () => {
    setFiles(prev => prev.map(file => ({ ...file, isSaved: true })));
    toast.success('Все файлы сохранены');
  };

  const updateFileContent = (fileId: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, content, isSaved: false } 
        : file
    ));
  };

  const deleteFile = (fileId: string) => {
    const fileToDelete = files.find(f => f.id === fileId);
    
    if (!fileToDelete) return;
    
    setFiles(prev => prev.filter(file => file.id !== fileId));
    
    if (activeFileId === fileId) {
      setActiveFileId(files.length > 1 ? files.filter(f => f.id !== fileId)[0].id : null);
    }
    
    toast.success(`Файл ${fileToDelete.name} удален`);
  };

  const renameFile = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            name: newName,
            path: `/${newName}`
          } 
        : file
    ));
  };

  const runCode = () => {
    if (!activeFileId) return;
    
    const activeFile = files.find(file => file.id === activeFileId);
    if (!activeFile) return;
    
    const language = activeFile.language;
    const plugin = pluginRegistry.getByLanguage(language);
    
    if (!plugin) {
      toast.error(`Запуск кода для языка ${language} не поддерживается`);
      return;
    }
    
    toast.promise(
      plugin.run(activeFile.content),
      {
        loading: `Выполнение ${activeFile.name}...`,
        success: (data) => ({
          title: `Код успешно выполнен`,
          description: data.output
        }),
        error: (err) => ({
          title: 'Ошибка выполнения',
          description: err?.message || 'Неизвестная ошибка'
        })
      }
    );

    // Add to command history
    addCommand(`run: ${activeFile.name}`, `Результат выполнения ${activeFile.name}`);
  };

  const formatCode = () => {
    if (!activeFileId) return;
    
    const activeFile = files.find(file => file.id === activeFileId);
    if (!activeFile) return;

    // Simple mock formatting - in a real app this would use language-specific formatters
    toast.success(`Код в файле ${activeFile.name} отформатирован`);
  };

  useEffect(() => {
    // Create a default file if none exists
    if (files.length === 0) {
      createNewFile('python');
    }
  }, []);

  const activeFile = files.find(file => file.id === activeFileId);

  return (
    <div className="h-full flex flex-col" style={{ color: currentTheme.textColor }}>
      <div className="flex justify-between items-center mb-2 p-2 rounded-t-md" style={{ backgroundColor: currentTheme.backgroundColor }}>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => createNewFile(selectedLanguage)}
            title="Новый файл"
          >
            <FileText className="h-4 w-4" style={{ color: currentTheme.primaryColor }} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => activeFileId && saveFile(activeFileId)}
            title="Сохранить"
            disabled={!activeFileId}
          >
            <Save className="h-4 w-4" style={{ color: currentTheme.primaryColor }} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={saveAllFiles}
            title="Сохранить все"
            disabled={files.length === 0}
          >
            <SaveAll className="h-4 w-4" style={{ color: currentTheme.primaryColor }} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => activeFileId && deleteFile(activeFileId)}
            title="Удалить файл"
            disabled={!activeFileId}
          >
            <Trash2 className="h-4 w-4" style={{ color: currentTheme.primaryColor }} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            title="Отменить"
          >
            <Undo className="h-4 w-4" style={{ color: currentTheme.primaryColor }} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            title="Повторить"
          >
            <Redo className="h-4 w-4" style={{ color: currentTheme.primaryColor }} />
          </Button>
        </div>
        
        <div className="flex items-center">
          <Select
            value={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value as ProgrammingLanguage)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Выберите язык" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="lua">Lua</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="ruby">Ruby</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={runCode}
            className="ml-2"
            disabled={!activeFileId}
          >
            Запустить
          </Button>
          <Button 
            variant="ghost"
            size="sm"
            onClick={formatCode}
            className="ml-2"
            disabled={!activeFileId}
          >
            Форматировать
          </Button>
        </div>
      </div>
      
      <div className="flex flex-grow">
        <div className="w-56 h-full border-r border-gray-700 p-2" style={{ backgroundColor: `${currentTheme.backgroundColor}80` }}>
          <div className="mb-2 font-semibold flex items-center">
            <Folder className="h-4 w-4 mr-1" style={{ color: currentTheme.primaryColor }} />
            <span>Файлы</span>
          </div>
          
          <div className="space-y-1">
            {files.map(file => (
              <div 
                key={file.id} 
                className={`flex items-center p-1 rounded cursor-pointer ${activeFileId === file.id ? 'bg-rukod-purple bg-opacity-20' : 'hover:bg-rukod-purple hover:bg-opacity-10'}`}
                onClick={() => setActiveFileId(file.id)}
              >
                <FileCode className="h-4 w-4 mr-2" style={{ color: currentTheme.secondaryColor }} />
                <span className="text-sm truncate flex-1">{file.name}</span>
                {!file.isSaved && <span className="text-xs ml-1">•</span>}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-grow h-full">
          {activeFile ? (
            <textarea 
              ref={editorRef}
              value={activeFile.content}
              onChange={(e) => updateFileContent(activeFile.id, e.target.value)}
              className="w-full h-full p-4 font-mono resize-none focus:outline-none"
              style={{ 
                backgroundColor: `${currentTheme.backgroundColor}`, 
                color: currentTheme.textColor,
                border: 'none'
              }}
              placeholder="Введите код..."
              spellCheck="false"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FileCode className="h-10 w-10 mx-auto mb-2" />
                <p>Создайте или выберите файл для редактирования</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {activeFile && (
        <div className="flex justify-between items-center p-2 text-xs border-t border-gray-700" style={{ backgroundColor: currentTheme.backgroundColor }}>
          <div>
            {activeFile.language} | {activeFile.path}
          </div>
          <div>
            {activeFile.isSaved ? 'Сохранено' : 'Не сохранено'}
          </div>
        </div>
      )}
    </div>
  );
};
