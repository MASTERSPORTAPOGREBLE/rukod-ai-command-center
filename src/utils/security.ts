/**
 * Security utilities for API key management and encryption
 */

// Simple encryption for storing API keys locally (browser storage)
export const encryptApiKey = (apiKey: string, encryptionKey: string): string => {
  if (!apiKey || !encryptionKey) return '';
  
  // Simple XOR encryption for demo purposes
  // In production, use a proper encryption library like crypto-js
  let encrypted = '';
  for (let i = 0; i < apiKey.length; i++) {
    const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
    const apiChar = apiKey.charCodeAt(i);
    encrypted += String.fromCharCode(apiChar ^ keyChar);
  }
  return btoa(encrypted); // Base64 encode
};

export const decryptApiKey = (encryptedKey: string, encryptionKey: string): string => {
  if (!encryptedKey || !encryptionKey) return '';
  
  try {
    const encrypted = atob(encryptedKey); // Base64 decode
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const keyChar = encryptionKey.charCodeAt(i % encryptionKey.length);
      const encChar = encrypted.charCodeAt(i);
      decrypted += String.fromCharCode(encChar ^ keyChar);
    }
    return decrypted;
  } catch {
    return '';
  }
};

// API key validation
export const validateGeminiApiKey = (apiKey: string): boolean => {
  // Basic validation for Gemini API key format
  return apiKey.length > 0 && apiKey.startsWith('AIza');
};

// Secure storage management
export class SecureStorage {
  private static readonly STORAGE_PREFIX = 'ai_ide_';
  private static readonly ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default_key';

  static setApiKey(provider: string, apiKey: string): void {
    const encrypted = encryptApiKey(apiKey, this.ENCRYPTION_KEY);
    localStorage.setItem(`${this.STORAGE_PREFIX}${provider}_key`, encrypted);
  }

  static getApiKey(provider: string): string {
    const encrypted = localStorage.getItem(`${this.STORAGE_PREFIX}${provider}_key`);
    if (!encrypted) return '';
    return decryptApiKey(encrypted, this.ENCRYPTION_KEY);
  }

  static removeApiKey(provider: string): void {
    localStorage.removeItem(`${this.STORAGE_PREFIX}${provider}_key`);
  }

  static clearAllKeys(): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.STORAGE_PREFIX)
    );
    keys.forEach(key => localStorage.removeItem(key));
  }
}

// Environment variable helpers
export const getEnvApiKey = (provider: string): string => {
  switch (provider) {
    case 'gemini':
      return import.meta.env.VITE_GEMINI_API_KEY || '';
    case 'deepseek':
      return import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    case 'qwen':
      return import.meta.env.VITE_QWEN_API_KEY || '';
    case 'huggingface':
      return import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
    case 'stability':
      return import.meta.env.VITE_STABILITY_API_KEY || '';
    case 'remove_bg':
      return import.meta.env.VITE_REMOVE_BG_API_KEY || '';
    case 'replit':
      return import.meta.env.VITE_REPLIT_TOKEN || '';
    case 'github':
      return import.meta.env.VITE_GITHUB_TOKEN || '';
    default:
      return '';
  }
};