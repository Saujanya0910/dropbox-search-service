import { Client } from '@elastic/elasticsearch';
import { CONFIG } from '../config';
import { elasticSearchClient, checkDocumentExists } from './elasticsearch';

/**
 * Parse file content based on file type
 */
export const parseFileContent = async (
  buffer: Buffer,
  metadata: { dropboxPath: string; lastModified: Date }
): Promise<string> => {
  // check if document already exists and is up to date
  const exists = await checkDocumentExists(metadata);
  if (exists) {
    console.log(`File ${metadata.dropboxPath} already processed with same lastModified, skipping...`);
    return '';
  }

  return await parseFileContentWithElastic(buffer, elasticSearchClient);
};

/**
 * Parse file content using Elasticsearch ingest pipeline
 * @param buffer
 * @param client
 */
export const parseFileContentWithElastic = async (buffer: Buffer, client: Client): Promise<string> => {
  try {
    const base64Content = buffer.toString('base64');
    const pipelineName = CONFIG.elasticsearch.pipelineName;
    const pipelineIndex = CONFIG.elasticsearch.pipelineIndex;

    // process the document & use the ingestion pipeline to extract the content
    const response = await client.index({
      pipeline: pipelineName,
      index: pipelineIndex,
      body: {
        data: base64Content
      }
    });
    const result = await client.get({
      index: pipelineIndex,
      id: response._id
    });

    const source = result._source as { attachment: { content: string } };
    return source.attachment.content || '';
  } catch (error) {
    console.error('Error parsing file with Elasticsearch:', error);
    throw new Error('Failed to parse file using Elasticsearch');
  }
};