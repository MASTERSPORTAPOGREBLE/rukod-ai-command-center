
import React from 'react';
import { LibraryManager } from '../components/LibraryManager';
import { ContainerManager } from '../components/ContainerManager';
import { SystemStats } from '../components/SystemStats';
import { AIAssistant } from '../components/AIAssistant';

const HomePage = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="mb-6">
            <SystemStats />
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
