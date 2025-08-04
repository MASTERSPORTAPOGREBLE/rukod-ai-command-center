import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Key, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { SecureStorage, validateGeminiApiKey, getEnvApiKey } from '@/utils/security';
import { GeminiService } from '@/services/geminiService';

interface ApiKeySettingsProps {
  onApiKeyChange?: (configured: boolean) => void;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ onApiKeyChange }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [replitToken, setReplitToken] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  const [isGeminiValid, setIsGeminiValid] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const geminiService = new GeminiService();

  useEffect(() => {
    // Load existing keys on component mount
    loadExistingKeys();
  }, []);

  useEffect(() => {
    // Validate Gemini key whenever it changes
    setIsGeminiValid(validateGeminiApiKey(geminiKey));
  }, [geminiKey]);

  useEffect(() => {
    // Notify parent component when Gemini API key configuration changes
    onApiKeyChange?.(isGeminiValid && geminiKey.length > 0);
  }, [isGeminiValid, geminiKey, onApiKeyChange]);

  const loadExistingKeys = () => {
    // Load from environment variables first
    const envGeminiKey = getEnvApiKey('gemini');
    const envReplitToken = getEnvApiKey('replit');
    const envGithubToken = getEnvApiKey('github');

    // If not in env, load from secure storage
    setGeminiKey(envGeminiKey || SecureStorage.getApiKey('gemini') || '');
    setReplitToken(envReplitToken || SecureStorage.getApiKey('replit') || '');
    setGithubToken(envGithubToken || SecureStorage.getApiKey('github') || '');
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    setErrorMessage('');

    try {
      // Validate and save Gemini API key
      if (geminiKey) {
        if (!validateGeminiApiKey(geminiKey)) {
          throw new Error('Неверный формат API ключа Gemini. Ключ должен начинаться с "AIza"');
        }
        
        // Test the API key by making a simple request
        const testService = new GeminiService();
        testService.setApiKey(geminiKey);
        await testService.chatWithAI('Привет, это тест API ключа');
        
        SecureStorage.setApiKey('gemini', geminiKey);
      }

      // Save other tokens (basic validation)
      if (replitToken) {
        SecureStorage.setApiKey('replit', replitToken);
      }
      
      if (githubToken) {
        SecureStorage.setApiKey('github', githubToken);
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Ошибка сохранения API ключей:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Неизвестная ошибка');
      setSaveStatus('error');
    }
  };

  const handleClearAll = () => {
    if (confirm('Вы уверены, что хотите удалить все сохранённые API ключи?')) {
      SecureStorage.clearAllKeys();
      setGeminiKey('');
      setReplitToken('');
      setGithubToken('');
      setSaveStatus('idle');
      setErrorMessage('');
    }
  };

  const maskKey = (key: string) => {
    if (!key || showKeys) return key;
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Настройка API ключей
          </CardTitle>
          <CardDescription>
            Безопасное управление API ключами для интеграции с внешними сервисами.
            Ключи шифруются перед сохранением в локальном хранилище.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Gemini API Key */}
          <div className="space-y-2">
            <Label htmlFor="gemini-key" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Gemini API Key (обязательно)
              {isGeminiValid && geminiKey && <CheckCircle className="w-4 h-4 text-green-500" />}
            </Label>
            <div className="flex gap-2">
              <Input
                id="gemini-key"
                type={showKeys ? 'text' : 'password'}
                value={maskKey(geminiKey)}
                onChange={(e) => setGeminiKey(showKeys ? e.target.value : geminiKey)}
                onFocus={() => setShowKeys(true)}
                placeholder="AIza..."
                className={`flex-1 ${isGeminiValid && geminiKey ? 'border-green-500' : geminiKey && !isGeminiValid ? 'border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowKeys(!showKeys)}
              >
                {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {geminiKey && !isGeminiValid && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Неверный формат API ключа
              </p>
            )}
          </div>

          {/* Replit Token */}
          <div className="space-y-2">
            <Label htmlFor="replit-token" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Replit Token (опционально)
            </Label>
            <Input
              id="replit-token"
              type={showKeys ? 'text' : 'password'}
              value={maskKey(replitToken)}
              onChange={(e) => setReplitToken(showKeys ? e.target.value : replitToken)}
              onFocus={() => setShowKeys(true)}
              placeholder="Для интеграции с Replit"
            />
          </div>

          {/* GitHub Token */}
          <div className="space-y-2">
            <Label htmlFor="github-token" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              GitHub Token (опционально)
            </Label>
            <Input
              id="github-token"
              type={showKeys ? 'text' : 'password'}
              value={maskKey(githubToken)}
              onChange={(e) => setGithubToken(showKeys ? e.target.value : githubToken)}
              onFocus={() => setShowKeys(true)}
              placeholder="Для интеграции с GitHub Codespaces"
            />
          </div>

          {/* Status Messages */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {saveStatus === 'saved' && (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>API ключи успешно сохранены!</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={saveStatus === 'saving' || !geminiKey}
              className="flex items-center gap-2"
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Сохранить ключи
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700"
            >
              Очистить все
            </Button>
          </div>

          {/* Security Notice */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              🔒 Безопасность
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• API ключи шифруются перед сохранением</li>
              <li>• Ключи хранятся только в вашем браузере</li>
              <li>• Переменные окружения имеют приоритет над сохранёнными ключами</li>
              <li>• Используйте .env файл для разработки</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};