import React, { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Folder, 
  MessageSquare, 
  Code, 
  Download, 
  Upload,
  Save,
  Play,
  Brain,
  Github,
  ExternalLink,
  Eye
} from 'lucide-react';

import { CodeEditor, CodeFile } from '../editor/CodeEditor';
import { FileManager, FileNode } from '../fileManager/FileManager';
import { AiChat } from '../chat/AiChat';
import { ApiKeySettings } from '../settings/ApiKeySettings';
import { LivePreview } from '../preview/LivePreview';
import { GeneratedCode } from '@/services/geminiService';
import { CloudIntegrationService, CloudDeployment } from '@/services/cloudIntegration';

interface Project {
  id: string;
  name: string;
  description: string;
  files: FileNode[];
  createdAt: Date;
  modifiedAt: Date;
}

export const AiIde: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [openFiles, setOpenFiles] = useState<CodeFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<CloudDeployment | null>(null);

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('ai_ide_projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        setProjects(parsedProjects);
        if (parsedProjects.length > 0) {
          setCurrentProject(parsedProjects[0]);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    } else {
      // Create default project
      createDefaultProject();
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('ai_ide_projects', JSON.stringify(projects));
    }
  }, [projects]);

  const createDefaultProject = () => {
    const defaultProject: Project = {
      id: 'default',
      name: 'Мой первый проект',
      description: 'Проект для изучения возможностей AI IDE',
      files: [
        {
          id: 'readme',
          name: 'README.md',
          type: 'file',
          path: 'README.md',
          content: `# Добро пожаловать в AI IDE!

Это ваш первый проект в нашей IDE с поддержкой ИИ.

## Возможности:
- Генерация кода с помощью Gemini 2.5 Flash
- Современный редактор кода с подсветкой синтаксиса
- Управление файлами и проектами
- Интеграция с Replit и GitHub Codespaces
- Безопасное хранение API ключей

## Как начать:
1. Настройте API ключ Gemini в разделе "Настройки"
2. Используйте чат с ИИ для генерации кода
3. Редактируйте код в встроенном редакторе
4. Скачивайте готовые файлы или отправляйте в облако

Удачи в программировании! 🚀`,
          language: 'markdown'
        }
      ],
      createdAt: new Date(),
      modifiedAt: new Date()
    };

    setProjects([defaultProject]);
    setCurrentProject(defaultProject);
    
    // Open README file
    const readmeFile: CodeFile = {
      id: 'readme',
      filename: 'README.md',
      content: defaultProject.files[0].content || '',
      language: 'markdown'
    };
    setOpenFiles([readmeFile]);
    setActiveFileId('readme');
  };

  const getCurrentFile = (): CodeFile | null => {
    return openFiles.find(file => file.id === activeFileId) || null;
  };

  const handleFileSelect = (file: CodeFile) => {
    // Check if file is already open
    const existingFile = openFiles.find(f => f.id === file.id);
    if (existingFile) {
      setActiveFileId(file.id);
      return;
    }

    // Add to open files
    setOpenFiles(prev => [...prev, file]);
    setActiveFileId(file.id);
  };

  const handleFileClose = (fileId: string) => {
    setOpenFiles(prev => prev.filter(f => f.id !== fileId));
    
    // If closed file was active, switch to another file
    if (activeFileId === fileId) {
      const remainingFiles = openFiles.filter(f => f.id !== fileId);
      setActiveFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
    }
  };

  const handleContentChange = (content: string) => {
    if (!activeFileId) return;

    setOpenFiles(prev => prev.map(file => 
      file.id === activeFileId 
        ? { ...file, content, isDirty: true }
        : file
    ));

    // Update project files
    if (currentProject) {
      updateProjectFile(activeFileId, content);
    }
  };

  const updateProjectFile = (fileId: string, content: string) => {
    if (!currentProject) return;

    const updateFileInTree = (files: FileNode[]): FileNode[] => {
      return files.map(file => {
        if (file.id === fileId) {
          return { ...file, content };
        }
        if (file.children) {
          return { ...file, children: updateFileInTree(file.children) };
        }
        return file;
      });
    };

    const updatedProject = {
      ...currentProject,
      files: updateFileInTree(currentProject.files),
      modifiedAt: new Date()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleFileSave = (file: CodeFile) => {
    // Mark file as saved
    setOpenFiles(prev => prev.map(f => 
      f.id === file.id 
        ? { ...f, isDirty: false }
        : f
    ));
    
    // Update project
    updateProjectFile(file.id, file.content);
  };

  const handleFileCreate = (path: string, name: string, type: 'file' | 'folder') => {
    if (!currentProject) return;

    const newFile: FileNode = {
      id: Date.now().toString(),
      name,
      type,
      path: path ? `${path}/${name}` : name,
      content: type === 'file' ? '' : undefined,
      language: type === 'file' ? 'plaintext' : undefined,
      children: type === 'folder' ? [] : undefined
    };

    const updatedProject = {
      ...currentProject,
      files: [...currentProject.files, newFile],
      modifiedAt: new Date()
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));

    // If it's a file, open it
    if (type === 'file') {
      const codeFile: CodeFile = {
        id: newFile.id,
        filename: newFile.name,
        content: '',
        language: 'plaintext'
      };
      handleFileSelect(codeFile);
    }
  };

  const handleCodeGenerated = (codes: GeneratedCode[]) => {
    // Add generated files to project and open them
    codes.forEach(code => {
      const codeFile: CodeFile = {
        id: Date.now().toString() + Math.random().toString(),
        filename: code.filename,
        content: code.code,
        language: code.language
      };
      
      // Add to project
      handleFileCreate('', code.filename, 'file');
      
      // Open in editor
      handleFileSelect(codeFile);
    });
  };

  const handleProjectDownload = () => {
    if (!currentProject) return;

    // Create a zip-like structure (simplified for demo)
    const projectData = {
      name: currentProject.name,
      files: currentProject.files,
      createdAt: currentProject.createdAt
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        handleFileCreate('', file.name, 'file');
        
        // Update the file content
        setTimeout(() => {
          const codeFile: CodeFile = {
            id: Date.now().toString(),
            filename: file.name,
            content,
            language: 'plaintext'
          };
          handleFileSelect(codeFile);
        }, 100);
      };
      reader.readAsText(file);
    });
  };

  const handleCloudDeploy = async (provider: 'replit' | 'github') => {
    if (!currentProject) {
      alert('Нет активного проекта для развертывания');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus(null);

    try {
      let deployment: CloudDeployment;
      
      if (provider === 'replit') {
        deployment = await CloudIntegrationService.deployToReplit(
          currentProject.name, 
          currentProject.files
        );
      } else {
        deployment = await CloudIntegrationService.deployToGitHub(
          currentProject.name, 
          currentProject.files
        );
      }

      setDeploymentStatus(deployment);
      
      if (deployment.status === 'success') {
        // Open deployment URL in new tab
        window.open(deployment.url, '_blank');
      } else {
        alert(`Ошибка развертывания: ${deployment.message}`);
      }
    } catch (error) {
      alert(`Ошибка развертывания: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">AI IDE</h1>
            <Badge variant="secondary" className="text-xs">
              Powered by Gemini 2.5 Flash
            </Badge>
          </div>
          
          {currentProject && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Folder className="w-4 h-4" />
              <span>{currentProject.name}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isApiConfigured && (
            <Badge variant="destructive" className="text-xs">
              Настройте API ключ
            </Badge>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleCloudDeploy('github')}
            disabled={isDeploying}
          >
            {isDeploying ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            GitHub
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => handleCloudDeploy('replit')}
            disabled={isDeploying}
          >
            {isDeploying ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            Replit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <Tabs defaultValue="files" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="files" className="flex items-center gap-1">
                  <Folder className="w-4 h-4" />
                  Файлы
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  Настройки
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="files" className="flex-1 mt-0">
                <FileManager
                  files={currentProject?.files || []}
                  currentFile={getCurrentFile()}
                  onFileSelect={handleFileSelect}
                  onFileCreate={handleFileCreate}
                  onFileUpload={handleFileUpload}
                  onProjectDownload={handleProjectDownload}
                  className="h-full border-0"
                />
              </TabsContent>
              
              <TabsContent value="settings" className="flex-1 mt-0 overflow-y-auto">
                <div className="p-4">
                  <ApiKeySettings onApiKeyChange={setIsApiConfigured} />
                </div>
              </TabsContent>
            </Tabs>
          </ResizablePanel>

          <ResizableHandle />

          {/* Main Editor Area */}
          <ResizablePanel defaultSize={55} minSize={30}>
            <div className="h-full flex flex-col">
              {/* File Tabs */}
              {openFiles.length > 0 && (
                <div className="border-b flex items-center">
                  <div className="flex-1 flex overflow-x-auto">
                    {openFiles.map(file => (
                      <div
                        key={file.id}
                        className={`flex items-center gap-2 px-3 py-2 border-r cursor-pointer hover:bg-muted ${
                          activeFileId === file.id ? 'bg-background' : 'bg-muted'
                        }`}
                        onClick={() => setActiveFileId(file.id)}
                      >
                        <Code className="w-4 h-4" />
                        <span className="text-sm">{file.filename}</span>
                        {file.isDirty && (
                          <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-orange-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-4 h-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileClose(file.id);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Editor */}
              <div className="flex-1">
                {getCurrentFile() ? (
                  <CodeEditor
                    file={getCurrentFile()!}
                    onContentChange={handleContentChange}
                    onSave={handleFileSave}
                    className="h-full"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">Добро пожаловать в AI IDE</h3>
                      <p className="text-sm">Выберите файл для редактирования или создайте новый</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Sidebar - AI Chat & Preview */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <Tabs defaultValue="chat" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  ИИ Чат
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Предпросмотр
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat" className="flex-1 mt-0">
                <AiChat
                  onCodeGenerated={handleCodeGenerated}
                  onFileCreate={(file) => handleFileSelect(file)}
                  currentProject={currentProject?.name}
                  className="h-full border-0"
                />
              </TabsContent>
              
              <TabsContent value="preview" className="flex-1 mt-0">
                <LivePreview
                  files={currentProject?.files || []}
                  currentProject={currentProject?.name || 'Проект'}
                  className="h-full border-0"
                />
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <footer className="border-t px-4 py-1 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {getCurrentFile() && (
            <>
              <span>Строк: {getCurrentFile()!.content.split('\n').length}</span>
              <span>Символов: {getCurrentFile()!.content.length}</span>
              <span>Язык: {getCurrentFile()!.language}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span>AI IDE v1.0</span>
          <Separator orientation="vertical" className="h-3" />
          <span>Готов к работе</span>
        </div>
      </footer>
    </div>
  );
};