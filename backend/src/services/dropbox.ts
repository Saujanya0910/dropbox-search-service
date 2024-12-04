import { Dropbox, files } from 'dropbox';
import { CONFIG } from '../config';
import { indexDocument } from './elasticsearch';
import NodeCache from 'node-cache';
import { FILE_CONSTANTS, CACHE_KEYS } from '../constants';

const dropbox = new Dropbox({ accessToken: CONFIG.dropbox.accessToken });
const cache = new NodeCache({ stdTTL: CONFIG.cache.ttl });

/**
 * Get temporary link for Dropbox file
 * @param path 
 */
export const getDropboxUrl = async (path: string) => {
  const response = await dropbox.filesGetTemporaryLink({ path });
  return response.result.link;
};

/**
 * Get content of Dropbox file
 * @param path 
 */
export const getDropboxFileContent = async (path: string) => {
  const cachedContent = cache.get(CACHE_KEYS.SEARCH(path));
  if (cachedContent) {
    return cachedContent;
  }

  const response = await dropbox.filesDownload({ path });
  const content = (response.result as any).fileBinary.toString('utf8');
  cache.set(CACHE_KEYS.SEARCH(path), content);

  return content;
};

/**
 * Process a file and index it in Elasticsearch
 * @param file 
 */
export const processFile = async (file: files.FileMetadataReference) => {
  if (file.size > FILE_CONSTANTS.MAX_SIZE) {
    console.log(`Skipping ${file.path_display}: File too large`);
    return;
  }

  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  if (!FILE_CONSTANTS.SUPPORTED_EXTENSIONS.includes(extension as any)) {
    console.log(`Skipping ${file.path_display}: Unsupported file type`);
    return;
  }

  try {
    if (!file.path_lower) {
      throw new Error(`File path is undefined for file: ${file.name}`);
    }

    // Check if file was modified since last processing
    const lastProcessedTime = cache.get(CACHE_KEYS.LAST_PROCESSED(file.id)) as number | undefined;
    const fileModifiedTime = new Date(file.server_modified).getTime();

    if (typeof lastProcessedTime === 'number' && fileModifiedTime <= lastProcessedTime) {
      console.log(`Skipping ${file.path_display}: No changes since last processing`);
      return;
    }

    const response = await dropbox.filesDownload({ path: file.path_lower });
    const content = (response.result as any).fileBinary.toString('utf8');

    await indexDocument({
      id: file.id,
      fileName: file.name,
      fileType: extension.slice(1),
      fileSize: file.size,
      content,
      createdAt: new Date(file.client_modified),
      lastModified: new Date(file.server_modified),
      dropboxPath: file.path_lower,
    });

    // Store the processing timestamp
    cache.set(CACHE_KEYS.LAST_PROCESSED(file.id), fileModifiedTime);

    console.log(`Indexed ${file.path_display}`);
  } catch (error) {
    console.error(`Error processing ${file.path_display}:`, error);
  }
};

/**
 * Read files from Dropbox folder and handle indexing
 */
export const startFileIndexing = async () => {
  try {
    const response = await dropbox.filesListFolder({ path: '' });
    const files = response.result.entries.filter((entry) => entry['.tag'] === 'file');

    for (const file of files) {
      await processFile(file);
    }

    console.log('Initial indexing completed');
  } catch (error) {
    console.error('Error during initial indexing:', error);
  }
};

/**
 * Process changes after event update from Dropbox webhook
 */
export const handleDropboxChanges = async () => {
  try {
    const response = await dropbox.filesListFolderGetLatestCursor({ path: '' });
    const latestCursor = response.result.cursor;

    const changes = await dropbox.filesListFolderContinue({ cursor: latestCursor });
    
    for (const entry of changes.result.entries) {
      if (entry['.tag'] === 'file') {
        await processFile(entry);
        if (entry.path_lower) {
          cache.del(CACHE_KEYS.SEARCH(entry.path_lower));
        }
      }
    }
  } catch (error) {
    console.error('Error processing webhook changes:', error);
  }
};