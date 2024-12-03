export interface SearchResult {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  lastModified: string;
  dropboxUrl: string;
  highlights: string[];
}

export interface SearchFilters {
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  fileType?: string[];
  minSize?: number;
  maxSize?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
}