import React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCharacters } from '../hooks/useCharacters';
import { CharacterTable } from '../components/CharacterTable';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { RefreshCw } from 'lucide-react';
import { z } from 'zod';

const charactersSearchSchema = z.object({
  page: z.number().min(1).catch(1),
});

export const Route = createFileRoute('/')({
  component: CharactersPage,
  validateSearch: charactersSearchSchema,
});

function CharactersPage() {
  const navigate = useNavigate({ from: '/' });
  const { page } = Route.useSearch();
  
  const { data, isLoading, error, refetch, isFetching } = useCharacters(page);

  const handlePageChange = (newPage: number) => {
    navigate({ search: { page: newPage } });
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading characters..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Failed to load characters'}
        onRetry={handleRefresh}
      />
    );
  }

  if (!data) {
    return <ErrorMessage message="No data available" onRetry={handleRefresh} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Characters</h2>
          <p className="text-gray-600 mt-1">
            Showing {data.results.length} of {data.info.count} characters
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <CharacterTable characters={data.results} />
      
      <Pagination
        currentPage={page}
        totalPages={data.info.pages}
        onPageChange={handlePageChange}
        isLoading={isFetching}
      />
    </div>
  );
}