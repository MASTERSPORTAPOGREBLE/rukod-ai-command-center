
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ContainerProvider } from './context/ContainerContext';
import { CommandProvider } from './context/CommandContext';
import { Toaster } from 'sonner';
import { NavigationBar } from './components/NavigationBar';

// Pages
import HomePage from './pages/HomePage';
import Terminal from './pages/Terminal';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ContainerProvider>
        <CommandProvider>
          <div className="min-h-screen bg-slate-950 text-slate-50">
            <div className="container mx-auto py-4 px-4 md:px-8">
              <h1 className="text-2xl font-bold mb-6 text-center">CodeVerse IDE</h1>
              
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/terminal" element={<Terminal />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <NavigationBar />
            <Toaster />
          </div>
        </CommandProvider>
      </ContainerProvider>
    </ThemeProvider>
  );
}

export default App;
