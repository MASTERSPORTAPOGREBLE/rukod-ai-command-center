import { SecureStorage, getEnvApiKey, validateGeminiApiKey } from '../utils/security';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface CodeGenerationRequest {
  prompt: string;
  language: string;
  context?: string;
  projectType?: string;
}

export interface GeneratedCode {
  code: string;
  language: string;
  filename: string;
  explanation: string;
}

export class GeminiService {
  private apiKey: string = '';
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

  constructor() {
    this.loadApiKey();
  }

  private loadApiKey(): void {
    // Try to get API key from environment variables first
    this.apiKey = getEnvApiKey('gemini');
    
    // If not found in env, try secure storage
    if (!this.apiKey) {
      this.apiKey = SecureStorage.getApiKey('gemini');
    }
  }

  public setApiKey(apiKey: string): boolean {
    if (!validateGeminiApiKey(apiKey)) {
      throw new Error('Неверный формат API ключа Gemini');
    }
    
    this.apiKey = apiKey;
    SecureStorage.setApiKey('gemini', apiKey);
    return true;
  }

  public isConfigured(): boolean {
    return this.apiKey.length > 0 && validateGeminiApiKey(this.apiKey);
  }

  public async generateCode(request: CodeGenerationRequest): Promise<GeneratedCode[]> {
    if (!this.isConfigured()) {
      throw new Error('API ключ Gemini не настроен');
    }

    const prompt = this.buildCodeGenerationPrompt(request);
    
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Ошибка API Gemini: ${errorData.error?.message || response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return this.parseCodeResponse(data, request.language);
    } catch (error) {
      console.error('Ошибка генерации кода:', error);
      throw error;
    }
  }

  private buildCodeGenerationPrompt(request: CodeGenerationRequest): string {
    return `
Ты профессиональный разработчик. Создай код на языке ${request.language} по следующему запросу:

ЗАПРОС: ${request.prompt}

${request.context ? `КОНТЕКСТ: ${request.context}` : ''}
${request.projectType ? `ТИП ПРОЕКТА: ${request.projectType}` : ''}

ТРЕБОВАНИЯ:
1. Создай готовый к запуску код
2. Добавь все необходимые импорты и зависимости
3. Следуй лучшим практикам для ${request.language}
4. Добавь комментарии на русском языке
5. Создай файловую структуру если нужно

ФОРМАТ ОТВЕТА:
Для каждого файла используй следующий формат:

===ФАЙЛ: имя_файла.расширение===
код файла
===КОНЕЦ ФАЙЛА===

===ОБЪЯСНЕНИЕ===
Объяснение что делает код и как его использовать
===КОНЕЦ ОБЪЯСНЕНИЯ===

Начинай генерацию:
    `.trim();
  }

  private parseCodeResponse(response: GeminiResponse, language: string): GeneratedCode[] {
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('Пустой ответ от Gemini API');
    }

    const text = response.candidates[0].content.parts[0].text;
    const results: GeneratedCode[] = [];

    // Parse files from the response
    const fileRegex = /===ФАЙЛ:\s*(.+?)===\n(.*?)\n===КОНЕЦ ФАЙЛА===/gs;
    const explanationRegex = /===ОБЪЯСНЕНИЕ===\n(.*?)\n===КОНЕЦ ОБЪЯСНЕНИЯ===/s;

    let match;
    while ((match = fileRegex.exec(text)) !== null) {
      const filename = match[1].trim();
      const code = match[2].trim();
      
      results.push({
        code,
        language,
        filename,
        explanation: ''
      });
    }

    // Extract explanation
    const explanationMatch = explanationRegex.exec(text);
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    // If no files were parsed, treat the whole response as a single code block
    if (results.length === 0) {
      const filename = this.generateFilename(language, text);
      results.push({
        code: text,
        language,
        filename,
        explanation
      });
    } else {
      // Add explanation to all files
      results.forEach(result => {
        result.explanation = explanation;
      });
    }

    return results;
  }

  private generateFilename(language: string, code: string): string {
    const extensions: { [key: string]: string } = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'html': 'html',
      'css': 'css',
      'react': 'tsx',
      'vue': 'vue',
      'angular': 'ts'
    };

    const ext = extensions[language.toLowerCase()] || 'txt';
    
    // Try to extract a meaningful name from the code
    const classMatch = code.match(/class\s+(\w+)/);
    const functionMatch = code.match(/function\s+(\w+)/);
    const componentMatch = code.match(/(?:const|function)\s+(\w+)(?:\s*=|\s*\()/);
    
    let baseName = 'generated';
    if (classMatch) baseName = classMatch[1].toLowerCase();
    else if (componentMatch) baseName = componentMatch[1].toLowerCase();
    else if (functionMatch) baseName = functionMatch[1].toLowerCase();
    
    return `${baseName}.${ext}`;
  }

  public async chatWithAI(message: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('API ключ Gemini не настроен');
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Ошибка API: ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content.parts[0]?.text || 'Нет ответа';
    } catch (error) {
      console.error('Ошибка чата с ИИ:', error);
      throw error;
    }
  }
}