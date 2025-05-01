
import React from 'react';

interface CommandExampleProps {
  command: string;
  description: string;
}

const CommandExample: React.FC<CommandExampleProps> = ({ command, description }) => (
  <div className="p-2 rounded bg-opacity-10" style={{ backgroundColor: 'currentColor' }}>
    <div className="font-mono text-sm">{command}</div>
    <div className="text-xs opacity-70">{description}</div>
  </div>
);

interface TerminalHelpTabProps {
  currentTheme: any;
}

export const TerminalHelpTab: React.FC<TerminalHelpTabProps> = ({ currentTheme }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold" style={{ color: currentTheme.primaryColor }}>
        Справка по командам
      </h3>
      
      <div className="space-y-2">
        <h4 className="text-md font-semibold">Общие команды</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <CommandExample 
            command="помощь" 
            description="Показать справку по командам" 
          />
          <CommandExample 
            command="очистить" 
            description="Очистить историю команд" 
          />
          <CommandExample 
            command="статус" 
            description="Показать текущий статус системы" 
          />
          <CommandExample 
            command="инфо [тема]" 
            description="Показать информацию по теме" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-md font-semibold">Управление библиотеками</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <CommandExample 
            command="установить библиотеку [имя] для [язык]" 
            description="Установить библиотеку для указанного языка" 
          />
          <CommandExample 
            command="список библиотек [язык]" 
            description="Показать список установленных библиотек" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-md font-semibold">Управление контейнерами</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <CommandExample 
            command="container start [язык]" 
            description="Запустить контейнер для указанного языка" 
          />
          <CommandExample 
            command="container stop [id]" 
            description="Остановить указанный контейнер" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-md font-semibold">Выполнение кода</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <CommandExample 
            command="выполнить [имя файла]" 
            description="Запустить указанный файл" 
          />
          <CommandExample 
            command="дебаг [имя файла]" 
            description="Запустить в режиме отладки" 
          />
        </div>
      </div>
      
      <div className="p-4 rounded bg-opacity-10" style={{ backgroundColor: currentTheme.accentColor }}>
        <h4 className="text-md font-semibold mb-2">Примеры команд:</h4>
        <div className="space-y-1">
          <div className="font-mono text-sm">container start python</div>
          <div className="font-mono text-sm">container list</div>
          <div className="font-mono text-sm">установить numpy</div>
          <div className="font-mono text-sm">выполнить main.py</div>
          <div className="font-mono text-sm">очистить</div>
        </div>
      </div>
    </div>
  );
};
