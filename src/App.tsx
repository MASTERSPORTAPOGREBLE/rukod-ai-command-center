
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ContainerProvider } from './context/ContainerContext';
import { CommandProvider } from './context/CommandContext';
import { AuthProvider } from './context/AuthContext'; // Add AuthProvider
import { Toaster } from 'sonner';
import { NavigationBar } from './components/NavigationBar';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import Terminal from './pages/Terminal';
import CodeTerminal from './pages/CodeTerminal';
import NotFound from './pages/NotFound';
import Libraries from './pages/Libraries';
import Authentication from './pages/Authentication';
import Help from './pages/Help';
import UserProfile from './pages/UserProfile'; // New page for user profile

import './App.css';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  
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
                <Route path="/auth" element={!isAuthenticated ? <Authentication /> : <Navigate to="/" replace />} />
                
                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/terminal" element={<ProtectedRoute><Terminal /></ProtectedRoute>} />
                <Route path="/code" element={<ProtectedRoute><CodeTerminal /></ProtectedRoute>} />
                <Route path="/libraries" element={<ProtectedRoute><Libraries /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
