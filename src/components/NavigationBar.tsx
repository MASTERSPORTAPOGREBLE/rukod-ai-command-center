
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Terminal, FileCode, Settings, Database } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useIsMobile } from '../hooks/use-mobile';

export const NavigationBar = () => {
  const location = useLocation();
  const { currentTheme } = useTheme();
  const isMobile = useIsMobile();

  const navItems = [
    {
      name: 'Главная',
      icon: <Home className="w-5 h-5" />,
      path: '/'
    },
    {
      name: 'Терминал',
      icon: <Terminal className="w-5 h-5" />,
      path: '/terminal'
    },
    {
      name: 'Код',
      icon: <FileCode className="w-5 h-5" />,
      path: '/code'
    },
    {
      name: 'Библиотеки',
      icon: <Database className="w-5 h-5" />,
      path: '/libraries'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-slate-950 bg-opacity-95 backdrop-blur-sm z-10">
      <div className="container mx-auto flex justify-around items-center">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-3 px-4 transition-colors ${
              location.pathname === item.path
                ? 'text-rukod-purple'
                : 'text-slate-300 hover:text-slate-100'
            }`}
            style={{
              color: location.pathname === item.path ? currentTheme.primaryColor : undefined
            }}
          >
            <div className="mb-1">{item.icon}</div>
            {!isMobile && <span className="text-xs font-medium">{item.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};
