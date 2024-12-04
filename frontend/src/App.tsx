import { useState } from 'react';
import { useQuery } from 'react-query';
import { SearchBar } from './components/SearchBar';
import { SearchFilters } from './components/SearchFilters';
import { SearchResults } from './components/SearchResults';
import { searchDocuments } from './services/api';
import { SearchFilters as SearchFiltersType } from './types/search';

function App() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFiltersType>({});

  const { data, isLoading } = useQuery(
    ['search', query, filters],
    () => searchDocuments(query, filters),
    {
      enabled: !!query,
    }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Search</h1>
          <p className="mt-2 text-gray-600">
            Search through your documents with advanced filtering
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <SearchBar onSearch={setQuery} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters filters={filters} onFilterChange={setFilters} />
          </div>
          <div className="lg:col-span-3">
            <SearchResults
              results={data?.results || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;