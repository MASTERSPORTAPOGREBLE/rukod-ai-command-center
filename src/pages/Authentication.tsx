
import React from 'react';
import { AuthenticationForm } from '../components/AuthenticationForm';
import { useTheme } from '../context/ThemeContext';

const Authentication = () => {
  const { currentTheme } = useTheme();
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.primaryColor }}>
            РУКОД
          </h1>
          <p className="text-slate-400 mt-2">Система контроля исполнения кода</p>
        </div>
        
        <AuthenticationForm />
        
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} РУКОД. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
