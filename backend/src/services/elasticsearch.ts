import { Client } from '@elastic/elasticsearch';
import { CONFIG } from '../config';
import { IndexedDocument, SearchQuery } from '../types';

const client = new Client({
  node: CONFIG.elasticsearch.url,
  auth: {
    apiKey: CONFIG.elasticsearch.apiKey,
  },
});

const INDEX_NAME = 'documents';

export const setupElasticsearch = async () => {
  const indexExists = await client.indices.exists({ index: INDEX_NAME });
  
  if (!indexExists) {
    await client.indices.create({
      index: INDEX_NAME,
      mappings: {
        properties: {
          fileName: { type: 'text' },
          content: { type: 'text' },
          fileType: { type: 'keyword' },
          fileSize: { type: 'long' },
          createdAt: { type: 'date' },
          lastModified: { type: 'date' },
          dropboxPath: { type: 'keyword' },
        },
      },
    });
  }
};

export const indexDocument = async (document: IndexedDocument) => {
  await client.index({
    index: INDEX_NAME,
    id: document.id,
    document,
  });
};

export const searchDocuments = async (query: SearchQuery) => {
  const { q, page = 1, limit = 10, dateRange, fileType, minSize, maxSize } = query;
  
  const must: any[] = [
    {
      multi_match: {
        query: q,
        fields: ['fileName^2', 'content'],
        fuzziness: 'AUTO',
      },
    },
  ];

  if (dateRange) {
    must.push({
      range: {
        createdAt: {
          gte: dateRange.start,
          lte: dateRange.end,
        },
      },
    });
  }

  if (fileType?.length) {
    must.push({
      terms: {
        fileType,
      },
    });
  }

  if (minSize || maxSize) {
    must.push({
      range: {
        fileSize: {
          ...(minSize && { gte: minSize * 1024 * 1024 }),
          ...(maxSize && { lte: maxSize * 1024 * 1024 }),
        },
      },
    });
  }

  const response = await client.search({
    index: INDEX_NAME,
    from: (page - 1) * limit,
    size: limit,
    query: {
      bool: { must },
    },
    highlight: {
      fields: {
        content: {},
      },
    },
  });

  return response;
};