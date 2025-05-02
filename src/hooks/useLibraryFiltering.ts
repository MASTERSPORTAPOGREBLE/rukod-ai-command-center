
import { useState } from 'react';
import { Library, ProgrammingLanguage } from '../models/types';
import { getFilteredLibraries, getLibrariesByCategory } from '../data/mockLibraries';

export const useLibraryFiltering = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | undefined>();
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showGamesOnly, setShowGamesOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  
  // Get libraries based on filters and categories
  const getLibraries = () => {
    if (selectedCategory) {
      const byCategory = getLibrariesByCategory(selectedCategory);
      return byCategory.filter(lib => {
        if (selectedLanguage && lib.language !== selectedLanguage) return false;
        if (showFreeOnly && lib.isPaid) return false;
        if (showGamesOnly && !lib.isGame) return false;
        if (searchQuery && !lib.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
            !lib.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      });
    } else {
      return getFilteredLibraries(
        selectedLanguage,
        searchQuery,
        showFreeOnly ? false : undefined,
        showGamesOnly ? true : undefined
      );
    }
  };
  
  return {
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    showFreeOnly,
    setShowFreeOnly,
    showGamesOnly,
    setShowGamesOnly,
    selectedCategory,
    setSelectedCategory,
    getLibraries,
  };
};
