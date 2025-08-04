import { UniversalAIService } from './aiProviders';
import { ImageService } from './imageService';
import { RefactoringService } from './refactoringService';
import { FileNode } from '../components/fileManager/FileManager';
import { CloudIntegrationService } from './cloudIntegration';

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: 'file_save' | 'project_open' | 'code_generation' | 'timer' | 'file_count';
  condition?: {
    fileExtension?: string[];
    projectType?: string;
    minFiles?: number;
    codeQuality?: number;
  };
  actions: AutomationAction[];
  enabled: boolean;
  priority: number;
}

export interface AutomationAction {
  type: 'refactor' | 'optimize' | 'generate_assets' | 'deploy' | 'backup' | 'analyze' | 'notify';
  params?: any;
}

export interface SmartSuggestion {
  id: string;
  type: 'feature' | 'optimization' | 'fix' | 'enhancement';
  title: string;
  description: string;
  confidence: number;
  autoApplicable: boolean;
  action?: () => Promise<void>;
}

export class AutomationService {
  private aiService = new UniversalAIService();
  private refactoringService = new RefactoringService();
  private rules: AutomationRule[] = [];
  private isRunning = false;

  constructor() {
    this.initializeDefaultRules();
    this.startAutomation();
  }

  // Инициализация стандартных правил автоматизации
  private initializeDefaultRules() {
    this.rules = [
      {
        id: 'auto-refactor-on-save',
        name: '🔧 Автоматический рефакторинг',
        description: 'Автоматически исправляет проблемы кода при сохранении',
        trigger: 'file_save',
        condition: { fileExtension: ['.js', '.ts', '.jsx', '.tsx'] },
        actions: [{ type: 'refactor' }],
        enabled: true,
        priority: 1
      },
      {
        id: 'smart-assets-generation',
        name: '🎨 Умная генерация ассетов',
        description: 'Автоматически создает недостающие изображения для игр',
        trigger: 'code_generation',
        condition: { projectType: 'game' },
        actions: [{ type: 'generate_assets', params: { type: 'game_assets' } }],
        enabled: true,
        priority: 2
      },
      {
        id: 'project-cleanup',
        name: '🧹 Автоочистка проекта',
        description: 'Удаляет неиспользуемые файлы когда их становится много',
        trigger: 'file_count',
        condition: { minFiles: 20 },
        actions: [{ type: 'analyze' }, { type: 'refactor' }],
        enabled: true,
        priority: 3
      },
      {
        id: 'auto-deploy',
        name: '🚀 Автодеплой',
        description: 'Автоматически деплоит проект при достижении хорошего качества кода',
        trigger: 'file_save',
        condition: { codeQuality: 85 },
        actions: [{ type: 'deploy', params: { platform: 'replit' } }],
        enabled: false,
        priority: 4
      },
      {
        id: 'smart-backup',
        name: '💾 Умное резервирование',
        description: 'Создает бэкапы важных изменений',
        trigger: 'timer',
        actions: [{ type: 'backup' }],
        enabled: true,
        priority: 5
      }
    ];
  }

  // Запуск системы автоматизации
  startAutomation() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Таймер для периодических задач
    setInterval(() => {
      this.executeTimerTriggers();
    }, 5 * 60 * 1000); // Каждые 5 минут

    console.log('🤖 Система автоматизации запущена');
  }

  // Остановка автоматизации
  stopAutomation() {
    this.isRunning = false;
    console.log('🛑 Система автоматизации остановлена');
  }

  // Выполнение правил по триггеру
  async executeTrigger(trigger: string, context?: any) {
    if (!this.isRunning) return;

    const applicableRules = this.rules
      .filter(rule => rule.enabled && rule.trigger === trigger)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of applicableRules) {
      if (this.checkCondition(rule.condition, context)) {
        await this.executeRule(rule, context);
      }
    }
  }

  // Проверка условий правила
  private checkCondition(condition: any, context: any): boolean {
    if (!condition) return true;

    if (condition.fileExtension && context?.fileName) {
      const hasValidExtension = condition.fileExtension.some((ext: string) => 
        context.fileName.endsWith(ext)
      );
      if (!hasValidExtension) return false;
    }

    if (condition.projectType && context?.projectType !== condition.projectType) {
      return false;
    }

    if (condition.minFiles && context?.fileCount < condition.minFiles) {
      return false;
    }

    if (condition.codeQuality && context?.codeQuality < condition.codeQuality) {
      return false;
    }

    return true;
  }

  // Выполнение правила
  private async executeRule(rule: AutomationRule, context: any) {
    console.log(`🔄 Выполняется правило: ${rule.name}`);

    for (const action of rule.actions) {
      try {
        await this.executeAction(action, context);
      } catch (error) {
        console.error(`Ошибка выполнения действия ${action.type}:`, error);
      }
    }
  }

  // Выполнение действия
  private async executeAction(action: AutomationAction, context: any) {
    switch (action.type) {
      case 'refactor':
        await this.autoRefactor(context);
        break;
      case 'optimize':
        await this.autoOptimize(context);
        break;
      case 'generate_assets':
        await this.autoGenerateAssets(context, action.params);
        break;
      case 'deploy':
        await this.autoDeploy(context, action.params);
        break;
      case 'backup':
        await this.autoBackup(context);
        break;
      case 'analyze':
        await this.autoAnalyze(context);
        break;
      case 'notify':
        this.showNotification(action.params?.message || 'Автоматизация выполнена');
        break;
    }
  }

  // Автоматический рефакторинг
  private async autoRefactor(context: any) {
    if (!context?.files) return;

    const report = await this.refactoringService.analyzeProject(context.files);
    const criticalIssues = report.issues.filter(issue => 
      issue.severity === 'high' && issue.autoFixable
    );

    if (criticalIssues.length > 0) {
      const result = await this.refactoringService.autoRefactor(
        context.files, 
        criticalIssues.map(i => i.id)
      );
      
      this.showNotification(`🔧 Исправлено ${criticalIssues.length} проблем`);
      return result;
    }
  }

  // Автоматическая оптимизация
  private async autoOptimize(context: any) {
    // Оптимизация изображений
    if (context?.images) {
      for (const image of context.images) {
        const optimized = await ImageService.optimizeForWeb(image.data);
        image.data = optimized;
      }
    }

    // Оптимизация кода
    const optimizationPrompt = `
Оптимизируй следующий код для лучшей производительности:

${context?.code || ''}

Сосредоточься на:
1. Устранении узких мест
2. Кэшировании
3. Ленивой загрузке
4. Минификации
    `;

    try {
      const optimizedCode = await this.aiService.generateCode(optimizationPrompt);
      this.showNotification('⚡ Код оптимизирован');
      return optimizedCode;
    } catch (error) {
      console.error('Ошибка оптимизации:', error);
    }
  }

  // Автоматическая генерация ассетов
  private async autoGenerateAssets(context: any, params: any) {
    if (params?.type === 'game_assets') {
      const gameAssets = [
        { name: 'player_sprite', prompt: 'pixel art character sprite for 2D game, 32x32' },
        { name: 'coin_icon', prompt: 'golden coin icon for game UI, 64x64' },
        { name: 'heart_icon', prompt: 'red heart health icon, 32x32' },
        { name: 'background', prompt: 'seamless game background texture, 512x512' }
      ];

      for (const asset of gameAssets) {
        try {
          const imageUrl = await ImageService.generateImage(asset.prompt, {
            size: '256x256',
            style: 'pixel-art'
          });
          
          // Сохраняем в проект
          if (context?.onAssetGenerated) {
            context.onAssetGenerated(asset.name + '.png', imageUrl);
          }
        } catch (error) {
          console.error(`Ошибка генерации ${asset.name}:`, error);
        }
      }

      this.showNotification('🎨 Игровые ассеты сгенерированы');
    }
  }

  // Автоматический деплой
  private async autoDeploy(context: any, params: any) {
    if (!context?.projectName || !context?.files) return;

    try {
      let deployment;
      if (params?.platform === 'replit') {
        deployment = await CloudIntegrationService.deployToReplit(
          context.projectName, 
          context.files
        );
      } else {
        deployment = await CloudIntegrationService.deployToGitHub(
          context.projectName, 
          context.files
        );
      }

      this.showNotification(`🚀 Проект задеплоен: ${deployment.url}`);
    } catch (error) {
      console.error('Ошибка автодеплоя:', error);
    }
  }

  // Автоматическое резервирование
  private async autoBackup(context: any) {
    if (!context?.files) return;

    const backup = {
      timestamp: Date.now(),
      files: context.files,
      version: this.generateVersion()
    };

    const backupKey = `ai_ide_backup_${backup.timestamp}`;
    localStorage.setItem(backupKey, JSON.stringify(backup));

    // Оставляем только последние 5 бэкапов
    this.cleanupOldBackups();

    this.showNotification('💾 Проект сохранен в резервную копию');
  }

  // Автоматический анализ
  private async autoAnalyze(context: any) {
    if (!context?.files) return;

    const analysis = await this.generateProjectAnalysis(context.files);
    const suggestions = await this.generateSmartSuggestions(analysis);

    // Сохраняем анализ
    localStorage.setItem('last_project_analysis', JSON.stringify({
      timestamp: Date.now(),
      analysis,
      suggestions
    }));

    this.showNotification(`🔍 Проект проанализирован. Найдено ${suggestions.length} рекомендаций`);
    return { analysis, suggestions };
  }

  // Генерация умных предложений
  async generateSmartSuggestions(files: FileNode[]): Promise<SmartSuggestion[]> {
    const suggestions: SmartSuggestion[] = [];

    // Анализ структуры проекта
    const analysis = await this.generateProjectAnalysis(files);

    // Предложения по улучшению
    if (analysis.hasReactComponents && !analysis.hasTypeScript) {
      suggestions.push({
        id: 'add-typescript',
        type: 'enhancement',
        title: 'Добавить TypeScript',
        description: 'Проект использует React. TypeScript улучшит типизацию и разработку',
        confidence: 0.8,
        autoApplicable: true,
        action: async () => {
          await this.convertToTypeScript(files);
        }
      });
    }

    if (analysis.missingTests) {
      suggestions.push({
        id: 'add-tests',
        type: 'feature',
        title: 'Добавить тесты',
        description: 'В проекте отсутствуют тесты. Рекомендуется добавить Jest/Vitest',
        confidence: 0.9,
        autoApplicable: true,
        action: async () => {
          await this.generateTests(files);
        }
      });
    }

    if (analysis.performanceIssues > 0) {
      suggestions.push({
        id: 'fix-performance',
        type: 'optimization',
        title: 'Оптимизировать производительность',
        description: `Найдено ${analysis.performanceIssues} проблем производительности`,
        confidence: 0.7,
        autoApplicable: true,
        action: async () => {
          await this.autoOptimize({ files });
        }
      });
    }

    if (analysis.isGameProject && analysis.missingAssets) {
      suggestions.push({
        id: 'generate-game-assets',
        type: 'feature',
        title: 'Сгенерировать игровые ассеты',
        description: 'Игровой проект без графических ресурсов. Создать автоматически?',
        confidence: 0.85,
        autoApplicable: true,
        action: async () => {
          await this.autoGenerateAssets({ files }, { type: 'game_assets' });
        }
      });
    }

    return suggestions;
  }

  // Анализ проекта
  private async generateProjectAnalysis(files: FileNode[]): Promise<any> {
    const analysis = {
      totalFiles: 0,
      hasReactComponents: false,
      hasTypeScript: false,
      missingTests: true,
      performanceIssues: 0,
      isGameProject: false,
      missingAssets: false,
      codeQuality: 0
    };

    const fileNames = this.getAllFileNames(files);
    analysis.totalFiles = fileNames.length;

    // Определяем тип проекта
    analysis.hasReactComponents = fileNames.some(name => 
      name.includes('.jsx') || name.includes('.tsx') || 
      fileNames.some(f => f.includes('react'))
    );

    analysis.hasTypeScript = fileNames.some(name => 
      name.includes('.ts') || name.includes('.tsx')
    );

    analysis.missingTests = !fileNames.some(name => 
      name.includes('.test.') || name.includes('.spec.') || name.includes('__tests__')
    );

    analysis.isGameProject = fileNames.some(name => 
      name.includes('game') || name.includes('canvas') || name.includes('phaser')
    ) || files.some(file => 
      file.content?.includes('canvas') || file.content?.includes('game')
    );

    analysis.missingAssets = analysis.isGameProject && !fileNames.some(name => 
      name.includes('.png') || name.includes('.jpg') || name.includes('.svg')
    );

    // Оценка качества кода
    try {
      const refactoringReport = await this.refactoringService.analyzeProject(files);
      analysis.codeQuality = refactoringReport.codeQualityScore;
      analysis.performanceIssues = refactoringReport.issues.filter(i => i.type === 'performance').length;
    } catch (error) {
      console.error('Ошибка анализа качества кода:', error);
    }

    return analysis;
  }

  // Вспомогательные методы
  private getAllFileNames(files: FileNode[]): string[] {
    const names: string[] = [];
    
    const traverse = (nodes: FileNode[]) => {
      for (const node of nodes) {
        if (node.type === 'file') {
          names.push(node.name);
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    };
    
    traverse(files);
    return names;
  }

  private generateVersion(): string {
    const now = new Date();
    return `v${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}.${now.getHours()}${now.getMinutes()}`;
  }

  private cleanupOldBackups() {
    const backupKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('ai_ide_backup_'))
      .sort()
      .reverse();

    // Удаляем старые бэкапы, оставляем только 5 последних
    backupKeys.slice(5).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  private showNotification(message: string) {
    // Создаем красивое уведомление
    const notification = document.createElement('div');
    notification.className = 'automation-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">🤖</span>
        <span class="notification-text">${message}</span>
      </div>
    `;
    
    // Добавляем стили
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #007DFF, #0066CC);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 125, 255, 0.3);
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;

    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .notification-icon {
        font-size: 16px;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Автоматическое скрытие через 4 секунды
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Выполнение таймерных триггеров
  private async executeTimerTriggers() {
    await this.executeTrigger('timer');
  }

  // Конвертация в TypeScript
  private async convertToTypeScript(files: FileNode[]) {
    const prompt = `
Конвертируй следующие JavaScript файлы в TypeScript:

${files.map(f => `${f.name}:\n${f.content}`).join('\n\n')}

Добавь:
1. Типы для всех переменных и функций
2. Интерфейсы для объектов
3. Строгую типизацию
4. Современные TypeScript практики
    `;

    try {
      const tsCode = await this.aiService.generateCode(prompt);
      this.showNotification('📝 Проект конвертирован в TypeScript');
      return tsCode;
    } catch (error) {
      console.error('Ошибка конвертации в TypeScript:', error);
    }
  }

  // Генерация тестов
  private async generateTests(files: FileNode[]) {
    const prompt = `
Создай тесты для следующих файлов:

${files.map(f => `${f.name}:\n${f.content}`).join('\n\n')}

Используй Jest/Vitest и создай:
1. Unit тесты для функций
2. Component тесты для React компонентов
3. Integration тесты
4. Покрытие основных сценариев
    `;

    try {
      const tests = await this.aiService.generateCode(prompt);
      this.showNotification('🧪 Тесты сгенерированы');
      return tests;
    } catch (error) {
      console.error('Ошибка генерации тестов:', error);
    }
  }

  // API для управления правилами
  getRules(): AutomationRule[] {
    return this.rules;
  }

  updateRule(ruleId: string, updates: Partial<AutomationRule>) {
    const ruleIndex = this.rules.findIndex(r => r.id === ruleId);
    if (ruleIndex !== -1) {
      this.rules[ruleIndex] = { ...this.rules[ruleIndex], ...updates };
    }
  }

  addRule(rule: AutomationRule) {
    this.rules.push(rule);
  }

  removeRule(ruleId: string) {
    this.rules = this.rules.filter(r => r.id !== ruleId);
  }
}