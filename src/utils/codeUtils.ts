
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
