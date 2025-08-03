import { SecureStorage, getEnvApiKey } from '../utils/security';
import { FileNode } from '../components/fileManager/FileManager';

export interface CloudDeployment {
  id: string;
  url: string;
  provider: 'replit' | 'github';
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export class CloudIntegrationService {
  
  /**
   * Deploy project to Replit
   */
  static async deployToReplit(projectName: string, files: FileNode[]): Promise<CloudDeployment> {
    const replitToken = getEnvApiKey('replit') || SecureStorage.getApiKey('replit');
    
    if (!replitToken) {
      throw new Error('Replit токен не настроен');
    }

    try {
      // Create a simplified Replit deployment structure
      const replitFiles = this.convertFilesToReplitFormat(files);
      
      // Simulate Replit API call (replace with actual Replit API)
      const response = await this.simulateReplitDeploy(projectName, replitFiles, replitToken);
      
      return {
        id: Date.now().toString(),
        url: response.url,
        provider: 'replit',
        status: 'success',
        message: 'Проект успешно развернут в Replit'
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        url: '',
        provider: 'replit',
        status: 'error',
        message: error instanceof Error ? error.message : 'Ошибка развертывания в Replit'
      };
    }
  }

  /**
   * Deploy project to GitHub Codespaces
   */
  static async deployToGitHub(projectName: string, files: FileNode[]): Promise<CloudDeployment> {
    const githubToken = getEnvApiKey('github') || SecureStorage.getApiKey('github');
    
    if (!githubToken) {
      throw new Error('GitHub токен не настроен');
    }

    try {
      // Create GitHub repository structure
      const githubFiles = this.convertFilesToGitHubFormat(files);
      
      // Simulate GitHub API call (replace with actual GitHub API)
      const response = await this.simulateGitHubDeploy(projectName, githubFiles, githubToken);
      
      return {
        id: Date.now().toString(),
        url: response.url,
        provider: 'github',
        status: 'success',
        message: 'Проект успешно создан в GitHub Codespaces'
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        url: '',
        provider: 'github',
        status: 'error',
        message: error instanceof Error ? error.message : 'Ошибка создания в GitHub'
      };
    }
  }

  /**
   * Convert files to Replit format
   */
  private static convertFilesToReplitFormat(files: FileNode[]): any {
    const replitFiles: { [key: string]: string } = {};
    
    const processFiles = (fileList: FileNode[], basePath = '') => {
      fileList.forEach(file => {
        const fullPath = basePath ? `${basePath}/${file.name}` : file.name;
        
        if (file.type === 'file' && file.content !== undefined) {
          replitFiles[fullPath] = file.content;
        } else if (file.type === 'folder' && file.children) {
          processFiles(file.children, fullPath);
        }
      });
    };

    processFiles(files);
    
    // Add Replit configuration files
    if (!replitFiles['.replit']) {
      replitFiles['.replit'] = this.generateReplitConfig(files);
    }
    
    if (!replitFiles['replit.nix']) {
      replitFiles['replit.nix'] = this.generateReplitNixConfig(files);
    }

    return replitFiles;
  }

  /**
   * Convert files to GitHub format
   */
  private static convertFilesToGitHubFormat(files: FileNode[]): any {
    const githubFiles: Array<{ path: string; content: string }> = [];
    
    const processFiles = (fileList: FileNode[], basePath = '') => {
      fileList.forEach(file => {
        const fullPath = basePath ? `${basePath}/${file.name}` : file.name;
        
        if (file.type === 'file' && file.content !== undefined) {
          githubFiles.push({
            path: fullPath,
            content: file.content
          });
        } else if (file.type === 'folder' && file.children) {
          processFiles(file.children, fullPath);
        }
      });
    };

    processFiles(files);
    
    // Add GitHub configuration files
    githubFiles.push({
      path: '.devcontainer/devcontainer.json',
      content: this.generateDevContainerConfig(files)
    });
    
    githubFiles.push({
      path: 'README.md',
      content: this.generateReadme(files)
    });

    return githubFiles;
  }

  /**
   * Generate Replit configuration
   */
  private static generateReplitConfig(files: FileNode[]): string {
    const hasReact = files.some(f => f.name.includes('package.json') && f.content?.includes('react'));
    const hasNode = files.some(f => f.name.includes('package.json'));
    const hasPython = files.some(f => f.name.endsWith('.py'));
    
    if (hasReact) {
      return `language = "nodejs"
run = "npm start"
[packager]
language = "nodejs"
[packager.features]
packageSearch = true
guessImports = true
[languages.javascript]
pattern = "**/{*.js,*.jsx,*.ts,*.tsx}"
[languages.javascript.languageServer]
start = "typescript-language-server --stdio"`;
    } else if (hasNode) {
      return `language = "nodejs"
run = "node index.js"
[packager]
language = "nodejs"`;
    } else if (hasPython) {
      return `language = "python3"
run = "python main.py"`;
    }
    
    return `language = "bash"
run = "echo 'Hello World!'"`;
  }

  /**
   * Generate Replit Nix configuration
   */
  private static generateReplitNixConfig(files: FileNode[]): string {
    const hasNode = files.some(f => f.name.includes('package.json'));
    const hasPython = files.some(f => f.name.endsWith('.py'));
    
    if (hasNode) {
      return `{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.nodePackages.npm
    pkgs.nodePackages.typescript
  ];
}`;
    } else if (hasPython) {
      return `{ pkgs }: {
  deps = [
    pkgs.python310Full
    pkgs.python310Packages.pip
  ];
}`;
    }
    
    return `{ pkgs }: {
  deps = [
    pkgs.bash
  ];
}`;
  }

  /**
   * Generate DevContainer configuration for GitHub Codespaces
   */
  private static generateDevContainerConfig(files: FileNode[]): string {
    const hasNode = files.some(f => f.name.includes('package.json'));
    const hasPython = files.some(f => f.name.endsWith('.py'));
    
    if (hasNode) {
      return JSON.stringify({
        name: "AI IDE Project",
        image: "mcr.microsoft.com/devcontainers/javascript-node:18",
        features: {
          "ghcr.io/devcontainers/features/github-cli:1": {}
        },
        postCreateCommand: "npm install",
        customizations: {
          vscode: {
            extensions: [
              "ms-vscode.vscode-typescript-next",
              "esbenp.prettier-vscode",
              "bradlc.vscode-tailwindcss"
            ]
          }
        }
      }, null, 2);
    } else if (hasPython) {
      return JSON.stringify({
        name: "AI IDE Python Project",
        image: "mcr.microsoft.com/devcontainers/python:3.10",
        features: {
          "ghcr.io/devcontainers/features/github-cli:1": {}
        },
        postCreateCommand: "pip install -r requirements.txt",
        customizations: {
          vscode: {
            extensions: [
              "ms-python.python",
              "ms-python.pylint"
            ]
          }
        }
      }, null, 2);
    }
    
    return JSON.stringify({
      name: "AI IDE Project",
      image: "mcr.microsoft.com/devcontainers/base:ubuntu",
      features: {
        "ghcr.io/devcontainers/features/github-cli:1": {}
      }
    }, null, 2);
  }

  /**
   * Generate README.md for the project
   */
  private static generateReadme(files: FileNode[]): string {
    const projectFiles = files.filter(f => f.type === 'file').map(f => f.name);
    
    return `# AI IDE Generated Project

Этот проект был создан с помощью AI IDE и автоматически развернут в GitHub Codespaces.

## Файлы проекта

${projectFiles.map(name => `- ${name}`).join('\n')}

## Как запустить

1. Откройте проект в GitHub Codespaces
2. Установите зависимости (если необходимо)
3. Запустите проект

## Создано с помощью

- [AI IDE](https://your-ide-url.com) - IDE с поддержкой ИИ
- Gemini 2.5 Flash - ИИ для генерации кода

Удачи в разработке! 🚀
`;
  }

  /**
   * Simulate Replit API deployment (replace with actual API calls)
   */
  private static async simulateReplitDeploy(projectName: string, files: any, token: string): Promise<{ url: string }> {
    // In a real implementation, this would make actual API calls to Replit
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    
    const replitUrl = `https://replit.com/@username/${projectName.toLowerCase().replace(/\s+/g, '-')}`;
    
    return { url: replitUrl };
  }

  /**
   * Simulate GitHub API deployment (replace with actual API calls)
   */
  private static async simulateGitHubDeploy(projectName: string, files: any, token: string): Promise<{ url: string }> {
    // In a real implementation, this would make actual API calls to GitHub
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    
    const githubUrl = `https://github.com/username/${projectName.toLowerCase().replace(/\s+/g, '-')}`;
    
    return { url: githubUrl };
  }

  /**
   * Get deployment status
   */
  static async getDeploymentStatus(deploymentId: string): Promise<CloudDeployment | null> {
    // In a real implementation, this would check the actual deployment status
    return null;
  }

  /**
   * Create download link for project as ZIP
   */
  static async createProjectZip(projectName: string, files: FileNode[]): Promise<string> {
    try {
      // For demo purposes, create a simple JSON structure
      // In production, you'd use a library like JSZip
      const projectData = {
        name: projectName,
        files: this.flattenFiles(files),
        createdAt: new Date().toISOString(),
        generator: 'AI IDE v1.0'
      };

      const blob = new Blob([JSON.stringify(projectData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      
      return url;
    } catch (error) {
      throw new Error('Ошибка создания архива проекта');
    }
  }

  /**
   * Flatten file structure for export
   */
  private static flattenFiles(files: FileNode[]): Array<{ path: string; content: string }> {
    const result: Array<{ path: string; content: string }> = [];
    
    const processFiles = (fileList: FileNode[], basePath = '') => {
      fileList.forEach(file => {
        const fullPath = basePath ? `${basePath}/${file.name}` : file.name;
        
        if (file.type === 'file' && file.content !== undefined) {
          result.push({
            path: fullPath,
            content: file.content
          });
        } else if (file.type === 'folder' && file.children) {
          processFiles(file.children, fullPath);
        }
      });
    };

    processFiles(files);
    return result;
  }
}