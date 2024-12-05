export interface SearchQuery {
  q: string;
  page?: number;
  limit?: number;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  fileType?: string[];
  minSize?: number;
  maxSize?: number;
}

export interface IndexedDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  content: string;
  createdAt: Date;
  lastModified: Date;
  dropboxPath: string;
}

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