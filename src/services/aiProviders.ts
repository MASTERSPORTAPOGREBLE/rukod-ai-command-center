import { SecureStorage, getEnvApiKey } from '../utils/security';

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  isFree: boolean;
  capabilities: string[];
  apiUrl: string;
  headers: (apiKey: string) => Record<string, string>;
  formatRequest: (prompt: string, options?: any) => any;
  parseResponse: (response: any) => string;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  language?: string;
  projectType?: string;
  imageSize?: string;
  imageStyle?: string;
}

// DeepSeek API (бесплатный)
export const DeepSeekProvider: AIProvider = {
  id: 'deepseek',
  name: 'DeepSeek Coder',
  description: 'Бесплатная модель специально для программирования',
  isFree: true,
  capabilities: ['code-generation', 'refactoring', 'debugging', 'explanation'],
  apiUrl: 'https://api.deepseek.com/v1/chat/completions',
  headers: (apiKey: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  }),
  formatRequest: (prompt: string, options?: GenerationOptions) => ({
    model: 'deepseek-coder',
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: options?.temperature || 0.7,
    max_tokens: options?.maxTokens || 4096,
    stream: false
  }),
  parseResponse: (response: any) => {
    return response.choices?.[0]?.message?.content || 'Нет ответа';
  }
};

// Qwen API
export const QwenProvider: AIProvider = {
  id: 'qwen',
  name: 'Qwen Coder',
  description: 'Мощная китайская модель для программирования',
  isFree: true,
  capabilities: ['code-generation', 'translation', 'refactoring', 'analysis'],
  apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
  headers: (apiKey: string) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
    'X-DashScope-SSE': 'disable'
  }),
  formatRequest: (prompt: string, options?: GenerationOptions) => ({
    model: 'qwen-turbo',
    input: {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    },
    parameters: {
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 4096
    }
  }),
  parseResponse: (response: any) => {
    return response.output?.text || response.output?.choices?.[0]?.message?.content || 'Нет ответа';
  }
};

// Hugging Face (для генерации изображений)
export const HuggingFaceProvider: AIProvider = {
  id: 'huggingface',
  name: 'Stable Diffusion (HF)',
  description: 'Бесплатная генерация изображений через Hugging Face',
  isFree: true,
  capabilities: ['image-generation', 'texture-creation', 'ui-mockups'],
  apiUrl: 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
  headers: (apiKey: string) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }),
  formatRequest: (prompt: string, options?: GenerationOptions) => ({
    inputs: prompt,
    parameters: {
      negative_prompt: 'blurry, low quality, distorted',
      num_inference_steps: 20,
      guidance_scale: 7.5,
      width: parseInt(options?.imageSize?.split('x')[0] || '512'),
      height: parseInt(options?.imageSize?.split('x')[1] || '512')
    },
    options: {
      wait_for_model: true
    }
  }),
  parseResponse: (response: any) => {
    // HuggingFace возвращает blob, который нужно конвертировать в base64
    return response; // Обрабатывается отдельно
  }
};

export class UniversalAIService {
  private providers: Map<string, AIProvider> = new Map();
  private activeProvider: string = 'gemini';

  constructor() {
    this.registerProvider(DeepSeekProvider);
    this.registerProvider(QwenProvider);
    this.registerProvider(HuggingFaceProvider);
  }

  registerProvider(provider: AIProvider) {
    this.providers.set(provider.id, provider);
  }

  setActiveProvider(providerId: string) {
    if (this.providers.has(providerId)) {
      this.activeProvider = providerId;
    }
  }

  getActiveProvider(): AIProvider | null {
    return this.providers.get(this.activeProvider) || null;
  }

  getAllProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  getProviderApiKey(providerId: string): string {
    const envKey = getEnvApiKey(providerId);
    if (envKey) return envKey;
    
    return SecureStorage.getApiKey(providerId) || '';
  }

  isProviderConfigured(providerId: string): boolean {
    const apiKey = this.getProviderApiKey(providerId);
    return apiKey.length > 0;
  }

  async generateCode(prompt: string, options?: GenerationOptions): Promise<string> {
    const provider = this.getActiveProvider();
    if (!provider) {
      throw new Error('Нет активного ИИ провайдера');
    }

    const apiKey = this.getProviderApiKey(provider.id);
    if (!apiKey) {
      throw new Error(`API ключ для ${provider.name} не настроен`);
    }

    // Специальный формат для генерации кода
    const codePrompt = this.formatCodePrompt(prompt, options);

    try {
      const response = await fetch(provider.apiUrl, {
        method: 'POST',
        headers: provider.headers(apiKey),
        body: JSON.stringify(provider.formatRequest(codePrompt, options))
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Ошибка ${provider.name}: ${errorData?.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return provider.parseResponse(data);
    } catch (error) {
      console.error(`Ошибка генерации кода с ${provider.name}:`, error);
      throw error;
    }
  }

  async generateImage(prompt: string, options?: GenerationOptions): Promise<string> {
    // Используем Hugging Face для генерации изображений
    const provider = this.providers.get('huggingface');
    if (!provider) {
      throw new Error('Провайдер для генерации изображений недоступен');
    }

    const apiKey = this.getProviderApiKey('huggingface');
    if (!apiKey) {
      throw new Error('API ключ Hugging Face не настроен');
    }

    // Улучшаем промпт для лучших результатов
    const enhancedPrompt = this.enhanceImagePrompt(prompt, options);

    try {
      const response = await fetch(provider.apiUrl, {
        method: 'POST',
        headers: provider.headers(apiKey),
        body: JSON.stringify(provider.formatRequest(enhancedPrompt, options))
      });

      if (!response.ok) {
        throw new Error(`Ошибка генерации изображения: ${response.statusText}`);
      }

      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Ошибка генерации изображения:', error);
      throw error;
    }
  }

  async analyzeProject(files: any[]): Promise<string> {
    const provider = this.getActiveProvider();
    if (!provider) {
      throw new Error('Нет активного ИИ провайдера');
    }

    const analysisPrompt = this.formatAnalysisPrompt(files);
    
    try {
      return await this.generateCode(analysisPrompt);
    } catch (error) {
      console.error('Ошибка анализа проекта:', error);
      throw error;
    }
  }

  private formatCodePrompt(prompt: string, options?: GenerationOptions): string {
    return `
Ты профессиональный разработчик. Создай код по следующему запросу:

ЗАПРОС: ${prompt}

${options?.language ? `ЯЗЫК: ${options.language}` : ''}
${options?.projectType ? `ТИП ПРОЕКТА: ${options.projectType}` : ''}

ТРЕБОВАНИЯ:
1. Создай готовый к запуску код
2. Добавь все необходимые импорты и зависимости
3. Следуй лучшим практикам
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

  private enhanceImagePrompt(prompt: string, options?: GenerationOptions): string {
    let enhancedPrompt = prompt;
    
    // Добавляем стиль если не указан
    if (options?.imageStyle) {
      enhancedPrompt = `${prompt}, ${options.imageStyle} style`;
    }

    // Добавляем качественные модификаторы
    enhancedPrompt += ', high quality, detailed, professional';

    // Для игровых текстур добавляем специальные модификаторы
    if (prompt.includes('texture') || prompt.includes('текстура')) {
      enhancedPrompt += ', seamless, tileable, game asset';
    }

    return enhancedPrompt;
  }

  private formatAnalysisPrompt(files: any[]): string {
    const fileList = files.map(f => `- ${f.name} (${f.type})`).join('\n');
    
    return `
Проанализируй структуру проекта и предложи улучшения:

ФАЙЛЫ ПРОЕКТА:
${fileList}

ЗАДАЧИ АНАЛИЗА:
1. Найди неиспользуемые файлы и код
2. Предложи рефакторинг дублирующегося кода
3. Проверь структуру проекта
4. Найди потенциальные проблемы безопасности
5. Предложи оптимизацию производительности

ФОРМАТ ОТВЕТА:
===АНАЛИЗ===
Общая оценка проекта
===ПРОБЛЕМЫ===
Список найденных проблем
===РЕКОМЕНДАЦИИ===
Конкретные рекомендации по улучшению
===РЕФАКТОРИНГ===
Предложения по рефакторингу
    `.trim();
  }

  // Метод для автоматического рефакторинга
  async autoRefactor(files: any[], issues: string[]): Promise<string> {
    const refactorPrompt = `
Выполни автоматический рефакторинг проекта:

ПРОБЛЕМЫ:
${issues.join('\n')}

ФАЙЛЫ:
${files.map(f => `${f.name}: ${f.content?.substring(0, 500)}...`).join('\n\n')}

ЗАДАЧИ:
1. Удали неиспользуемый код
2. Объедини дублирующийся код
3. Улучши структуру файлов
4. Оптимизируй импорты

Верни только измененные файлы в формате:
===ФАЙЛ: имя===
новый_код
===КОНЕЦ===
    `.trim();

    return await this.generateCode(refactorPrompt);
  }
}