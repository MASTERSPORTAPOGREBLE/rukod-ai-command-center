
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LibrariesContent } from '../components/LibrariesContent';

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Wrap the Libraries component with QueryClientProvider
const LibrariesWithQueryClient = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LibrariesContent />
    </QueryClientProvider>
  );
};

export default LibrariesWithQueryClient;
