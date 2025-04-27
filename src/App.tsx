
import { ThemeProvider } from './context/ThemeContext';
import { ContainerProvider } from './context/ContainerContext';
import { LibraryManager } from './components/LibraryManager';
import { ContainerManager } from './components/ContainerManager';
import { SystemStats } from './components/SystemStats';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ContainerProvider>
        <div className="min-h-screen bg-slate-950 text-slate-50">
          <div className="container mx-auto py-4 px-4 md:px-8">
            <h1 className="text-2xl font-bold mb-6 text-center">CodeVerse IDE</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="mb-6">
                  <SystemStats />
                </div>
                <LibraryManager />
              </div>
              
              <div className="md:col-span-1">
                <ContainerManager />
              </div>
            </div>
          </div>
          <Toaster />
        </div>
      </ContainerProvider>
    </ThemeProvider>
  );
}

export default App;
