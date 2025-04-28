
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, MessageSquare, LogOut, Terminal, Package, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const NavigationBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  
  const handleTabClick = (tab: string) => {
    setActiveTab(activeTab === tab ? null : tab);
  };
  
  return (
    <div className="h-16 border-t border-border bg-rukod-dark flex items-center justify-center px-4">
      <div className="flex space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/" className={({ isActive }) => 
                `flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
                  isActive ? 'bg-rukod-purple bg-opacity-20' : 'hover:bg-rukod-purple hover:bg-opacity-10'
                }`
              }>
                {({ isActive }) => (
                  <Home className={`h-5 w-5 ${isActive ? 'text-rukod-purple' : 'text-white'}`} />
                )}
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>Главная</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/terminal" className={({ isActive }) => 
                `flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
                  isActive ? 'bg-rukod-purple bg-opacity-20' : 'hover:bg-rukod-purple hover:bg-opacity-10'
                }`
              }>
                {({ isActive }) => (
                  <Terminal className={`h-5 w-5 ${isActive ? 'text-rukod-purple' : 'text-white'}`} />
                )}
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>Терминал</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink to="/libraries" className={({ isActive }) => 
                `flex items-center justify-center w-10 h-10 rounded-md transition-colors ${
                  isActive ? 'bg-rukod-purple bg-opacity-20' : 'hover:bg-rukod-purple hover:bg-opacity-10'
                }`
              }>
                {({ isActive }) => (
                  <Package className={`h-5 w-5 ${isActive ? 'text-rukod-purple' : 'text-white'}`} />
                )}
              </NavLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>Библиотеки</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleTabClick('settings')}
                className={activeTab === 'settings' ? 'bg-rukod-purple bg-opacity-20' : ''}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Настройки</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleTabClick('feedback')}
                className={activeTab === 'feedback' ? 'bg-rukod-purple bg-opacity-20' : ''}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Обратная связь</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleTabClick('exit')}
                className={activeTab === 'exit' ? 'bg-rukod-purple bg-opacity-20' : ''}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Выход</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
