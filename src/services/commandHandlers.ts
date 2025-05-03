
import { terminalService } from './terminalService';

// Command handlers for different types of commands
export const commandHandlers = {
  // Python specific commands
  pythonCommands: {
    'print': async (args: string[]) => {
      const printContent = args.join(' ').replace(/['"]/g, '');
      
      // Check if it's a level print request
      if (printContent.toLowerCase().includes('level')) {
        const level = Math.floor(Math.random() * 100);
        return `Level: ${level}`;
      }
      
      return printContent;
    }
  },
  
  // Container management commands
  containerCommands: {
    'start': async (params: string[]) => {
      const language = params[0];
      if (!language) return 'Missing language parameter. Usage: container start [language]';
      
      terminalService.addLog(`Starting container for ${language}`, 'info');
      // Simulate container start delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return `Container for ${language} started successfully`;
    },
    
    'stop': async (params: string[]) => {
      const containerId = params[0];
      if (!containerId) return 'Missing container ID. Usage: container stop [id]';
      
      if (terminalService.stopContainer(containerId)) {
        terminalService.addLog(`Container ${containerId} stopped`, 'success');
        return `Container ${containerId} stopped successfully`;
      }
      
      return `Container ${containerId} not found`;
    },
    
    'list': async () => {
      const containers = terminalService.getContainers();
      terminalService.addLog(`Listing ${containers.length} containers`, 'info');
      
      if (containers.length === 0) {
        return 'No containers found';
      }
      
      return containers.map(c => 
        `${c.id}: ${c.name} (${c.language}) - ${c.status} - Memory: ${c.memoryUsage}MB - CPU: ${c.cpuUsage.toFixed(1)}%`
      ).join('\n');
    },
    
    'remove': async (params: string[]) => {
      const containerId = params[0];
      if (!containerId) return 'Missing container ID. Usage: container remove [id]';
      
      if (terminalService.removeContainer(containerId)) {
        terminalService.addLog(`Container ${containerId} removed`, 'success');
        return `Container ${containerId} removed successfully`;
      }
      
      return `Container ${containerId} not found`;
    },
    
    'logs': async (params: string[]) => {
      const containerId = params[0];
      if (!containerId) return 'Missing container ID. Usage: container logs [id]';
      
      const container = terminalService.getContainers().find(c => c.id === containerId);
      if (!container) return `Container ${containerId} not found`;
      
      terminalService.addLog(`Showing logs for container ${containerId}`, 'info');
      return `Logs for container ${containerId} (${container.name}):\n\n` +
             `[${new Date().toISOString()}] Started process\n` +
             `[${new Date().toISOString()}] Allocated ${container.memoryUsage}MB of memory\n` +
             `[${new Date().toISOString()}] Running in ${container.language} environment\n` +
             `[${new Date().toISOString()}] Status: ${container.status}`;
    }
  },
  
  // File system commands
  fileSystemCommands: {
    'ls': async () => {
      const files = [
        'main.py', 'utils.py', 'data.json', 'config.yml',
        'app.js', 'index.html', 'styles.css',
        'main.cpp', 'header.h', 'Makefile',
        'game.lua', 'engine.lua', 'sprites/'
      ];
      return files.join('\n');
    },
    
    'cd': async (args: string[]) => {
      const dir = args[0] || '';
      return `Changed directory to ${dir || '/'}`;
    },
    
    'pwd': async () => '/home/user/project',
    
    'cat': async (args: string[]) => {
      const file = args[0];
      if (!file) return 'Missing file parameter. Usage: cat [file]';
      
      // Simple mock content for a few files
      const fileContents: Record<string, string> = {
        'main.py': 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()',
        'app.js': 'console.log("Hello from JavaScript!");',
        'main.cpp': '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
        'game.lua': 'function love.draw()\n    love.graphics.print("Hello World!", 400, 300)\nend'
      };
      
      return fileContents[file] || `File ${file} not found`;
    }
  },
  
  // Package management commands
  packageCommands: {
    'install': async (args: string[]) => {
      const pkg = args[0];
      if (!pkg) return 'Missing package name. Usage: install [package]';
      
      terminalService.addLog(`Installing package: ${pkg}`, 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));
      terminalService.addLog(`Package ${pkg} installed successfully`, 'success');
      
      return `Package ${pkg} installed successfully`;
    },
    
    'uninstall': async (args: string[]) => {
      const pkg = args[0];
      if (!pkg) return 'Missing package name. Usage: uninstall [package]';
      
      terminalService.addLog(`Uninstalling package: ${pkg}`, 'info');
      await new Promise(resolve => setTimeout(resolve, 800));
      terminalService.addLog(`Package ${pkg} uninstalled`, 'success');
      
      return `Package ${pkg} uninstalled`;
    }
  },
  
  // Utility commands
  utilityCommands: {
    'clear': async () => {
      terminalService.clearLogs();
      return 'Terminal cleared';
    },
    
    'help': async () => {
      terminalService.addLog('Showing help information', 'info');
      return `Available commands:
- container start [language] - Start a container for the specified language
- container stop [id] - Stop a container
- container list - List all containers
- container remove [id] - Remove a container
- container logs [id] - Show logs for a container
- ls - List files
- cd [dir] - Change directory
- pwd - Show current directory
- echo [text] - Print text
- cat [file] - Show file contents
- install [package] - Install a package
- uninstall [package] - Uninstall a package
- run [file] - Run a file
- clear - Clear the terminal
- help - Show this help information`;
    },
    
    'echo': async (args: string[]) => args.join(' ')
  },
  
  // Code execution commands
  executionCommands: {
    'run': async (args: string[]) => {
      const file = args[0];
      if (!file) return 'Missing file parameter. Usage: run [file]';
      
      terminalService.addLog(`Running file: ${file}`, 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (file.endsWith('.py')) {
        terminalService.addLog('Python interpreter started', 'info');
        await new Promise(resolve => setTimeout(resolve, 500));
        terminalService.addLog('Output: Hello from Python!', 'success');
        return `Python 3.11.0\n>>> Executing Python script...\n\nHello, World!\nCalculation complete.\nLevel: ${Math.floor(Math.random() * 100)}\n\nScript executed successfully with exit code 0`;
      } else if (file.endsWith('.js')) {
        terminalService.addLog('Node.js runtime started', 'info');
        await new Promise(resolve => setTimeout(resolve, 500));
        terminalService.addLog('Output: Hello from JavaScript!', 'success');
        return `Node.js v16.14.2\n> Executing JavaScript...\n\nHello, World!\n{ status: 'success', data: { id: ${Math.floor(Math.random() * 1000)} } }\n\nExecution completed successfully`;
      } else if (file.endsWith('.cpp')) {
        terminalService.addLog('Compiling C++ code...', 'info');
        await new Promise(resolve => setTimeout(resolve, 1000));
        terminalService.addLog('Compilation successful', 'success');
        terminalService.addLog('Running executable...', 'info');
        await new Promise(resolve => setTimeout(resolve, 500));
        terminalService.addLog('Output: Hello from C++!', 'success');
        return `g++ (GCC) 11.2.0\n> Compiling C++ code...\n> Compilation successful\n> Running executable\n\nHello, World!\nProgram executed successfully with exit code 0`;
      } else if (file.endsWith('.lua')) {
        terminalService.addLog('Lua interpreter started', 'info');
        await new Promise(resolve => setTimeout(resolve, 500));
        terminalService.addLog('Running Lua script...', 'info');
        return `Lua 5.4.4\n> Executing Lua script...\n\nHello, World!\nGame initialized.\nFPS: 60\nResolution: 800x600\n\nScript executed successfully`;
      } else {
        return `Cannot execute file with extension ${file.split('.').pop()}`;
      }
    }
  }
};

// Helper functions for command processing
export const processContainerCommand = async (args: string[]): Promise<string> => {
  const subCommand = args[0]?.toLowerCase();
  if (!subCommand) return 'Missing subcommand. Available: start, stop, list, remove, logs';
  
  const params = args.slice(1);
  
  if (commandHandlers.containerCommands[subCommand as keyof typeof commandHandlers.containerCommands]) {
    return await commandHandlers.containerCommands[subCommand as keyof typeof commandHandlers.containerCommands](params);
  }
  
  return `Unknown container subcommand: ${subCommand}. Available: start, stop, list, remove, logs`;
};
