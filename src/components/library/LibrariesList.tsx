
import React from 'react';
import { Library } from '../../models/types';
import { LibraryCard } from '../LibraryCard';

interface LibrariesListProps {
  libraries: Library[];
  onInstallLibrary: (id: string) => void;
  selectedLibraries: string[];
  onToggleSelection: (id: string) => void;
}

export const LibrariesList: React.FC<LibrariesListProps> = ({ 
  libraries, 
  onInstallLibrary, 
  selectedLibraries, 
  onToggleSelection 
}) => {
  if (libraries.length === 0) {
    return (
      <div className="text-center py-8 opacity-70">
        Библиотеки не найдены. Попробуйте изменить параметры поиска.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {libraries.map(library => (
        <LibraryCard
          key={library.id}
          library={library}
          onInstall={() => onInstallLibrary(library.id)}
          isSelected={selectedLibraries.includes(library.id)}
          onToggleSelect={() => onToggleSelection(library.id)}
        />
      ))}
    </div>
  );
};
