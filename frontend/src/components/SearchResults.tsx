import React from 'react';
import { FileText, Calendar, HardDrive } from 'lucide-react';
import { SearchResult } from '../types/search';
import { formatDistanceToNow } from 'date-fns';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {result.dropboxUrl ? (
                  <a
                  href={result.dropboxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600"
                  >
                  {result.fileName}
                  </a>
                ) : (
                  <span>{result.fileName}</span>
                )}
              </h3>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDistanceToNow(new Date(result.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <span className="flex items-center">
                  <HardDrive className="w-4 h-4 mr-1" />
                  {(result.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                  {result.fileType}
                </span>
              </div>
            </div>
          </div>
          {result.highlights.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Matches:</h4>
              <div className="space-y-1">
                {result.highlights.map((highlight, index) => (
                  <p
                    key={index}
                    className="text-sm text-gray-600 bg-yellow-50 p-2 rounded"
                    dangerouslySetInnerHTML={{ __html: highlight }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};