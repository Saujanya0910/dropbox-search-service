import { Dropbox } from 'dropbox';
import { CONFIG } from '../config';
import { indexDocument } from './elasticsearch';
import NodeCache from 'node-cache';

const dropbox = new Dropbox({ accessToken: CONFIG.dropbox.accessToken });
const cache = new NodeCache({ stdTTL: CONFIG.cache.ttl });

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const SUPPORTED_EXTENSIONS = ['.txt', '.pdf', '.docx'];

export const getDropboxUrl = async (path: string) => {
  const response = await dropbox.filesGetTemporaryLink({ path });
  return response.result.link;
};

const processFile = async (file: any) => {
  if (file.size > MAX_FILE_SIZE) {
    console.log(`Skipping ${file.path_display}: File too large`);
    return;
  }

  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    console.log(`Skipping ${file.path_display}: Unsupported file type`);
    return;
  }

  try {
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

    console.log(`Indexed ${file.path_display}`);
  } catch (error) {
    console.error(`Error processing ${file.path_display}:`, error);
  }
};

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

let cursor: string | null = null;

export const startLongPolling = async () => {
  try {
    if (!cursor) {
      const response = await dropbox.filesListFolderGetLatestCursor({ path: '' });
      cursor = response.result.cursor;
    }

    const changes = await dropbox.filesListFolderLongpoll({ cursor });

    if (changes.result.changes) {
      const response = await dropbox.filesListFolderContinue({ cursor });
      cursor = response.result.cursor;

      for (const entry of response.result.entries) {
        if (entry['.tag'] === 'file') {
          await processFile(entry);
          cache.del(`search:${entry.path_lower}`);
        }
      }
    }

    // Continue long polling
    startLongPolling();
  } catch (error) {
    console.error('Error in long polling:', error);
    setTimeout(startLongPolling, 5000);
  }
};