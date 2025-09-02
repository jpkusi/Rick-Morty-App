import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useCharacter, useCharacterEpisodes } from '../../hooks/useCharacter';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ArrowLeft, MapPin, Calendar, Tv } from 'lucide-react';

export const Route = createFileRoute('/character/$characterId')({
  component: CharacterDetailPage,
});

function CharacterDetailPage() {
  const { characterId } = Route.useParams();
  const id = parseInt(characterId, 10);
  
  const { data: character, isLoading, error, refetch } = useCharacter(id);
  const { data: episodes, isLoading: episodesLoading } = useCharacterEpisodes(
    character?.episode || []
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading character details..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Failed to load character'}
        onRetry={() => refetch()}
      />
    );
  }

  if (!character) {
    return <ErrorMessage message="Character not found" />;
  }

  const statusColors = {
    Alive: 'text-green-600 bg-green-100 border-green-200',
    Dead: 'text-red-600 bg-red-100 border-red-200',
    unknown: 'text-gray-600 bg-gray-100 border-gray-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          search={{ page: 1 }}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Characters
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-64 w-full object-cover md:h-full md:w-64"
              src={character.image}
              alt={character.name}
            />
          </div>
          
          <div className="p-8 flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {character.name}
                </h1>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                    statusColors[character.status]
                  }`}
                >
                  {character.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Basic Information
                  </h3>
                  <dl className="mt-2 space-y-2">
                    <div>
                      <dt className="text-sm text-gray-600">Species</dt>
                      <dd className="text-sm font-medium text-gray-900">{character.species}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-600">Gender</dt>
                      <dd className="text-sm font-medium text-gray-900">{character.gender}</dd>
                    </div>
                    {character.type && (
                      <div>
                        <dt className="text-sm text-gray-600">Type</dt>
                        <dd className="text-sm font-medium text-gray-900">{character.type}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Location Details
                  </h3>
                  <dl className="mt-2 space-y-2">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-sm text-gray-600">Origin</dt>
                        <dd className="text-sm font-medium text-gray-900">{character.origin.name}</dd>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <dt className="text-sm text-gray-600">Last Known Location</dt>
                        <dd className="text-sm font-medium text-gray-900">{character.location.name}</dd>
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Created: {new Date(character.created).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Tv className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Featured Episodes</h3>
          </div>
        </div>
        
        <div className="p-6">
          {episodesLoading ? (
            <LoadingSpinner size="sm" text="Loading episodes..." />
          ) : episodes && episodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900 mb-1">{episode.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{episode.episode}</p>
                  <p className="text-xs text-gray-500">{episode.air_date}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No episode information available</p>
          )}
          
          {character.episode.length > 5 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Showing first 5 of {character.episode.length} episodes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}