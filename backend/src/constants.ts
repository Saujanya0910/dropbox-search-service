import { CONFIG } from "./config";

export const FILE_CONSTANTS = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_EXTENSIONS: ['.txt', '.pdf', '.docx', '.doc', '.json'] as const,
} as const;

export const DROPBOX_CONSTANTS = {
  FOLDER_PATH: CONFIG.dropbox.folderPath,
  MAX_BATCH_SIZE: 3,
  FILE_TYPES: ['file', 'deleted'],
} as const;

export const CACHE_KEYS = {
  SEARCH: (path: string) => `search:${path}`,
  LAST_PROCESSED: (fileId: string) => `last_processed:${fileId}`,
} as const;
