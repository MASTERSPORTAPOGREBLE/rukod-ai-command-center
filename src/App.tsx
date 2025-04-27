
import { ThemeProvider } from './context/ThemeContext';
import { LibraryManager } from './components/LibraryManager';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <LibraryManager />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
