import React from 'react';
import { Calendar, FileType, HardDrive } from 'lucide-react';
import { SearchFilters as SearchFiltersType } from '../types/search';
import { SUPPORTED_EXTENSIONS } from '@/constants';


interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  
  const fileTypes = SUPPORTED_EXTENSIONS.map((ext) => ext.replace('.', '').toUpperCase());

  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div>
        <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          File Created Date
        </h3>
        <div className="space-y-2">
          <input
            type="date"
            value={formatDateForInput(filters.dateRange?.start || null)}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                dateRange: {
                  start: e.target.value ? new Date(e.target.value) : null,
                  end: filters.dateRange?.end || null,
                },
              })
            }
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="date"
            value={formatDateForInput(filters.dateRange?.end || null)}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                dateRange: {
                  start: filters.dateRange?.start || null,
                  end: e.target.value ? new Date(e.target.value) : null,
                },
              })
            }
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <FileType className="w-4 h-4 mr-2" />
          File Type
        </h3>
        <div className="space-y-2">
          {fileTypes.map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.fileType?.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...(filters.fileType || []), type]
                    : filters.fileType?.filter((t) => t !== type);
                  onFilterChange({ ...filters, fileType: newTypes });
                }}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <HardDrive className="w-4 h-4 mr-2" />
          File Size (MB)
        </h3>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="Min size"
            onChange={(e) =>
              onFilterChange({
                ...filters,
                minSize: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="number"
            placeholder="Max size"
            onChange={(e) =>
              onFilterChange({
                ...filters,
                maxSize: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};