import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  File, 
  Plus, 
  Trash2, 
  Edit2, 
  Download, 
  Upload,
  FolderPlus,
  Search,
  FileText,
  Code,
  Image,
  Archive
} from 'lucide-react';
import { CodeFile } from '../editor/CodeEditor';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  language?: string;
  size?: number;
  modified?: Date;
  children?: FileNode[];
  isExpanded?: boolean;
}

interface FileManagerProps {
  files: FileNode[];
  currentFile?: CodeFile;
  onFileSelect?: (file: CodeFile) => void;
  onFileCreate?: (path: string, name: string, type: 'file' | 'folder') => void;
  onFileDelete?: (path: string) => void;
  onFileRename?: (oldPath: string, newName: string) => void;
  onFileUpload?: (files: FileList) => void;
  onProjectDownload?: () => void;
  className?: string;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  currentFile,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileUpload,
  onProjectDownload,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    // Auto-expand folders containing the current file
    if (currentFile) {
      const pathParts = currentFile.filename.split('/');
      const foldersToExpand = new Set<string>();
      let currentPath = '';
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentPath += (currentPath ? '/' : '') + pathParts[i];
        foldersToExpand.add(currentPath);
      }
      
      setExpandedFolders(prev => new Set([...prev, ...foldersToExpand]));
    }
  }, [currentFile]);

  const getFileIcon = (fileName: string, isFolder: boolean) => {
    if (isFolder) return <Folder className="w-4 h-4" />;
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'py':
      case 'java':
      case 'cpp':
      case 'c':
      case 'go':
      case 'rs':
      case 'php':
        return <Code className="w-4 h-4" />;
      case 'txt':
      case 'md':
      case 'json':
      case 'xml':
      case 'yml':
      case 'yaml':
        return <FileText className="w-4 h-4" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="w-4 h-4" />;
      case 'zip':
      case 'tar':
      case 'gz':
        return <Archive className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getFileLanguage = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
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
    
    return langMap[ext] || 'plaintext';
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'folder') {
      toggleFolder(file.path);
    } else if (onFileSelect && file.content !== undefined) {
      const codeFile: CodeFile = {
        id: file.id,
        filename: file.name,
        content: file.content,
        language: file.language || getFileLanguage(file.name),
      };
      onFileSelect(codeFile);
    }
  };

  const handleFileRename = (file: FileNode) => {
    setEditingFile(file.path);
    setNewFileName(file.name);
  };

  const saveFileRename = () => {
    if (editingFile && newFileName && onFileRename) {
      onFileRename(editingFile, newFileName);
    }
    setEditingFile(null);
    setNewFileName('');
  };

  const cancelFileRename = () => {
    setEditingFile(null);
    setNewFileName('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && onFileUpload) {
      onFileUpload(files);
    }
    // Reset input
    event.target.value = '';
  };

  const filterFiles = (nodes: FileNode[], term: string): FileNode[] => {
    if (!term) return nodes;
    
    return nodes.filter(node => {
      if (node.name.toLowerCase().includes(term.toLowerCase())) {
        return true;
      }
      if (node.type === 'folder' && node.children) {
        const filteredChildren = filterFiles(node.children, term);
        return filteredChildren.length > 0;
      }
      return false;
    }).map(node => ({
      ...node,
      children: node.children ? filterFiles(node.children, term) : undefined
    }));
  };

  const renderFileTree = (nodes: FileNode[], depth = 0): React.ReactNode => {
    const filteredNodes = searchTerm ? filterFiles(nodes, searchTerm) : nodes;
    
    return filteredNodes.map((node) => (
      <div key={node.path}>
        <div
          className={`flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer ${
            currentFile?.filename === node.name ? 'bg-accent' : ''
          }`}
          style={{ paddingLeft: `${8 + depth * 16}px` }}
          onClick={() => handleFileClick(node)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getFileIcon(node.name, node.type === 'folder')}
            
            {editingFile === node.path ? (
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveFileRename();
                  if (e.key === 'Escape') cancelFileRename();
                }}
                onBlur={saveFileRename}
                className="h-6 py-0 text-sm"
                autoFocus
              />
            ) : (
              <span className="truncate text-sm">{node.name}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {node.type === 'file' && node.size && (
              <Badge variant="outline" className="text-xs px-1 py-0">
                {formatFileSize(node.size)}
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleFileRename(node);
              }}
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (onFileDelete && confirm(`Удалить ${node.name}?`)) {
                  onFileDelete(node.path);
                }
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {node.type === 'folder' && 
         node.children && 
         (expandedFolders.has(node.path) || searchTerm) && (
          <div>
            {renderFileTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <Card className={`${className} flex flex-col h-full`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Файлы проекта
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск файлов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFileCreate?.('', 'новый_файл.txt', 'file')}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Файл
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFileCreate?.('', 'новая_папка', 'folder')}
            className="flex items-center gap-1"
          >
            <FolderPlus className="w-4 h-4" />
            Папка
          </Button>
          
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
              <span>
                <Upload className="w-4 h-4" />
                Загрузить
              </span>
            </Button>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          {onProjectDownload && (
            <Button
              variant="outline"
              size="sm"
              onClick={onProjectDownload}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Скачать
            </Button>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-2">
          <div className="space-y-1 group">
            {files.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Folder className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Нет файлов в проекте</p>
                <p className="text-sm">Создайте или загрузите файлы</p>
              </div>
            ) : (
              renderFileTree(files)
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};