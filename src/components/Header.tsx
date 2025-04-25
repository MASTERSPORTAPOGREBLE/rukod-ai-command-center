
import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  
  return (
    <header className="h-16 border-b border-border bg-rukod-dark flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-rukod-purple to-rukod-blue bg-clip-text text-transparent">
          РУКОД AI Command Center
        </h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Профиль</DropdownMenuItem>
            <DropdownMenuItem>Настройки</DropdownMenuItem>
            <DropdownMenuItem>Темы</DropdownMenuItem>
            <DropdownMenuItem>Модули</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLoggedIn(!loggedIn)}>
              {loggedIn ? 'Выйти' : 'Войти'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {loggedIn ? (
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-rukod-purple to-rukod-blue flex items-center justify-center text-white font-bold">
            У
          </div>
        ) : (
          <Button variant="outline" size="sm">
            Войти
          </Button>
        )}
      </div>
    </header>
  );
};
