import { FileNode } from '../components/fileManager/FileManager';
import { UniversalAIService } from './aiProviders';

export interface RefactoringIssue {
  id: string;
  type: 'unused-code' | 'duplicate-code' | 'performance' | 'structure' | 'security';
  severity: 'low' | 'medium' | 'high';
  file: string;
  line?: number;
  description: string;
  suggestion: string;
  autoFixable: boolean;
}

export interface RefactoringReport {
  issues: RefactoringIssue[];
  suggestions: string[];
  filesAnalyzed: number;
  linesOfCode: number;
  codeQualityScore: number;
}

export interface RefactoringResult {
  modifiedFiles: Array<{
    path: string;
    oldContent: string;
    newContent: string;
    changes: string[];
  }>;
  deletedFiles: string[];
  summary: string;
}

export class RefactoringService {
  private aiService = new UniversalAIService();

  // Анализ проекта на проблемы
  async analyzeProject(files: FileNode[]): Promise<RefactoringReport> {
    const issues: RefactoringIssue[] = [];
    let totalLines = 0;
    let filesAnalyzed = 0;

    // Анализируем каждый файл
    for (const file of files) {
      if (file.type === 'file' && file.content) {
        filesAnalyzed++;
        const lines = file.content.split('\n');
        totalLines += lines.length;

        // Проверяем различные типы проблем
        issues.push(...this.detectUnusedCode(file));
        issues.push(...this.detectDuplicateCode(file, files));
        issues.push(...this.detectPerformanceIssues(file));
        issues.push(...this.detectStructureIssues(file));
        issues.push(...this.detectSecurityIssues(file));
      }
    }

    // Генерируем рекомендации с помощью ИИ
    const suggestions = await this.generateAISuggestions(files, issues);

    // Вычисляем оценку качества кода
    const codeQualityScore = this.calculateCodeQualityScore(issues, totalLines);

    return {
      issues,
      suggestions,
      filesAnalyzed,
      linesOfCode: totalLines,
      codeQualityScore
    };
  }

  // Автоматический рефакторинг
  async autoRefactor(files: FileNode[], selectedIssues?: string[]): Promise<RefactoringResult> {
    const report = await this.analyzeProject(files);
    const issuesToFix = selectedIssues 
      ? report.issues.filter(issue => selectedIssues.includes(issue.id))
      : report.issues.filter(issue => issue.autoFixable && issue.severity !== 'low');

    const modifiedFiles: RefactoringResult['modifiedFiles'] = [];
    const deletedFiles: string[] = [];

    // Группируем проблемы по файлам
    const issuesByFile = this.groupIssuesByFile(issuesToFix);

    for (const [filePath, fileIssues] of issuesByFile.entries()) {
      const file = this.findFileByPath(files, filePath);
      if (!file || !file.content) continue;

      try {
        const refactoredContent = await this.refactorFile(file, fileIssues);
        
        if (refactoredContent !== file.content) {
          modifiedFiles.push({
            path: filePath,
            oldContent: file.content,
            newContent: refactoredContent,
            changes: fileIssues.map(issue => issue.description)
          });
        }
      } catch (error) {
        console.error(`Ошибка рефакторинга файла ${filePath}:`, error);
      }
    }

    // Находим файлы для удаления
    const unusedFiles = report.issues
      .filter(issue => issue.type === 'unused-code' && issue.description.includes('неиспользуемый файл'))
      .map(issue => issue.file);
    
    deletedFiles.push(...unusedFiles);

    const summary = await this.generateRefactoringSummary(modifiedFiles, deletedFiles, issuesToFix);

    return {
      modifiedFiles,
      deletedFiles,
      summary
    };
  }

  // Обнаружение неиспользуемого кода
  private detectUnusedCode(file: FileNode): RefactoringIssue[] {
    const issues: RefactoringIssue[] = [];
    if (!file.content) return issues;

    const lines = file.content.split('\n');
    const imports = this.extractImports(file.content);
    const exports = this.extractExports(file.content);
    const functions = this.extractFunctions(file.content);
    const variables = this.extractVariables(file.content);

    // Проверяем неиспользуемые импорты
    imports.forEach(importItem => {
      if (!this.isUsedInCode(importItem.name, file.content!)) {
        issues.push({
          id: `unused-import-${file.name}-${importItem.name}`,
          type: 'unused-code',
          severity: 'medium',
          file: file.name,
          line: importItem.line,
          description: `Неиспользуемый импорт: ${importItem.name}`,
          suggestion: `Удалите неиспользуемый импорт ${importItem.name}`,
          autoFixable: true
        });
      }
    });

    // Проверяем неиспользуемые функции
    functions.forEach(func => {
      if (!exports.some(exp => exp.name === func.name) && 
          !this.isUsedInCode(func.name, file.content!)) {
        issues.push({
          id: `unused-function-${file.name}-${func.name}`,
          type: 'unused-code',
          severity: 'medium',
          file: file.name,
          line: func.line,
          description: `Неиспользуемая функция: ${func.name}`,
          suggestion: `Удалите неиспользуемую функцию ${func.name} или экспортируйте её`,
          autoFixable: true
        });
      }
    });

    return issues;
  }

  // Обнаружение дублирующегося кода
  private detectDuplicateCode(file: FileNode, allFiles: FileNode[]): RefactoringIssue[] {
    const issues: RefactoringIssue[] = [];
    if (!file.content) return issues;

    const functions = this.extractFunctions(file.content);
    
    // Проверяем дублирование внутри файла
    for (let i = 0; i < functions.length; i++) {
      for (let j = i + 1; j < functions.length; j++) {
        const similarity = this.calculateSimilarity(functions[i].body, functions[j].body);
        if (similarity > 0.8) {
          issues.push({
            id: `duplicate-${file.name}-${functions[i].name}-${functions[j].name}`,
            type: 'duplicate-code',
            severity: 'high',
            file: file.name,
            line: functions[i].line,
            description: `Дублирующийся код в функциях ${functions[i].name} и ${functions[j].name}`,
            suggestion: `Вынесите общую логику в отдельную функцию`,
            autoFixable: true
          });
        }
      }
    }

    return issues;
  }

  // Обнаружение проблем производительности
  private detectPerformanceIssues(file: FileNode): RefactoringIssue[] {
    const issues: RefactoringIssue[] = [];
    if (!file.content) return issues;

    const lines = file.content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Поиск вложенных циклов
      if (trimmedLine.includes('for') && this.hasNestedLoops(lines, index)) {
        issues.push({
          id: `nested-loops-${file.name}-${index}`,
          type: 'performance',
          severity: 'medium',
          file: file.name,
          line: index + 1,
          description: 'Вложенные циклы могут влиять на производительность',
          suggestion: 'Рассмотрите оптимизацию алгоритма или использование Map/Set',
          autoFixable: false
        });
      }

      // Поиск синхронных операций в циклах
      if (trimmedLine.includes('await') && this.isInsideLoop(lines, index)) {
        issues.push({
          id: `sync-in-loop-${file.name}-${index}`,
          type: 'performance',
          severity: 'high',
          file: file.name,
          line: index + 1,
          description: 'Синхронная операция внутри цикла',
          suggestion: 'Используйте Promise.all() для параллельного выполнения',
          autoFixable: true
        });
      }
    });

    return issues;
  }

  // Обнаружение проблем структуры
  private detectStructureIssues(file: FileNode): RefactoringIssue[] {
    const issues: RefactoringIssue[] = [];
    if (!file.content) return issues;

    const lines = file.content.split('\n');
    const functions = this.extractFunctions(file.content);

    // Проверяем длинные функции
    functions.forEach(func => {
      const functionLines = func.body.split('\n').length;
      if (functionLines > 50) {
        issues.push({
          id: `long-function-${file.name}-${func.name}`,
          type: 'structure',
          severity: 'medium',
          file: file.name,
          line: func.line,
          description: `Функция ${func.name} слишком длинная (${functionLines} строк)`,
          suggestion: 'Разбейте функцию на более мелкие части',
          autoFixable: false
        });
      }
    });

    // Проверяем слишком много параметров
    functions.forEach(func => {
      const paramCount = func.parameters.length;
      if (paramCount > 5) {
        issues.push({
          id: `too-many-params-${file.name}-${func.name}`,
          type: 'structure',
          severity: 'medium',
          file: file.name,
          line: func.line,
          description: `Функция ${func.name} имеет слишком много параметров (${paramCount})`,
          suggestion: 'Используйте объект для группировки параметров',
          autoFixable: true
        });
      }
    });

    return issues;
  }

  // Обнаружение проблем безопасности
  private detectSecurityIssues(file: FileNode): RefactoringIssue[] {
    const issues: RefactoringIssue[] = [];
    if (!file.content) return issues;

    const lines = file.content.split('\n');
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Поиск потенциально небезопасных паттернов
      if (trimmedLine.includes('eval(')) {
        issues.push({
          id: `eval-usage-${file.name}-${index}`,
          type: 'security',
          severity: 'high',
          file: file.name,
          line: index + 1,
          description: 'Использование eval() небезопасно',
          suggestion: 'Замените eval() на безопасную альтернативу',
          autoFixable: false
        });
      }

      if (trimmedLine.includes('innerHTML') && trimmedLine.includes('=')) {
        issues.push({
          id: `innerHTML-${file.name}-${index}`,
          type: 'security',
          severity: 'medium',
          file: file.name,
          line: index + 1,
          description: 'Прямое присвоение innerHTML может быть небезопасным',
          suggestion: 'Используйте textContent или sanitize HTML',
          autoFixable: true
        });
      }
    });

    return issues;
  }

  // Рефакторинг отдельного файла
  private async refactorFile(file: FileNode, issues: RefactoringIssue[]): Promise<string> {
    if (!file.content) return '';

    let refactoredContent = file.content;

    // Применяем автоматические исправления
    for (const issue of issues.filter(i => i.autoFixable)) {
      switch (issue.type) {
        case 'unused-code':
          refactoredContent = this.removeUnusedCode(refactoredContent, issue);
          break;
        case 'duplicate-code':
          refactoredContent = await this.extractCommonCode(refactoredContent, issue);
          break;
        case 'performance':
          refactoredContent = await this.optimizePerformance(refactoredContent, issue);
          break;
        case 'structure':
          refactoredContent = await this.improveStructure(refactoredContent, issue);
          break;
        case 'security':
          refactoredContent = this.fixSecurityIssue(refactoredContent, issue);
          break;
      }
    }

    return refactoredContent;
  }

  // Вспомогательные методы для анализа кода
  private extractImports(content: string): Array<{name: string, line: number}> {
    const imports: Array<{name: string, line: number}> = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const importMatch = line.match(/import\s+(?:{([^}]+)}|\*\s+as\s+(\w+)|(\w+))\s+from/);
      if (importMatch) {
        const importName = importMatch[1] || importMatch[2] || importMatch[3];
        if (importName) {
          imports.push({ name: importName.trim(), line: index + 1 });
        }
      }
    });
    
    return imports;
  }

  private extractExports(content: string): Array<{name: string, line: number}> {
    const exports: Array<{name: string, line: number}> = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const exportMatch = line.match(/export\s+(?:default\s+)?(?:function\s+|class\s+|const\s+|let\s+|var\s+)?(\w+)/);
      if (exportMatch) {
        exports.push({ name: exportMatch[1], line: index + 1 });
      }
    });
    
    return exports;
  }

  private extractFunctions(content: string): Array<{
    name: string, 
    line: number, 
    body: string, 
    parameters: string[]
  }> {
    const functions: Array<{name: string, line: number, body: string, parameters: string[]}> = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const functionMatch = line.match(/(?:function\s+(\w+)|(\w+)\s*=\s*(?:async\s+)?(?:function|\(|(\w+)\s*=>))/);
      
      if (functionMatch) {
        const name = functionMatch[1] || functionMatch[2] || functionMatch[3];
        const paramMatch = line.match(/\(([^)]*)\)/);
        const parameters = paramMatch ? paramMatch[1].split(',').map(p => p.trim()).filter(Boolean) : [];
        
        // Находим тело функции
        let braceCount = 0;
        let bodyStart = i;
        let bodyEnd = i;
        let foundStart = false;
        
        for (let j = i; j < lines.length; j++) {
          const currentLine = lines[j];
          for (const char of currentLine) {
            if (char === '{') {
              if (!foundStart) {
                foundStart = true;
                bodyStart = j;
              }
              braceCount++;
            } else if (char === '}') {
              braceCount--;
              if (braceCount === 0 && foundStart) {
                bodyEnd = j;
                break;
              }
            }
          }
          if (braceCount === 0 && foundStart) break;
        }
        
        const body = lines.slice(bodyStart, bodyEnd + 1).join('\n');
        functions.push({ name, line: i + 1, body, parameters });
      }
    }
    
    return functions;
  }

  private extractVariables(content: string): Array<{name: string, line: number}> {
    const variables: Array<{name: string, line: number}> = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const varMatch = line.match(/(?:const|let|var)\s+(\w+)/);
      if (varMatch) {
        variables.push({ name: varMatch[1], line: index + 1 });
      }
    });
    
    return variables;
  }

  private isUsedInCode(name: string, content: string): boolean {
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    const matches = content.match(regex);
    return matches ? matches.length > 1 : false; // Больше одного использования (объявление + использование)
  }

  private calculateSimilarity(code1: string, code2: string): number {
    const lines1 = code1.split('\n').map(line => line.trim()).filter(Boolean);
    const lines2 = code2.split('\n').map(line => line.trim()).filter(Boolean);
    
    if (lines1.length === 0 || lines2.length === 0) return 0;
    
    let similarLines = 0;
    for (const line1 of lines1) {
      if (lines2.some(line2 => this.stringSimilarity(line1, line2) > 0.8)) {
        similarLines++;
      }
    }
    
    return similarLines / Math.max(lines1.length, lines2.length);
  }

  private stringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private hasNestedLoops(lines: string[], currentIndex: number): boolean {
    let braceCount = 0;
    let foundLoop = false;
    
    for (let i = currentIndex; i < lines.length && i < currentIndex + 20; i++) {
      const line = lines[i].trim();
      
      if (line.includes('{')) braceCount++;
      if (line.includes('}')) braceCount--;
      
      if (braceCount > 0 && (line.includes('for') || line.includes('while')) && i !== currentIndex) {
        foundLoop = true;
        break;
      }
      
      if (braceCount === 0 && i > currentIndex) break;
    }
    
    return foundLoop;
  }

  private isInsideLoop(lines: string[], currentIndex: number): boolean {
    for (let i = currentIndex - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.includes('for') || line.includes('while')) {
        return true;
      }
      if (line.includes('}') && !line.includes('{')) {
        break;
      }
    }
    return false;
  }

  private groupIssuesByFile(issues: RefactoringIssue[]): Map<string, RefactoringIssue[]> {
    const grouped = new Map<string, RefactoringIssue[]>();
    
    issues.forEach(issue => {
      if (!grouped.has(issue.file)) {
        grouped.set(issue.file, []);
      }
      grouped.get(issue.file)!.push(issue);
    });
    
    return grouped;
  }

  private findFileByPath(files: FileNode[], path: string): FileNode | null {
    for (const file of files) {
      if (file.name === path || file.path === path) {
        return file;
      }
      if (file.children) {
        const found = this.findFileByPath(file.children, path);
        if (found) return found;
      }
    }
    return null;
  }

  private calculateCodeQualityScore(issues: RefactoringIssue[], totalLines: number): number {
    if (totalLines === 0) return 100;
    
    let penalty = 0;
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'high': penalty += 10; break;
        case 'medium': penalty += 5; break;
        case 'low': penalty += 1; break;
      }
    });
    
    const issueRatio = penalty / (totalLines / 100); // Пенальти на 100 строк
    return Math.max(0, Math.min(100, 100 - issueRatio));
  }

  // Методы для исправления проблем
  private removeUnusedCode(content: string, issue: RefactoringIssue): string {
    const lines = content.split('\n');
    if (issue.line && issue.line <= lines.length) {
      lines.splice(issue.line - 1, 1);
      return lines.join('\n');
    }
    return content;
  }

  private async extractCommonCode(content: string, issue: RefactoringIssue): Promise<string> {
    // Используем ИИ для рефакторинга дублированного кода
    const prompt = `Рефактори следующий код, вынеся общую логику в отдельную функцию:\n\n${content}`;
    try {
      return await this.aiService.generateCode(prompt);
    } catch {
      return content;
    }
  }

  private async optimizePerformance(content: string, issue: RefactoringIssue): Promise<string> {
    const prompt = `Оптимизируй производительность следующего кода:\n\n${content}`;
    try {
      return await this.aiService.generateCode(prompt);
    } catch {
      return content;
    }
  }

  private async improveStructure(content: string, issue: RefactoringIssue): Promise<string> {
    const prompt = `Улучши структуру следующего кода:\n\n${content}`;
    try {
      return await this.aiService.generateCode(prompt);
    } catch {
      return content;
    }
  }

  private fixSecurityIssue(content: string, issue: RefactoringIssue): string {
    if (issue.description.includes('innerHTML')) {
      return content.replace(/\.innerHTML\s*=\s*([^;]+)/g, '.textContent = $1');
    }
    return content;
  }

  private async generateAISuggestions(files: FileNode[], issues: RefactoringIssue[]): Promise<string[]> {
    const prompt = `
Проанализируй проект и дай рекомендации по улучшению:

ФАЙЛЫ: ${files.length}
ПРОБЛЕМЫ: ${issues.length}

ТИПЫ ПРОБЛЕМ:
${Object.entries(this.groupIssuesByType(issues)).map(([type, count]) => `- ${type}: ${count}`).join('\n')}

Предложи 5 конкретных рекомендаций по улучшению кода.
    `.trim();

    try {
      const response = await this.aiService.generateCode(prompt);
      return response.split('\n').filter(line => line.trim().length > 0);
    } catch {
      return [
        'Удалите неиспользуемый код для улучшения читаемости',
        'Вынесите дублирующуюся логику в отдельные функции',
        'Оптимизируйте циклы для улучшения производительности',
        'Улучшите структуру кода, разбив длинные функции',
        'Исправьте проблемы безопасности'
      ];
    }
  }

  private async generateRefactoringSummary(
    modifiedFiles: RefactoringResult['modifiedFiles'],
    deletedFiles: string[],
    issues: RefactoringIssue[]
  ): Promise<string> {
    return `
Рефакторинг завершен!

📊 Статистика:
• Измененных файлов: ${modifiedFiles.length}
• Удаленных файлов: ${deletedFiles.length}
• Исправленных проблем: ${issues.length}

🔧 Исправления:
${issues.map(issue => `• ${issue.description}`).join('\n')}

✅ Проект стал чище и производительнее!
    `.trim();
  }

  private groupIssuesByType(issues: RefactoringIssue[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    issues.forEach(issue => {
      grouped[issue.type] = (grouped[issue.type] || 0) + 1;
    });
    return grouped;
  }
}