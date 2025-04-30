
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ContainerProvider } from './context/ContainerContext';
import { CommandProvider } from './context/CommandContext';
import { Toaster } from 'sonner';
import { NavigationBar } from './components/NavigationBar';
import { ThemeCustomizer } from './components/ThemeCustomizer';

// Pages
import HomePage from './pages/HomePage';
import Terminal from './pages/Terminal';
import CodeTerminal from './pages/CodeTerminal';
import NotFound from './pages/NotFound';
import Libraries from './pages/Libraries';
import Authentication from './pages/Authentication';
import Help from './pages/Help';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ContainerProvider>
        <CommandProvider>
          <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="container mx-auto py-2 px-1 md:px-4 h-[calc(100vh-56px)]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-rukod-purple">CodeVerse IDE</h1>
                <div className="flex items-center space-x-2">
                  <ThemeCustomizer />
                </div>
              </div>
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/terminal" element={<Terminal />} />
                <Route path="/code" element={<CodeTerminal />} />
                <Route path="/libraries" element={<Libraries />} />
                <Route path="/auth" element={<Authentication />} />
                <Route path="/help" element={<Help />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <NavigationBar />
            <Toaster position="top-right" />
          </div>
        </CommandProvider>
      </ContainerProvider>
    </ThemeProvider>
  );
}

export default App;
