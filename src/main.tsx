
// Explicit import of React to ensure it's available
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { MobileOptimizer } from './utils/mobileOptimization';
import './index.css';

// Активируем мобильные оптимизации
MobileOptimizer.activate();

const rootElement = document.getElementById("root");

// Make sure rootElement exists before attempting to render
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
