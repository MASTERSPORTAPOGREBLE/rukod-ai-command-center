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

    // 1. Парсим файлы в формате ===ФАЙЛ: имя===
    const fileRegex = /===ФАЙЛ:\s*(.+?)===\n(.*?)(?=\n===(?:ФАЙЛ:|КОНЕЦ ФАЙЛА|ОБЪЯСНЕНИЕ)===|$)/gs;
    const explanationRegex = /===ОБЪЯСНЕНИЕ===\n(.*?)(?=\n===КОНЕЦ ОБЪЯСНЕНИЯ===|$)/s;

    let match;
    while ((match = fileRegex.exec(text)) !== null) {
      const filename = match[1].trim();
      const code = match[2].trim();
      
      if (code) {
        const detectedLanguage = this.detectLanguageFromFilename(filename) || language;
        results.push({
          code,
          language: detectedLanguage,
          filename,
          explanation: ''
        });
      }
    }

    // 2. Если не найдены файловые блоки, ищем markdown блоки кода
    if (results.length === 0) {
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      let blockIndex = 0;
      
      while ((match = codeBlockRegex.exec(text)) !== null) {
        const detectedLanguage = match[1] || language;
        const code = match[2].trim();
        
        if (code) {
          results.push({
            code,
            language: detectedLanguage,
            filename: this.generateFilename(detectedLanguage, code),
            explanation: this.extractDescription(text, match.index)
          });
          blockIndex++;
        }
      }
    }

    // 3. Ищем HTML/CSS/JS структуры в тексте
    if (results.length === 0) {
      const patterns = [
        { 
          regex: /<!DOCTYPE html>[\s\S]*?<\/html>/gi, 
          lang: 'html', 
          name: 'index.html',
          description: 'HTML страница'
        },
        { 
          regex: /<script[^>]*>([\s\S]*?)<\/script>/gi, 
          lang: 'javascript', 
          name: 'script.js',
          description: 'JavaScript код'
        },
        { 
          regex: /<style[^>]*>([\s\S]*?)<\/style>/gi, 
          lang: 'css', 
          name: 'styles.css',
          description: 'CSS стили'
        },
        { 
          regex: /(?:function|const|let|var)\s+\w+[\s\S]*?(?=\n\n|\n(?:function|const|let|var)|$)/gi, 
          lang: 'javascript', 
          name: 'functions.js',
          description: 'JavaScript функции'
        }
      ];
      
      patterns.forEach(pattern => {
        let patternMatch;
        while ((patternMatch = pattern.regex.exec(text)) !== null) {
          let code = patternMatch[0].trim();
          
          // Для script и style тегов извлекаем содержимое
          if (pattern.lang === 'javascript' && code.includes('<script')) {
            const innerMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/);
            if (innerMatch) code = innerMatch[1].trim();
          }
          if (pattern.lang === 'css' && code.includes('<style')) {
            const innerMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/);
            if (innerMatch) code = innerMatch[1].trim();
          }
          
          if (code.length > 20) { // Минимальная длина кода
            results.push({
              code,
              language: pattern.lang,
              filename: pattern.name,
              explanation: pattern.description
            });
          }
        }
      });
    }

    // 4. Ищем React компоненты
    const reactComponentRegex = /(?:function|const)\s+([A-Z]\w*)\s*(?:\([^)]*\))?\s*(?:=>)?\s*{[\s\S]*?return[\s\S]*?<[\s\S]*?>[\s\S]*?}/gi;
    let reactMatch;
    while ((reactMatch = reactComponentRegex.exec(text)) !== null) {
      const componentName = reactMatch[1];
      const code = reactMatch[0].trim();
      
      if (code.includes('<') && code.includes('>')) {
        results.push({
          code,
          language: 'jsx',
          filename: `${componentName}.jsx`,
          explanation: `React компонент: ${componentName}`
        });
      }
    }

    // Extract explanation
    const explanationMatch = explanationRegex.exec(text);
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    // If no files were parsed, treat the whole response as a single code block
    if (results.length === 0) {
      const detectedLang = this.detectLanguageFromContent(text) || language;
      const filename = this.generateFilename(detectedLang, text);
      results.push({
        code: text,
        language: detectedLang,
        filename,
        explanation
      });
    } else {
      // Add explanation to files that don't have one
      results.forEach(result => {
        if (!result.explanation) {
          result.explanation = explanation;
        }
      });
    }

    return results;
  }

  // Определение языка по имени файла
  private detectLanguageFromFilename(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript', 
      'tsx': 'tsx',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'kt': 'kotlin',
      'swift': 'swift',
      'vue': 'vue',
      'svelte': 'svelte'
    };
    
    return langMap[ext || ''] || 'text';
  }

  // Определение языка по содержимому
  private detectLanguageFromContent(content: string): string {
    const patterns = [
      { regex: /<!DOCTYPE html>|<html|<\/html>/i, lang: 'html' },
      { regex: /import\s+React|from\s+['"]react['"]|jsx|<\/\w+>/i, lang: 'jsx' },
      { regex: /function\s+\w+|const\s+\w+\s*=|let\s+\w+|var\s+\w+/i, lang: 'javascript' },
      { regex: /interface\s+\w+|type\s+\w+\s*=|as\s+\w+/i, lang: 'typescript' },
      { regex: /{[\s\S]*?}|\.[\w-]+\s*{|@media/i, lang: 'css' },
      { regex: /def\s+\w+|import\s+\w+|from\s+\w+\s+import/i, lang: 'python' },
      { regex: /public\s+class|private\s+\w+|System\.out/i, lang: 'java' },
      { regex: /#include|int\s+main|cout\s*<<|cin\s*>>/i, lang: 'cpp' }
    ];
    
    for (const pattern of patterns) {
      if (pattern.regex.test(content)) {
        return pattern.lang;
      }
    }
    
    return 'text';
  }

  // Извлечение описания из контекста
  private extractDescription(content: string, matchIndex: number): string {
    const beforeMatch = content.substring(Math.max(0, matchIndex - 200), matchIndex);
    const lines = beforeMatch.split('\n');
    
    // Ищем описательные строки перед блоком кода
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line && !line.startsWith('```') && !line.startsWith('===')) {
        return line;
      }
    }
    
    return 'Сгенерированный код';
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