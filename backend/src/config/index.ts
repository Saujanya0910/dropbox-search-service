import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  CORS: z.string().default('http://localhost:3000'),
  ELASTICSEARCH_URL: z.string(),
  ELASTICSEARCH_API_KEY: z.string(),
  ELASTICSEARCH_INDEX: z.string(),
  ELASTICSEARCH_PIPELINE_NAME: z.string(),
  ELASTICSEARCH_PIPELINE_INDEX: z.string(),
  DROPBOX_ACCESS_TOKEN: z.string(),
  DROPBOX_FOLDER_PATH: z.string(),
  INDEXING_INTERVAL_SECONDS: z.string().default('30'),
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),
  CACHE_TTL: z.string().default('3600'),
});

const env = envSchema.parse(process.env);

export const CONFIG = {
  port: parseInt(env.PORT, 10),
  cors: env.CORS.split(',').length ? env.CORS.split(',') : env.CORS,
  elasticsearch: {
    url: env.ELASTICSEARCH_URL,
    apiKey: env.ELASTICSEARCH_API_KEY,
    index: env.ELASTICSEARCH_INDEX,
    pipelineName : env.ELASTICSEARCH_PIPELINE_NAME,
    pipelineIndex : env.ELASTICSEARCH_PIPELINE_INDEX
  },
  dropbox: {
    accessToken: env.DROPBOX_ACCESS_TOKEN,
    folderPath: env.DROPBOX_FOLDER_PATH,
    indexingIntervalInSeconds: parseInt(env.INDEXING_INTERVAL_SECONDS || '120000')
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10000),
    max: parseInt(env.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  cache: {
    ttl: parseInt(env.CACHE_TTL, 10),
  },
} as const;