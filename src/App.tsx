
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { AiIde } from './components/ide/AiIde';
import './App.css';

function App() {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange
    >
      <AiIde />
    </ThemeProvider>
  );
}

export default App;
