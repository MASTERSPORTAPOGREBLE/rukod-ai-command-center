
import React from 'react';
import { useContainer } from '../context/ContainerContext';
import { useTheme } from '../context/ThemeContext';
import { ProgrammingLanguage } from '../models/types';
import { Server, RefreshCw, Power, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const ContainerManager: React.FC = () => {
  const { containers, loadContainer, stopContainer, restartContainer } = useContainer();
  const { currentTheme } = useTheme();

  const handleLoadContainer = async (language: ProgrammingLanguage) => {
    try {
      toast.promise(
        loadContainer(language),
        {
          loading: `Запуск ${language} контейнера...`,
          success: `${language} контейнер успешно запущен!`,
          error: `Ошибка запуска ${language} контейнера`
        }
      );
    } catch (error) {
      console.error(`Error loading ${language} container:`, error);
    }
  };

  const handleStopContainer = async (containerId: string, name: string) => {
    try {
      toast.promise(
        stopContainer(containerId),
        {
          loading: `Остановка контейнера ${name}...`,
          success: `Контейнер ${name} остановлен`,
          error: `Ошибка остановки контейнера ${name}`
        }
      );
    } catch (error) {
      console.error(`Error stopping container ${containerId}:`, error);
    }
  };

  const handleRestartContainer = async (containerId: string, name: string) => {
    try {
      toast.promise(
        restartContainer(containerId),
        {
          loading: `Перезапуск контейнера ${name}...`,
          success: `Контейнер ${name} перезапущен`,
          error: `Ошибка перезапуска контейнера ${name}`
        }
      );
    } catch (error) {
      console.error(`Error restarting container ${containerId}:`, error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500';
      case 'stopped': return 'text-gray-400';
      case 'error': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const availableLanguages: ProgrammingLanguage[] = ['python', 'cpp', 'lua', 'rust', 'ruby', 'javascript'];

  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: currentTheme.backgroundColor, color: currentTheme.textColor }}>
      <div className="flex items-center mb-4">
        <Server className="h-5 w-5 mr-2" style={{ color: currentTheme.primaryColor }} />
        <h3 className="text-lg font-semibold">Контейнеры</h3>
      </div>
      
      {containers.length > 0 ? (
        <div className="space-y-3 mb-4">
          {containers.map((container) => (
            <div 
              key={container.id}
              className="flex items-center justify-between p-2 rounded-md"
              style={{ backgroundColor: `${currentTheme.primaryColor}15` }}
            >
              <div className="flex items-center">
                <div className={`h-2 w-2 rounded-full mr-2 ${getStatusColor(container.status)}`} />
                <div>
                  <div className="font-medium">{container.language}</div>
                  <div className="text-xs opacity-70">
                    {container.status === 'running' ? (
                      <span>
                        RAM: {Math.round(container.memoryUsage)}% | 
                        CPU: {Math.round(container.cpuUsage)}%
                      </span>
                    ) : (
                      <span>Неактивен</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                {container.status === 'running' ? (
                  <>
                    <button 
                      className="p-1 rounded hover:bg-black/10"
                      onClick={() => handleRestartContainer(container.id, container.name)}
                      title="Перезапустить"
                    >
                      <RefreshCw className="h-4 w-4" style={{ color: currentTheme.secondaryColor }} />
                    </button>
                    <button 
                      className="p-1 rounded hover:bg-black/10"
                      onClick={() => handleStopContainer(container.id, container.name)}
                      title="Остановить"
                    >
                      <Power className="h-4 w-4" style={{ color: currentTheme.accentColor }} />
                    </button>
                  </>
                ) : (
                  <button 
                    className="p-1 rounded hover:bg-black/10"
                    onClick={() => handleLoadContainer(container.language)}
                    title="Запустить"
                  >
                    <Power className="h-4 w-4" style={{ color: currentTheme.primaryColor }} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 opacity-70 flex flex-col items-center">
          <AlertCircle className="h-5 w-5 mb-2" />
          <p>Нет запущенных контейнеров</p>
        </div>
      )}
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Доступные языки</h4>
        <div className="flex flex-wrap gap-2">
          {availableLanguages.map(language => (
            <button
              key={language}
              className="text-xs px-3 py-1.5 rounded-full transition-colors"
              style={{ 
                backgroundColor: `${currentTheme.primaryColor}25`,
                color: currentTheme.textColor
              }}
              onClick={() => handleLoadContainer(language)}
            >
              {language}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
