export const FILE_CONSTANTS = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_EXTENSIONS: ['.txt', '.pdf', '.docx'] as const,
} as const;

export const CACHE_KEYS = {
  SEARCH: (path: string) => `search:${path}`,
  LAST_PROCESSED: (fileId: string) => `last_processed:${fileId}`,
} as const;
