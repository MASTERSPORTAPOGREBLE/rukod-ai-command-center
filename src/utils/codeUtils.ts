
import { ProgrammingLanguage } from '../models/types';

interface CodeFormatResult {
  formattedCode: string;
  changes: number;
}

interface CodeLintResult {
  issues: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }>;
}

interface CodeExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime?: number;
}

export const formatCode = (code: string, language: ProgrammingLanguage): Promise<CodeFormatResult> => {
  // This is a mock implementation. In a real application, this would use language-specific formatters
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple formatting for demonstration purposes
      let formattedCode = code;
      let changes = 0;
      
      switch(language) {
        case 'python':
          // Add consistent spacing
          const indentedPythonCode = code.split('\n').map(line => {
            const trimmedLine = line.trim();
            const leadingSpaces = line.search(/\S|$/);
            return ' '.repeat(leadingSpaces) + trimmedLine;
          }).join('\n');
          
          if (indentedPythonCode !== code) {
            formattedCode = indentedPythonCode;
            changes++;
          }
          break;
          
        case 'cpp':
        case 'javascript':
          // Add semicolons where needed
          const withSemicolons = code.split('\n').map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && 
                !trimmedLine.endsWith(';') && 
                !trimmedLine.endsWith('{') && 
                !trimmedLine.endsWith('}') &&
                !trimmedLine.endsWith(':') && 
                !trimmedLine.startsWith('//')) {
              return line + ';';
            }
            return line;
          }).join('\n');
          
          if (withSemicolons !== code) {
            formattedCode = withSemicolons;
            changes++;
          }
          break;
          
        default:
          // No formatting for other languages in this mock
          formattedCode = code;
      }
      
      resolve({ formattedCode, changes });
    }, 500);
  });
};

export const lintCode = (code: string, language: ProgrammingLanguage): Promise<CodeLintResult> => {
  // This is a mock implementation. In a real application, this would use language-specific linters
  return new Promise((resolve) => {
    setTimeout(() => {
      const issues: CodeLintResult['issues'] = [];
      
      // Very basic linting for demonstration purposes
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        
        // Check for TODOs
        if (line.toLowerCase().includes('todo')) {
          issues.push({
            line: lineNumber,
            column: line.toLowerCase().indexOf('todo') + 1,
            message: 'TODO comment found',
            severity: 'info'
          });
        }
        
        // Check for console logs in production code
        if ((language === 'javascript' && line.includes('console.log')) || 
            (language === 'python' && line.includes('print('))) {
          issues.push({
            line: lineNumber,
            column: 1,
            message: 'Debug statement found in code',
            severity: 'warning'
          });
        }
        
        // Check for potentially problematic code patterns
        if (language === 'python' && line.includes('except:') && !line.includes('except Exception')) {
          issues.push({
            line: lineNumber,
            column: line.indexOf('except:') + 1,
            message: 'Bare except clause should be avoided',
            severity: 'error'
          });
        }
        
        if (language === 'cpp' && line.includes('using namespace std;')) {
          issues.push({
            line: lineNumber,
            column: line.indexOf('using namespace std;') + 1,
            message: 'Prefer explicit namespaces over "using namespace std;"',
            severity: 'warning'
          });
        }
      });
      
      resolve({ issues });
    }, 800);
  });
};

// Новая функция для выполнения кода
export const executeCode = (code: string, language: ProgrammingLanguage): Promise<CodeExecutionResult> => {
  return new Promise((resolve) => {
    // Симулируем выполнение кода с задержкой для реализма
    setTimeout(() => {
      try {
        switch (language) {
          case 'python': {
            // Простой парсер для Python print
            const result = executePythonCode(code);
            resolve(result);
            break;
          }
          case 'javascript': {
            // Для JavaScript можем использовать eval с защитой
            const result = executeJavaScriptCode(code);
            resolve(result);
            break;
          }
          case 'cpp': {
            // Имитация C++ компиляции и выполнения
            const result = simulateCppExecution(code);
            resolve(result);
            break;
          }
          case 'lua': {
            // Имитация Lua интерпретатора
            const result = simulateLuaExecution(code);
            resolve(result);
            break;
          }
          default:
            resolve({
              success: false,
              output: '',
              error: `Язык программирования ${language} не поддерживается интерпретатором.`
            });
        }
      } catch (error) {
        resolve({
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Неизвестная ошибка выполнения'
        });
      }
    }, 800);
  });
};

// Обработка Python кода
function executePythonCode(code: string): CodeExecutionResult {
  // Проверяем наличие синтаксических ошибок
  if (code.includes('import tensorflow') || code.includes('import torch') || 
      code.includes('import pandas') || code.includes('import numpy')) {
    return {
      success: false,
      output: '',
      error: `ModuleNotFoundError: No module named '${code.match(/import (\w+)/)?.[1] || 'unknown'}'`
    };
  }
  
  try {
    // Поиск и выполнение print statements
    let output = '';
    const printRegex = /print\s*\((.*)\)/g;
    let match;
    
    while ((match = printRegex.exec(code)) !== null) {
      try {
        const content = match[1].trim();
        // Обрабатываем строки в кавычках
        if ((content.startsWith('"') && content.endsWith('"')) || 
            (content.startsWith("'") && content.endsWith("'"))) {
          output += content.substring(1, content.length - 1) + '\n';
        } 
        // Обрабатываем переменные и выражения
        else if (content.match(/^[a-zA-Z0-9_\+\-\*\/\s]+$/)) {
          // Простая имитация вычислений для демо
          if (content.match(/^\d+[\+\-\*\/]\d+$/)) {
            const result = eval(content); // Безопасно для простых арифметических выражений
            output += result + '\n';
          } else {
            // Проверяем на наличие необъявленных переменных
            const vars = content.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
            if (vars && vars.some(v => !code.includes(`${v} =`))) {
              throw new Error(`NameError: name '${vars.find(v => !code.includes(`${v} =`))}' is not defined`);
            }
            
            output += content + ' (симуляция значения)\n';
          }
        } else {
          output += `${content} (симуляция вывода)\n`;
        }
      } catch (e) {
        throw e;
      }
    }
    
    // Если нет print statements, но есть def/class - имитируем определение функций
    if (!output && (code.includes('def ') || code.includes('class '))) {
      const defMatches = code.match(/def (\w+)/g) || [];
      const classMatches = code.match(/class (\w+)/g) || [];
      
      if (defMatches.length > 0 || classMatches.length > 0) {
        output = 'Определены следующие элементы:\n';
        defMatches.forEach(match => {
          output += `- Функция ${match.replace('def ', '')}\n`;
        });
        classMatches.forEach(match => {
          output += `- Класс ${match.replace('class ', '')}\n`;
        });
      }
    }
    
    // Проверяем на наличие ошибок синтаксиса
    if (code.includes('while') && !code.includes(':')) {
      throw new Error('SyntaxError: expected \':\'');
    }
    
    if (code.includes('if') && !code.includes(':')) {
      throw new Error('SyntaxError: expected \':\'');
    }
    
    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
      throw new Error('SyntaxError: unbalanced parentheses');
    }
    
    return {
      success: output.length > 0,
      output: output.length > 0 ? output : 'Код выполнен успешно, но не произвел вывода.'
    };
  } catch (e) {
    return {
      success: false,
      output: '',
      error: e instanceof Error ? e.message : 'Неизвестная ошибка'
    };
  }
}

// Обработка JavaScript кода
function executeJavaScriptCode(code: string): CodeExecutionResult {
  try {
    // Подготавливаем безопасную среду выполнения
    let output = '';
    const sandboxConsole = {
      log: (...args: any[]) => {
        output += args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ') + '\n';
      },
      error: (...args: any[]) => {
        output += 'Error: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ') + '\n';
      },
      warn: (...args: any[]) => {
        output += 'Warning: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ') + '\n';
      }
    };
    
    // Проверяем на попытки использования небезопасных API
    const dangerousAPIs = ['document', 'window', 'localStorage', 'fetch', 'XMLHttpRequest'];
    if (dangerousAPIs.some(api => code.includes(api))) {
      throw new Error(`ReferenceError: ${dangerousAPIs.find(api => code.includes(api))} is not defined in this context`);
    }
    
    // Выполняем код с перехватом вывода
    if (code.includes('console.log')) {
      // Создаем функцию которая будет выполнять код с нашей заменой console
      const executeFunction = new Function('console', `
        try {
          ${code};
          return { success: true };
        } catch (e) {
          return { success: false, error: e };
        }
      `);
      
      const result = executeFunction(sandboxConsole);
      
      if (!result.success) {
        throw result.error;
      }
    } else {
      // Если нет console.log, проверим на наличие определения функций
      const functionMatches = code.match(/function (\w+)/g) || [];
      const constMatches = code.match(/const (\w+)/g) || [];
      const letMatches = code.match(/let (\w+)/g) || [];
      
      if (functionMatches.length > 0 || constMatches.length > 0 || letMatches.length > 0) {
        output = 'Определены следующие элементы:\n';
        functionMatches.forEach(match => {
          output += `- Функция ${match.replace('function ', '')}\n`;
        });
        constMatches.forEach(match => {
          output += `- Константа ${match.replace('const ', '')}\n`;
        });
        letMatches.forEach(match => {
          output += `- Переменная ${match.replace('let ', '')}\n`;
        });
      } else {
        // Иначе просто убедимся, что код синтаксически корректный
        new Function(code);
        output = 'Код выполнен успешно, но не произвел вывода.';
      }
    }
    
    return {
      success: true,
      output
    };
  } catch (e) {
    return {
      success: false,
      output: '',
      error: e instanceof Error ? e.message : 'Неизвестная ошибка'
    };
  }
}

// Имитация выполнения C++ кода
function simulateCppExecution(code: string): CodeExecutionResult {
  try {
    let output = '';
    
    // Проверяем на наличие ошибок компиляции
    if (!code.includes('main()') && !code.includes('main(')) {
      throw new Error('error: \'::main\' must return \'int\'');
    }
    
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
      throw new Error('error: expected \'}\'');
    }
    
    // Симулируем cout
    const coutMatches = code.match(/cout\s*<<\s*(.+?)\s*(<<?|;)/g) || [];
    coutMatches.forEach(match => {
      const content = match.replace(/cout\s*<<\s*/, '').replace(/\s*(<<?|;)$/, '');
      if (content.startsWith('"') && content.endsWith('"')) {
        output += content.substring(1, content.length - 1);
      } else if (content.startsWith('\'') && content.endsWith('\'')) {
        output += content.substring(1, content.length - 1);
      } else if (content === 'endl') {
        output += '\n';
      } else if (content.match(/^\d+$/)) {
        output += content;
      } else {
        output += content + ' (симуляция значения)';
      }
    });
    
    // Если есть endl, добавляем переводы строк
    output = output.replace(/endl/g, '\n');
    
    // Проверяем на ошибки ссылок на неопределенные переменные
    const varMatches = code.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || [];
    const definedVars = new Set<string>();
    
    code.split('\n').forEach(line => {
      const varDefMatch = line.match(/\b(int|float|double|char|bool|string)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (varDefMatch) {
        definedVars.add(varDefMatch[2]);
      }
    });
    
    for (const varName of varMatches) {
      if (!['cout', 'cin', 'endl', 'int', 'float', 'double', 'char', 'bool', 'string', 'if', 'else', 'for', 'while', 'return', 'using', 'namespace', 'std'].includes(varName) && 
          !definedVars.has(varName) && 
          !code.includes(`${varName}(`)) {
        const isAfterInclude = code.indexOf(varName) > code.indexOf('#include');
        const isLibraryName = code.includes(`#include <${varName}>`) || code.includes(`#include "${varName}"`);
        
        if (!isAfterInclude || !isLibraryName) {
          const isFunctionCall = code.includes(`${varName}(`);
          if (!isFunctionCall) {
            const isInInitialization = Array.from(definedVars).some(v => 
              code.includes(`${v} = ${varName}`) || code.includes(`${v}(${varName}`)
            );
            if (!isInInitialization && varName !== 'main' && !varName.match(/^\d+$/)) {
              // Это не определенная переменная, которая используется
              throw new Error(`error: '${varName}' was not declared in this scope`);
            }
          }
        }
      }
    }
    
    return {
      success: true,
      output: output || 'Программа выполнена успешно, без вывода.'
    };
  } catch (e) {
    return {
      success: false,
      output: '',
      error: e instanceof Error ? e.message : 'Неизвестная ошибка'
    };
  }
}

// Имитация выполнения Lua кода
function simulateLuaExecution(code: string): CodeExecutionResult {
  try {
    let output = '';
    
    // Simulating print execution
    const printMatches = code.match(/print\s*\((.*?)\)/g) || [];
    printMatches.forEach(match => {
      const content = match.replace(/print\s*\(/, '').replace(/\)$/, '');
      if ((content.startsWith('"') && content.endsWith('"')) || 
          (content.startsWith("'") && content.endsWith("'"))) {
        output += content.substring(1, content.length - 1) + '\n';
      } else if (content.match(/^\d+$/)) {
        output += content + '\n';
      } else {
        output += content + ' (симуляция значения)\n';
      }
    });
    
    // Check for basic syntax errors
    if ((code.match(/\(/g) || []).length !== (code.match(/\)/g) || []).length) {
      throw new Error('syntax error: unbalanced parentheses');
    }
    
    if (code.includes('function') && !code.includes('end')) {
      throw new Error('syntax error: expected \'end\' to close \'function\'');
    }
    
    if (code.includes('if') && !code.includes('end') && !code.includes('then')) {
      throw new Error('syntax error: \'then\' expected near end of line');
    }
    
    // If there's no output but code seems valid
    if (!output && code.trim()) {
      // Check for function definitions
      const funcMatches = code.match(/function\s+(\w+)/g) || [];
      if (funcMatches.length > 0) {
        output = 'Определены следующие элементы:\n';
        funcMatches.forEach(match => {
          output += `- Функция ${match.replace('function ', '')}\n`;
        });
      } else {
        output = 'Код выполнен успешно, но не произвел вывода.';
      }
    }
    
    return {
      success: true,
      output
    };
  } catch (e) {
    return {
      success: false,
      output: '',
      error: e instanceof Error ? e.message : 'Неизвестная ошибка'
    };
  }
}

export const generateCodeDocumentation = (code: string, language: ProgrammingLanguage): Promise<string> => {
  // This is a mock implementation. In a real application, this would use more sophisticated tools
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple documentation generation
      let documentation = `# Автоматически сгенерированная документация\n\n`;
      
      const lines = code.split('\n');
      
      // Extract functions and classes based on language
      switch(language) {
        case 'python':
          documentation += '## Функции и классы\n\n';
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detect Python functions
            if (line.startsWith('def ')) {
              const funcName = line.substring(4, line.indexOf('('));
              documentation += `### \`${funcName}\`\n\n`;
              
              // Look for docstring
              if (i + 1 < lines.length && (lines[i + 1].includes('"""') || lines[i + 1].includes("'''"))) {
                let docstring = '';
                let j = i + 1;
                while (j < lines.length && !((lines[j].endsWith('"""') || lines[j].endsWith("'''")) && j > i + 1)) {
                  docstring += lines[j].replace(/"""|'''/g, '') + '\n';
                  j++;
                }
                documentation += `${docstring}\n\n`;
              } else {
                documentation += `Нет документации для этой функции.\n\n`;
              }
            }
            
            // Detect Python classes
            if (line.startsWith('class ')) {
              const className = line.substring(6, line.indexOf(':'));
              documentation += `### Класс \`${className}\`\n\n`;
            }
          }
          break;
          
        case 'cpp':
          documentation += '## Функции и классы\n\n';
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detect C++ functions
            if ((line.includes('void') || line.includes('int') || line.includes('string') || 
                 line.includes('double') || line.includes('float') || line.includes('bool')) && 
                line.includes('(') && !line.includes(';')) {
              const funcName = line.substring(line.lastIndexOf(' ', line.indexOf('(')) + 1, line.indexOf('('));
              documentation += `### \`${funcName}\`\n\n`;
              documentation += `Нет документации для этой функции.\n\n`;
            }
            
            // Detect C++ classes
            if (line.startsWith('class ')) {
              const className = line.substring(6, line.indexOf('{') > 0 ? line.indexOf('{') : line.length).trim();
              documentation += `### Класс \`${className}\`\n\n`;
            }
          }
          break;
          
        case 'javascript':
          documentation += '## Функции и классы\n\n';
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detect JavaScript functions
            if (line.startsWith('function ') && line.includes('(')) {
              const funcName = line.substring(9, line.indexOf('('));
              documentation += `### \`${funcName}\`\n\n`;
              documentation += `Нет документации для этой функции.\n\n`;
            }
            
            // Detect JavaScript classes
            if (line.startsWith('class ')) {
              const className = line.substring(6, line.indexOf('{') > 0 ? line.indexOf('{') : line.length).trim();
              documentation += `### Класс \`${className}\`\n\n`;
            }
          }
          break;
          
        default:
          documentation += 'Для данного языка не реализована генерация документации.\n';
      }
      
      resolve(documentation);
    }, 1000);
  });
};
