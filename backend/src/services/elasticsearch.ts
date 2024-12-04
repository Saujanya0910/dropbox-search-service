import { Client } from '@elastic/elasticsearch';
import { CONFIG } from '../config';
import { IndexedDocument, SearchQuery } from '../types';

export const elasticSearchClient = new Client({
  node: CONFIG.elasticsearch.url,
  auth: {
    apiKey: CONFIG.elasticsearch.apiKey,
  },
});

export const setupElasticsearch = async () => {
  const [docIndexExists, pipelineIndexExists] = await Promise.all([
    elasticSearchClient.indices.exists({ index: CONFIG.elasticsearch.index }),
    elasticSearchClient.indices.exists({ index: CONFIG.elasticsearch.pipelineIndex }),
  ]);

  let pipelineExists = false;
  try {
    await elasticSearchClient.ingest.getPipeline({ id: CONFIG.elasticsearch.pipelineName });
    pipelineExists = true;
  } catch (error) {
    if ((error as any).meta?.statusCode !== 404) {
      throw error;
    }
  }
  
  if (!docIndexExists) {
    await elasticSearchClient.indices.create({
      index: CONFIG.elasticsearch.index,
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

  if (!pipelineExists) {
    await elasticSearchClient.ingest.putPipeline({
      id: CONFIG.elasticsearch.pipelineName,
      body: {
        description: 'Extract attachment information',
        processors: [
          {
            attachment: {
              field: 'data',
              target_field: 'attachment'
            }
          }
        ]
      }
    });
  }

  if (!pipelineIndexExists) {
    await elasticSearchClient.indices.create({
      index: CONFIG.elasticsearch.pipelineIndex,
      mappings: {
        properties: {
          data: { type: 'binary' },
          attachment: {
            properties: {
              content: { type: 'text' },
              content_type: { type: 'keyword' },
              language: { type: 'keyword' },
              title: { type: 'text' },
              date: { type: 'date' },
              author: { type: 'text' },
              keywords: { type: 'text' }
            }
          }
        }
      }
    });
  }
};

/**
 * Index a document in Elasticsearch
 * @param document 
 */
export const indexDocument = async (document: IndexedDocument) => {
  await elasticSearchClient.index({
    index: CONFIG.elasticsearch.index,
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

  const response = await elasticSearchClient.search({
    index: CONFIG.elasticsearch.index,
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