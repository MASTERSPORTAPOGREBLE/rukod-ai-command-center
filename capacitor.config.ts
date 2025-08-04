import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ai.ide.app',
  appName: 'AI IDE',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1a1a1a",
      showSpinner: true,
      spinnerColor: "#007DFF"
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: "#1a1a1a"
    },
    Keyboard: {
      resize: 'body',
      style: 'DARK'
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    appendUserAgent: 'AI-IDE-Mobile',
    backgroundColor: '#1a1a1a'
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#1a1a1a'
  }
};

export default config;