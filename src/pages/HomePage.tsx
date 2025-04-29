
import React from 'react';
import { Link } from 'react-router-dom';
import { LibraryManager } from '../components/LibraryManager';
import { ContainerManager } from '../components/ContainerManager';
import { SystemStats } from '../components/SystemStats';
import { AIAssistant } from '../components/AIAssistant';
import { Terminal, FileCode } from 'lucide-react';
import { Button } from '../components/ui/button';

const HomePage = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-6">
            <SystemStats />
          </div>
          <div className="mb-6 flex justify-center space-x-4">
            <Link to="/terminal">
              <Button variant="outline" className="flex items-center space-x-2">
                <Terminal className="h-4 w-4" />
                <span>Командный терминал</span>
              </Button>
            </Link>
            <Link to="/code">
              <Button variant="outline" className="flex items-center space-x-2">
                <FileCode className="h-4 w-4" />
                <span>Редактор кода</span>
              </Button>
            </Link>
          </div>
          <LibraryManager />
        </div>
        
        <div className="md:col-span-1">
          <ContainerManager />
        </div>
      </div>
      <AIAssistant isActive={true} />
    </div>
  );
};

export default HomePage;
