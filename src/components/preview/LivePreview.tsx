import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Monitor, 
  Smartphone, 
  Tablet,
  Eye,
  Code,
  Download,
  ExternalLink,
  Zap,
  AlertCircle
} from 'lucide-react';
import { FileNode } from '../fileManager/FileManager';

interface LivePreviewProps {
  files: FileNode[];
  currentProject?: string;
  className?: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface PreviewError {
  message: string;
  line?: number;
  column?: number;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ 
  files, 
  currentProject = 'Проект',
  className = '' 
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [errors, setErrors] = useState<PreviewError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Автоматическое обновление при изменении файлов
  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        generatePreview();
      }, 1000); // Обновляем через 1 секунду после изменения

      return () => clearTimeout(timer);
    }
  }, [files, isRunning]);

  // Генерация HTML для предпросмотра
  const generatePreview = async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      const htmlContent = await buildPreviewHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Освобождаем предыдущий URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setPreviewUrl(url);
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Ошибка генерации предпросмотра:', error);
      setErrors([{ message: `Ошибка: ${error}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Построение HTML из файлов проекта
  const buildPreviewHTML = async (): Promise<string> => {
    const htmlFiles = files.filter(f => f.name.endsWith('.html'));
    const cssFiles = files.filter(f => f.name.endsWith('.css'));
    const jsFiles = files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.ts'));
    const reactFiles = files.filter(f => f.name.endsWith('.jsx') || f.name.endsWith('.tsx'));

    let htmlContent = '';

    if (reactFiles.length > 0) {
      // React проект
      htmlContent = await buildReactPreview(reactFiles, cssFiles);
    } else if (htmlFiles.length > 0) {
      // Обычный HTML проект
      htmlContent = await buildHTMLPreview(htmlFiles[0], cssFiles, jsFiles);
    } else {
      // Создаем базовый HTML из JS/CSS
      htmlContent = await buildBasicPreview(jsFiles, cssFiles);
    }

    return htmlContent;
  };

  // Предпросмотр React проекта
  const buildReactPreview = async (reactFiles: FileNode[], cssFiles: FileNode[]): Promise<string> => {
    const mainComponent = reactFiles.find(f => 
      f.name.includes('App') || f.name.includes('main') || f.name.includes('index')
    ) || reactFiles[0];

    const styles = cssFiles.map(f => f.content).join('\n');
    
    // Простая трансформация JSX в обычный JS для предпросмотра
    const jsCode = transformJSXToJS(mainComponent.content || '');

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentProject} - Предпросмотр</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
        }
        #root {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .preview-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            font-weight: 600;
        }
        .preview-content {
            padding: 20px;
        }
        ${styles}
    </style>
</head>
<body>
    <div id="root">
        <div class="preview-header">
            🚀 ${currentProject} - Live Preview
        </div>
        <div class="preview-content" id="app-content">
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">⚡</div>
                <h2>Загрузка React компонента...</h2>
                <p>Компилируем JSX код...</p>
            </div>
        </div>
    </div>

    <script type="text/babel">
        try {
            ${jsCode}
            
            // Рендерим компонент
            const container = document.getElementById('app-content');
            if (typeof App !== 'undefined') {
                ReactDOM.render(React.createElement(App), container);
            } else {
                container.innerHTML = \`
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                        <h2>Компонент загружен!</h2>
                        <p>React код успешно скомпилирован</p>
                        <pre style="background: #f0f0f0; padding: 15px; border-radius: 5px; text-align: left; overflow-x: auto;">
${jsCode.substring(0, 200)}...
                        </pre>
                    </div>
                \`;
            }
        } catch (error) {
            console.error('Ошибка рендера:', error);
            document.getElementById('app-content').innerHTML = \`
                <div style="text-align: center; padding: 40px; color: #e74c3c;">
                    <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
                    <h2>Ошибка компиляции</h2>
                    <p>\${error.message}</p>
                    <pre style="background: #ffebee; padding: 15px; border-radius: 5px; text-align: left;">
\${error.stack}
                    </pre>
                </div>
            \`;
        }
    </script>
</body>
</html>`;
  };

  // Предпросмотр HTML проекта
  const buildHTMLPreview = async (htmlFile: FileNode, cssFiles: FileNode[], jsFiles: FileNode[]): Promise<string> => {
    let htmlContent = htmlFile.content || '';
    
    // Вставляем CSS
    const styles = cssFiles.map(f => f.content).join('\n');
    if (styles) {
      htmlContent = htmlContent.replace(
        '</head>',
        `<style>${styles}</style></head>`
      );
    }

    // Вставляем JS
    const scripts = jsFiles.map(f => f.content).join('\n');
    if (scripts) {
      htmlContent = htmlContent.replace(
        '</body>',
        `<script>${scripts}</script></body>`
      );
    }

    return htmlContent;
  };

  // Базовый предпросмотр
  const buildBasicPreview = async (jsFiles: FileNode[], cssFiles: FileNode[]): Promise<string> => {
    const styles = cssFiles.map(f => f.content).join('\n');
    const scripts = jsFiles.map(f => f.content).join('\n');

    return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentProject} - Предпросмотр</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            font-family: system-ui, sans-serif;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        ${styles}
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 ${currentProject}</h1>
        <div id="app">
            <p>Код выполняется...</p>
        </div>
    </div>
    <script>
        try {
            ${scripts}
        } catch (error) {
            document.getElementById('app').innerHTML = \`
                <div style="color: red; padding: 20px; background: #ffebee; border-radius: 5px;">
                    <strong>Ошибка выполнения:</strong><br>
                    \${error.message}
                </div>
            \`;
        }
    </script>
</body>
</html>`;
  };

  // Простая трансформация JSX в JS
  const transformJSXToJS = (jsxCode: string): string => {
    // Убираем импорты React (они уже подключены)
    let code = jsxCode.replace(/import.*from.*['"]react['"];?\n?/g, '');
    code = code.replace(/import.*from.*['"]react-dom['"];?\n?/g, '');
    
    // Простые замены для базовой поддержки JSX
    code = code.replace(/export\s+default\s+/g, '');
    
    return code;
  };

  // Запуск предпросмотра
  const handleRun = () => {
    setIsRunning(true);
    generatePreview();
  };

  // Остановка предпросмотра
  const handleStop = () => {
    setIsRunning(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  // Обновление предпросмотра
  const handleRefresh = () => {
    if (isRunning) {
      generatePreview();
    }
  };

  // Размеры viewport
  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile': return { width: '375px', height: '667px' };
      case 'tablet': return { width: '768px', height: '1024px' };
      default: return { width: '100%', height: '600px' };
    }
  };

  // Открыть в новом окне
  const openInNewWindow = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  // Скачать HTML
  const downloadHTML = async () => {
    try {
      const htmlContent = await buildPreviewHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentProject.toLowerCase().replace(/\s+/g, '-')}-preview.html`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка скачивания:', error);
    }
  };

  const dimensions = getViewportDimensions();

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Live Preview
            {isRunning && (
              <Badge variant="default" className="bg-green-500">
                <Zap className="w-3 h-3 mr-1" />
                Запущен
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Viewport переключатель */}
            <div className="flex items-center gap-1 bg-muted rounded-md p-1">
              <Button
                variant={viewport === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewport('desktop')}
                className="h-8 w-8 p-0"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={viewport === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewport('tablet')}
                className="h-8 w-8 p-0"
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={viewport === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewport('mobile')}
                className="h-8 w-8 p-0"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Управление */}
            {!isRunning ? (
              <Button onClick={handleRun} size="sm" className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-1" />
                Запустить
              </Button>
            ) : (
              <Button onClick={handleStop} size="sm" variant="destructive">
                <Square className="w-4 h-4 mr-1" />
                Остановить
              </Button>
            )}

            <Button onClick={handleRefresh} size="sm" variant="outline" disabled={!isRunning}>
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button onClick={openInNewWindow} size="sm" variant="outline" disabled={!previewUrl}>
              <ExternalLink className="w-4 h-4" />
            </Button>

            <Button onClick={downloadHTML} size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Ошибки */}
        {errors.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
              <AlertCircle className="w-4 h-4" />
              Ошибки предпросмотра:
            </div>
            {errors.map((error, index) => (
              <div key={index} className="text-sm text-red-700">
                {error.line && `Строка ${error.line}: `}{error.message}
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <div className="h-full flex items-center justify-center bg-muted/30">
          {!isRunning ? (
            <div className="text-center text-muted-foreground">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-lg font-medium mb-2">Предпросмотр не запущен</h3>
              <p className="text-sm mb-4">Нажмите "Запустить" чтобы увидеть результат</p>
              <Button onClick={handleRun} className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                Запустить предпросмотр
              </Button>
            </div>
          ) : isLoading ? (
            <div className="text-center text-muted-foreground">
              <div className="text-6xl mb-4 animate-spin">⚡</div>
              <h3 className="text-lg font-medium mb-2">Компиляция...</h3>
              <p className="text-sm">Генерируем предпросмотр</p>
            </div>
          ) : previewUrl ? (
            <div 
              className="bg-white border rounded-lg shadow-lg overflow-hidden mx-4 transition-all duration-300"
              style={{
                width: dimensions.width,
                height: dimensions.height,
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              <div className="bg-gray-100 px-3 py-2 border-b flex items-center gap-2 text-xs text-gray-600">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <span className="flex-1 text-center">{currentProject} - Live Preview</span>
                <Badge variant="outline" className="text-xs">
                  {viewport}
                </Badge>
              </div>
              <iframe
                ref={iframeRef}
                src={previewUrl}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms"
                title="Live Preview"
              />
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-lg font-medium mb-2">Ошибка загрузки</h3>
              <p className="text-sm mb-4">Не удалось создать предпросмотр</p>
              <Button onClick={handleRefresh} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Попробовать снова
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};