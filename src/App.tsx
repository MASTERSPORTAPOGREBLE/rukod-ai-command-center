
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ContainerProvider } from './context/ContainerContext';
import { CommandProvider } from './context/CommandContext';
import { Toaster } from 'sonner';
import { NavigationBar } from './components/NavigationBar';

// Pages
import HomePage from './pages/HomePage';
import Terminal from './pages/Terminal';
import CodeTerminal from './pages/CodeTerminal';
import NotFound from './pages/NotFound';
import Libraries from './pages/Libraries';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ContainerProvider>
        <CommandProvider>
          <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="container mx-auto py-2 px-1 md:px-4 h-[calc(100vh-56px)]">
              <h1 className="text-2xl font-bold mb-4 text-center text-rukod-purple">CodeVerse IDE</h1>
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/terminal" element={<Terminal />} />
                <Route path="/code" element={<CodeTerminal />} />
                <Route path="/libraries" element={<Libraries />} />
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
